'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { TECH_ITEMS, type TechItem } from './tech-items'

/**
 * "Collect My Tech Stack" — an interactive layer rendered INSIDE the existing profile Canvas
 * (no second canvas, no second render loop; everything runs in R3F's single frame loop).
 *
 *  • 8 collectible tech chips orbit the portrait; they drift away from the cursor, glow on hover,
 *    and can be collected by click / tap (fly to the HUD, burst into particles).
 *  • A small drone patrols the scene and occasionally hovers by an undiscovered chip, making it pulse.
 *  • Every so often a digital meteor streaks in and bursts into tech-coloured particles.
 *  • The mood (glow, speed) follows the live Mumbai weather type; night uses `is_day` from the API.
 *
 * No React state changes during animation: positions live in refs and are written straight to Three objects.
 */

export type SceneKey = 'sunny' | 'partly_cloudy' | 'cloudy' | 'foggy' | 'drizzle' | 'rainy' | 'stormy' | 'night' | 'loading'

type Mood = { glow: number; speed: number }
const MOODS: Record<SceneKey, Mood> = {
  sunny: { glow: 1, speed: 1 },
  partly_cloudy: { glow: 1, speed: 0.95 },
  cloudy: { glow: 0.85, speed: 0.85 },
  foggy: { glow: 0.8, speed: 0.7 },
  drizzle: { glow: 0.95, speed: 0.78 },
  rainy: { glow: 1, speed: 0.72 },
  stormy: { glow: 1.35, speed: 1.1 },
  night: { glow: 1.7, speed: 0.9 },
  loading: { glow: 1, speed: 1 },
}

type Fx = {
  emit: (x: number, y: number, z: number, color: THREE.ColorRepresentation, count: number, speed?: number) => void
}
type Shared = {
  fx: Fx | null
  orbPos: Record<string, THREE.Vector3>
  collect: Record<string, () => void>
  hint: { id: string | null; until: number }
  mood: Mood
  hud: THREE.Vector3
  pointer: { x: number; y: number; active: boolean }
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeOutBack = (t: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}

function makeChipTexture(item: TechItem) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  const grad = g.createLinearGradient(0, 0, 256, 256)
  grad.addColorStop(0, '#2a2a2e')
  grad.addColorStop(1, '#141416')
  g.fillStyle = grad
  roundRect(g, 0, 0, 256, 256, 38)
  g.fill()
  g.strokeStyle = 'rgba(245,240,230,0.16)'
  g.lineWidth = 3
  roundRect(g, 8, 8, 240, 240, 31)
  g.stroke()
  g.fillStyle = item.color
  roundRect(g, 28, 28, 46, 6, 3)
  g.fill()
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.font = `700 ${item.abbr.length > 1 ? 98 : 118}px Inter, system-ui, sans-serif`
  g.shadowColor = item.color
  g.shadowBlur = 26
  g.fillStyle = '#F5F0E6'
  g.fillText(item.abbr, 128, 116)
  g.shadowBlur = 0
  g.font = '600 25px "JetBrains Mono", ui-monospace, monospace'
  g.fillStyle = item.color
  g.fillText(item.name.toUpperCase(), 128, 208)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function makeGlowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.35, 'rgba(255,255,255,0.45)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

function makeStreakTexture() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 16
  const g = c.getContext('2d')!
  const grad = g.createLinearGradient(0, 0, 256, 0)
  grad.addColorStop(0, 'rgba(212,255,79,0)')
  grad.addColorStop(0.7, 'rgba(255,140,90,0.7)')
  grad.addColorStop(1, 'rgba(255,92,57,1)')
  g.fillStyle = grad
  g.fillRect(0, 4, 256, 8)
  return new THREE.CanvasTexture(c)
}

/* ═══════════ Particle bursts (one pooled Points object) ═══════════ */
function FxSystem({ shared, count }: { shared: React.MutableRefObject<Shared>; count: number }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    g.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    g.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(count), 1))
    g.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(count), 1))
    return g
  }, [count])

  const data = useRef({
    vel: new Float32Array(count * 3),
    life: new Float32Array(count),
    max: new Float32Array(count),
    next: 0,
    activeUntil: 0,
  })

  useEffect(() => {
    const d = data.current
    const c = new THREE.Color()
    const pos = geo.getAttribute('position') as THREE.BufferAttribute
    const col = geo.getAttribute('aColor') as THREE.BufferAttribute
    const size = geo.getAttribute('aSize') as THREE.BufferAttribute
    shared.current.fx = {
      emit(x, y, z, color, n, speed = 1) {
        c.set(color)
        for (let k = 0; k < n; k++) {
          const i = d.next
          d.next = (d.next + 1) % count
          const th = Math.random() * Math.PI * 2
          const ph = Math.acos(2 * Math.random() - 1)
          const sp = speed * (0.5 + Math.random() * 1.5)
          d.vel[i * 3] = Math.sin(ph) * Math.cos(th) * sp
          d.vel[i * 3 + 1] = Math.sin(ph) * Math.sin(th) * sp
          d.vel[i * 3 + 2] = Math.cos(ph) * sp * 0.6
          d.life[i] = d.max[i] = 0.8 + Math.random() * 0.9
          pos.setXYZ(i, x, y, z)
          col.setXYZ(i, c.r, c.g, c.b)
          size.setX(i, 0.05 + Math.random() * 0.08)
        }
        d.activeUntil = performance.now() + 2000
      },
    }
    return () => {
      shared.current.fx = null
    }
  }, [geo, count, shared])

  useEffect(() => () => geo.dispose(), [geo])

  useFrame((_, dt0) => {
    const d = data.current
    if (performance.now() > d.activeUntil) return
    const dt = Math.min(dt0, 0.05)
    const pos = geo.getAttribute('position') as THREE.BufferAttribute
    const alpha = geo.getAttribute('aAlpha') as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      if (d.life[i] <= 0) {
        alpha.setX(i, 0)
        continue
      }
      d.life[i] -= dt
      const damp = Math.pow(0.04, dt)
      d.vel[i * 3] *= damp
      d.vel[i * 3 + 1] = d.vel[i * 3 + 1] * damp - dt * 0.25
      d.vel[i * 3 + 2] *= damp
      pos.setXYZ(i, pos.getX(i) + d.vel[i * 3] * dt, pos.getY(i) + d.vel[i * 3 + 1] * dt, pos.getZ(i) + d.vel[i * 3 + 2] * dt)
      alpha.setX(i, Math.max(0, d.life[i] / d.max[i]))
    }
    pos.needsUpdate = true
    alpha.needsUpdate = true
    ;(geo.getAttribute('aColor') as THREE.BufferAttribute).needsUpdate = true
    ;(geo.getAttribute('aSize') as THREE.BufferAttribute).needsUpdate = true
  })

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        transparent
        depthWrite={false}
        vertexShader={`
          attribute vec3 aColor; attribute float aAlpha; attribute float aSize;
          varying vec3 vColor; varying float vAlpha;
          void main() {
            vColor = aColor; vAlpha = aAlpha;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * 420.0 / -mv.z;
            gl_Position = projectionMatrix * mv;
          }`}
        fragmentShader={`
          varying vec3 vColor; varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.12, d) * vAlpha;
            if (a < 0.01) discard;
            gl_FragColor = vec4(vColor, a);
          }`}
      />
    </points>
  )
}

/* ═══════════ A collectible tech chip ═══════════ */
function Orb({
  item, index, total, shared, rx, ry, glowTex, reduced, low, collectedRef, onCollect,
}: {
  item: TechItem; index: number; total: number
  shared: React.MutableRefObject<Shared>
  rx: number; ry: number
  glowTex: THREE.Texture
  reduced: boolean; low: boolean
  collectedRef: React.MutableRefObject<Set<string>>
  onCollect: (id: string) => void
}) {
  const { gl } = useThree()
  const group = useRef<THREE.Group>(null)
  const rimMat = useRef<THREE.MeshBasicMaterial>(null)
  const tex = useMemo(() => makeChipTexture(item), [item])
  useEffect(() => () => tex.dispose(), [tex])

  const st = useRef({
    state: 'idle' as 'idle' | 'collecting' | 'gone',
    t: 0,
    appear: 0,
    hover: 0,
    hovered: false,
    offX: 0,
    offY: 0,
    start: new THREE.Vector3(),
    pos: new THREE.Vector3(),
  })
  const a0 = (index / total) * Math.PI * 2
  const rimColor = index % 2 === 0 ? '#FF5C39' : '#D4FF4F'
  const baseScale = low ? 0.68 : 1

  const collect = () => {
    const s = st.current
    if (s.state !== 'idle' || collectedRef.current.has(item.id)) return
    s.state = 'collecting'
    s.t = 0
    s.start.copy(s.pos)
    shared.current.fx?.emit(s.pos.x, s.pos.y, s.pos.z, item.color, low ? 18 : 30, 1.4)
    shared.current.fx?.emit(s.pos.x, s.pos.y, s.pos.z, rimColor, low ? 10 : 18, 1)
    onCollect(item.id)
  }

  useEffect(() => {
    shared.current.collect[item.id] = collect
    shared.current.orbPos[item.id] = st.current.pos
    return () => {
      delete shared.current.collect[item.id]
      delete shared.current.orbPos[item.id]
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id])

  const setCursor = (on: boolean) => {
    const el = gl.domElement
    if (on) el.dataset.cursor = 'interactive'
    else delete el.dataset.cursor
    // the custom cursor listens to mouseover; re-fire it so it reacts while the pointer is stationary
    el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
  }

  useFrame((state, dt0) => {
    const g = group.current
    if (!g) return
    const s = st.current
    const sh = shared.current
    const dt = Math.min(dt0, 0.05)
    const clock = state.clock.elapsedTime

    // reset support: parent clears the set → bring the chip back
    if (s.state === 'gone' && !collectedRef.current.has(item.id)) {
      s.state = 'idle'
      s.appear = 0
      g.visible = true
    }
    if (s.state === 'gone') return

    /* orbit position */
    const t = reduced ? 0 : clock * sh.mood.speed
    const ang = a0 + t * 0.14
    let x = Math.cos(ang) * rx
    let y = Math.sin(ang) * ry * 0.92 + (reduced ? 0 : Math.sin(clock * 0.9 + index * 1.7) * 0.09)
    const z = -Math.sin(ang) * 0.85

    /* drift away from the cursor */
    let tx = 0
    let ty = 0
    if (sh.pointer.active && !reduced && s.state === 'idle') {
      const dx = x - sh.pointer.x
      const dy = y - sh.pointer.y
      const d = Math.hypot(dx, dy)
      if (d < 1.15 && d > 0.001) {
        const push = ((1.15 - d) / 1.15) * 0.55
        tx = (dx / d) * push
        ty = (dy / d) * push
      }
    }
    const k = 1 - Math.exp(-dt * 5)
    s.offX += (tx - s.offX) * k
    s.offY += (ty - s.offY) * k
    x += s.offX
    y += s.offY
    s.pos.set(x, y, z)

    /* appear (staggered pop-in) */
    s.appear += dt
    const appearScale = easeOutBack(clamp((s.appear - index * 0.12) / 0.7, 0, 1))

    s.hover += ((s.hovered ? 1 : 0) - s.hover) * (1 - Math.exp(-dt * 9))

    if (s.state === 'idle') {
      g.position.set(x, y, z)
      g.rotation.y = (reduced ? 0 : Math.sin(clock * 0.6 + index) * 0.32) + s.hover * 0.25
      g.rotation.x = reduced ? 0 : Math.sin(clock * 0.5 + index * 1.3) * 0.1
      g.rotation.z = 0
      g.scale.setScalar(baseScale * appearScale * (1 + s.hover * 0.18))
    } else {
      s.t += dt / 0.7
      const p = easeInOutCubic(clamp(s.t, 0, 1))
      g.position.lerpVectors(s.start, sh.hud, p)
      g.position.y += Math.sin(Math.PI * p) * 0.55
      g.rotation.y = p * Math.PI * 2
      g.rotation.x = 0
      g.rotation.z = Math.sin(p * Math.PI) * 0.35
      g.scale.setScalar(baseScale * (1.05 - 0.88 * (1 - Math.pow(1 - p, 3))))
      if (s.t >= 1) {
        s.state = 'gone'
        g.visible = false
        sh.fx?.emit(sh.hud.x, sh.hud.y, sh.hud.z, item.color, low ? 10 : 16, 0.8)
      }
    }

    /* rim glow: breathe + hover + drone hint, scaled by weather mood */
    if (rimMat.current) {
      const now = performance.now()
      const hinted = sh.hint.id === item.id && now < sh.hint.until
      const pulse = hinted ? 0.35 + 0.3 * Math.sin(now * 0.008) : 0
      rimMat.current.opacity = clamp((0.2 + 0.1 * Math.sin(clock * 1.6 + index) + s.hover * 0.35 + pulse) * sh.mood.glow, 0, 0.9)
    }
  })

  return (
    <group ref={group} scale={0.001}>
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[1.25, 1.25]} />
        <meshBasicMaterial ref={rimMat} map={glowTex} color={rimColor} transparent opacity={0.25} depthWrite={false} />
      </mesh>
      <RoundedBox
        args={[0.66, 0.66, 0.14]}
        radius={0.09}
        smoothness={3}
        onPointerOver={(e) => {
          e.stopPropagation()
          st.current.hovered = true
          setCursor(true)
        }}
        onPointerOut={() => {
          st.current.hovered = false
          setCursor(false)
        }}
        onClick={(e) => {
          e.stopPropagation()
          collect()
        }}
      >
        <meshStandardMaterial color="#1b1b1e" roughness={0.35} metalness={0.55} />
      </RoundedBox>
      <mesh position={[0, 0, 0.072]}>
        <planeGeometry args={[0.62, 0.62]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      {/* same artwork on the back, so the chip never shows a blank dark side while it turns */}
      <mesh position={[0, 0, -0.072]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.62, 0.62]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  )
}

/* ═══════════ Autonomous drone ═══════════ */
// one saturated colour per rotor: orange, lime, cyan, violet
const ROTOR_COLORS = ['#FF5C39', '#9BD41F', '#1FB6F2', '#A855F7']

function Drone({ shared, rx, ry, low, collectedRef }: {
  shared: React.MutableRefObject<Shared>; rx: number; ry: number; low: boolean
  collectedRef: React.MutableRefObject<Set<string>>
}) {
  const root = useRef<THREE.Group>(null)
  const blades = useRef<(THREE.Mesh | null)[]>([])
  const st = useRef({
    pos: new THREE.Vector3(rx * 0.9, 0.2, 0.8),
    prev: new THREE.Vector3(),
    target: new THREE.Vector3(),
    mode: 'patrol' as 'patrol' | 'visit',
    modeStart: 0,
    visitId: '',
    hinted: false,
    nextVisit: 7,
    roll: 0,
    yaw: 0,
  })

  useFrame((state, dt0) => {
    const g = root.current
    if (!g) return
    const s = st.current
    const dt = Math.min(dt0, 0.05)
    const clock = state.clock.elapsedTime

    if (s.mode === 'patrol') {
      const a = clock * 0.2 + Math.sin(clock * 0.37) * 0.6
      s.target.set(Math.cos(a) * rx * 0.88, Math.sin(a) * ry * 0.82 + 0.1, 0.8 + Math.sin(clock * 0.7) * 0.3)
      if (clock > s.nextVisit) {
        const open = Object.keys(shared.current.orbPos).filter((id) => !collectedRef.current.has(id))
        if (open.length) {
          s.mode = 'visit'
          s.modeStart = clock
          s.visitId = open[Math.floor(Math.random() * open.length)]
          s.hinted = false
        } else {
          s.nextVisit = clock + 10
        }
      }
    } else {
      const op = shared.current.orbPos[s.visitId]
      if (op) s.target.set(op.x + 0.55, op.y + 0.5, op.z + 0.35)
      const el = clock - s.modeStart
      if (el > 2.2 && !s.hinted) {
        s.hinted = true
        shared.current.hint = { id: s.visitId, until: performance.now() + 3200 }
      }
      if (el > 5.2) {
        s.mode = 'patrol'
        s.nextVisit = clock + 11 + Math.random() * 6
      }
    }

    s.prev.copy(s.pos)
    s.pos.lerp(s.target, 1 - Math.exp(-dt * (s.mode === 'visit' ? 2.2 : 1.5)))
    const vx = dt > 0 ? (s.pos.x - s.prev.x) / dt : 0
    s.roll += (clamp(-vx * 0.12, -0.45, 0.45) - s.roll) * (1 - Math.exp(-dt * 4))
    s.yaw += (clamp(vx * 0.15, -0.5, 0.5) - s.yaw) * (1 - Math.exp(-dt * 3))

    g.position.set(s.pos.x, s.pos.y + Math.sin(clock * 3) * 0.015, s.pos.z)
    g.rotation.z = s.roll
    g.rotation.y = s.yaw
    g.rotation.x = Math.sin(clock * 1.7) * 0.05
    blades.current.forEach((b) => {
      if (b) b.rotation.y += dt * 46
    })
  })

  const arm = (rz: number) => (
    <group rotation={[0, rz, 0]} key={rz}>
      <mesh position={[0.16, 0, 0]}>
        <boxGeometry args={[0.3, 0.016, 0.016]} />
        <meshStandardMaterial color="#222226" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  )

  return (
    <group ref={root} scale={low ? 0.8 : 1}>
      <mesh scale={[1, 0.52, 1]}>
        <sphereGeometry args={[0.11, 18, 12]} />
        <meshStandardMaterial color="#26262a" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <torusGeometry args={[0.118, 0.007, 8, 28]} />
        <meshBasicMaterial color="#D4FF4F" toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.05, 0.02]}>
        <sphereGeometry args={[0.026, 10, 8]} />
        <meshBasicMaterial color="#FF5C39" toneMapped={false} />
      </mesh>
      {[Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4].map(arm)}
      {[Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4].map((a, i) => (
        <group key={a} position={[Math.cos(a) * 0.31, 0.03, -Math.sin(a) * 0.31]}>
          {/* translucent rotor disc + a solid rim so each wing stays visible on any background */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.1, 20]} />
            <meshBasicMaterial color={ROTOR_COLORS[i]} transparent opacity={0.5} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.094, 0.1, 24]} />
            <meshBasicMaterial color={ROTOR_COLORS[i]} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
          <mesh ref={(m) => { blades.current[i] = m }}>
            <boxGeometry args={[0.2, 0.006, 0.016]} />
            <meshBasicMaterial color={ROTOR_COLORS[i]} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ═══════════ Meteor event ═══════════ */
function Meteor({ shared, vw, vh, streakTex, glowTex }: {
  shared: React.MutableRefObject<Shared>; vw: number; vh: number
  streakTex: THREE.Texture; glowTex: THREE.Texture
}) {
  const g = useRef<THREE.Group>(null)
  const st = useRef({
    active: false,
    t: 0,
    dur: 1.15,
    next: 6,
    from: new THREE.Vector3(),
    to: new THREE.Vector3(),
  })
  const COLORS = useMemo(() => TECH_ITEMS.map((t) => t.color), [])

  useFrame((state, dt0) => {
    const grp = g.current
    if (!grp) return
    const s = st.current
    const dt = Math.min(dt0, 0.05)
    const clock = state.clock.elapsedTime

    if (!s.active) {
      grp.visible = false
      if (clock >= s.next) {
        s.active = true
        s.t = 0
        s.dur = 1.0 + Math.random() * 0.4
        s.from.set(vw * 0.58, vh * 0.58, -0.3)
        s.to.set((Math.random() - 0.5) * 2.6, (Math.random() - 0.4) * 1.5, 0.4)
        const ang = Math.atan2(s.to.y - s.from.y, s.to.x - s.from.x)
        grp.rotation.z = ang
        grp.visible = true
      }
      return
    }

    s.t += dt / s.dur
    const e = Math.pow(clamp(s.t, 0, 1), 1.7)
    grp.position.lerpVectors(s.from, s.to, e)
    grp.scale.setScalar(1 - e * 0.35)

    if (s.t >= 1) {
      s.active = false
      s.next = clock + 14 + Math.random() * 9
      const fx = shared.current.fx
      if (fx) {
        fx.emit(s.to.x, s.to.y, s.to.z, '#FF5C39', 28, 1.5)
        fx.emit(s.to.x, s.to.y, s.to.z, '#D4FF4F', 20, 1.2)
        for (let i = 0; i < 4; i++) fx.emit(s.to.x, s.to.y, s.to.z, COLORS[Math.floor(Math.random() * COLORS.length)], 7, 1.7)
      }
    }
  })

  return (
    <group ref={g} visible={false}>
      <mesh position={[-0.42, 0, 0]}>
        <planeGeometry args={[0.95, 0.07]} />
        <meshBasicMaterial map={streakTex} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh>
        <planeGeometry args={[0.34, 0.34]} />
        <meshBasicMaterial map={glowTex} color="#FF5C39" transparent depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[0.035, 12]} />
        <meshBasicMaterial color="#FFF3E6" toneMapped={false} />
      </mesh>
    </group>
  )
}

/* ═══════════ Pointer in world space (for the cursor-drift effect) ═══════════ */
function usePointerWorld(shared: React.MutableRefObject<Shared>) {
  const { gl, viewport } = useThree()
  useEffect(() => {
    const el = gl.domElement
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const r = el.getBoundingClientRect()
      shared.current.pointer.x = ((e.clientX - r.left) / r.width - 0.5) * viewport.width
      shared.current.pointer.y = -((e.clientY - r.top) / r.height - 0.5) * viewport.height + 0.3
      shared.current.pointer.active = true
    }
    const leave = () => {
      shared.current.pointer.active = false
    }
    el.addEventListener('pointermove', move, { passive: true })
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [gl, viewport.width, viewport.height, shared])
}

/* ═══════════ Public component ═══════════ */
export type TechUniverseProps = {
  scene: SceneKey
  reduced: boolean
  low: boolean
  collectedRef: React.MutableRefObject<Set<string>>
  onCollect: (id: string) => void
  /** increments when the HUD asks to reveal the next technology (keyboard / tap-friendly path) */
  revealToken: number
  /** increments when every technology was discovered → celebration burst */
  celebrateToken: number
}

export default function TechUniverse({ scene, reduced, low, collectedRef, onCollect, revealToken, celebrateToken }: TechUniverseProps) {
  const { viewport } = useThree()
  const shared = useRef<Shared>({
    fx: null,
    orbPos: {},
    collect: {},
    hint: { id: null, until: 0 },
    mood: MOODS.sunny,
    hud: new THREE.Vector3(),
    pointer: { x: 0, y: 0, active: false },
  })

  // keep chips fully inside the canvas: half the viewport minus the chip's half-size, with a floor for tiny screens
  const rx = clamp(viewport.width * 0.42, 1.1, 3.5)
  const ry = clamp(viewport.height * 0.34, 1.0, 1.95)

  shared.current.mood = MOODS[scene] ?? MOODS.sunny
  shared.current.hud.set(viewport.width * 0.4, -viewport.height * 0.4 + 0.3, 0.5)

  usePointerWorld(shared)

  const glowTex = useMemo(() => makeGlowTexture(), [])
  const streakTex = useMemo(() => makeStreakTexture(), [])
  useEffect(
    () => () => {
      glowTex.dispose()
      streakTex.dispose()
    },
    [glowTex, streakTex],
  )

  /* HUD → reveal the next undiscovered technology */
  const lastReveal = useRef(revealToken)
  useEffect(() => {
    if (revealToken === lastReveal.current) return
    lastReveal.current = revealToken
    const next = TECH_ITEMS.find((t) => !collectedRef.current.has(t.id))
    if (next) shared.current.collect[next.id]?.()
  }, [revealToken, collectedRef])

  /* all collected → celebration around the portrait */
  const lastCelebrate = useRef(celebrateToken)
  useEffect(() => {
    if (celebrateToken === lastCelebrate.current) return
    lastCelebrate.current = celebrateToken
    const fx = shared.current.fx
    if (!fx) return
    TECH_ITEMS.forEach((t, i) => {
      const a = (i / TECH_ITEMS.length) * Math.PI * 2
      window.setTimeout(() => shared.current.fx?.emit(Math.cos(a) * rx * 0.7, Math.sin(a) * ry * 0.7, 0.4, t.color, low ? 14 : 24, 1.5), i * 90)
    })
  }, [celebrateToken, rx, ry, low])

  return (
    <>
      <FxSystem shared={shared} count={low ? 110 : 260} />
      {TECH_ITEMS.map((item, i) => (
        <Orb
          key={item.id}
          item={item}
          index={i}
          total={TECH_ITEMS.length}
          shared={shared}
          rx={rx}
          ry={ry}
          glowTex={glowTex}
          reduced={reduced}
          low={low}
          collectedRef={collectedRef}
          onCollect={onCollect}
        />
      ))}
      {!reduced && <Drone shared={shared} rx={rx} ry={ry} low={low} collectedRef={collectedRef} />}
      {!reduced && <Meteor shared={shared} vw={viewport.width} vh={viewport.height} streakTex={streakTex} glowTex={glowTex} />}
    </>
  )
}
