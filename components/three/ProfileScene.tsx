'use client'

import { useRef, useMemo, Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture, Line } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Weather type ────────────────────────────────────────────── */
type WeatherType = 'sunny' | 'partly_cloudy' | 'cloudy' | 'foggy' | 'drizzle' | 'rainy' | 'stormy' | 'loading'

function codeToWeatherType(code: number): WeatherType {
  if (code === 0 || code === 1) return 'sunny'
  if (code === 2) return 'partly_cloudy'
  if (code === 3) return 'cloudy'
  if (code === 45 || code === 48) return 'foggy'
  if (code >= 51 && code <= 57) return 'drizzle'
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rainy'
  if (code === 95 || code === 96 || code === 99) return 'stormy'
  return 'cloudy'
}

const WEATHER_EMOJI: Record<WeatherType, string> = {
  sunny: '☀️', partly_cloudy: '⛅', cloudy: '☁️',
  foggy: '🌫️', drizzle: '🌦️', rainy: '🌧️',
  stormy: '⛈️', loading: '…',
}

/*
 * Camera: position=[0, 0.3, 5.5], fov=46
 * Visible at z=0:  x ≈ [-4.1, 4.1]   y ≈ [-2.03, 2.63]
 */

/* ─── Orbit particle ring ─────────────────────────────────────── */
function OrbitRing({ radius, count, color, speed, tiltX = 0, tiltZ = 0, size = 0.04, opacity = 0.75 }: {
  radius: number; count: number; color: string; speed: number
  tiltX?: number; tiltZ?: number; size?: number; opacity?: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2
      arr[i * 3]     = Math.cos(a) * radius
      arr[i * 3 + 1] = Math.sin(a) * radius
      arr[i * 3 + 2] = 0
    }
    return arr
  }, [radius, count])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.z = state.clock.elapsedTime * speed
    groupRef.current.rotation.x = tiltX
    groupRef.current.rotation.y = tiltZ
  })

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={size} color={color} sizeAttenuation transparent opacity={opacity} />
      </points>
    </group>
  )
}

/* ─── Lead orb ────────────────────────────────────────────────── */
function LeadOrb({ radius, speed, color, tiltX = 0, offset = 0 }: {
  radius: number; speed: number; color: string; tiltX?: number; offset?: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed + offset
    ref.current.position.x = Math.cos(t) * radius
    ref.current.position.y = Math.sin(t) * radius * Math.cos(tiltX)
    ref.current.position.z = Math.sin(t) * radius * Math.sin(tiltX)
    const s = 1 + Math.sin(state.clock.elapsedTime * 3 + offset) * 0.3
    ref.current.scale.setScalar(s)
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </mesh>
  )
}

/* ─── Holographic back glow disc ──────────────────────────────── */
function GlowDisc({ color = '#FF5C39' }: { color?: string }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = 0.07 + Math.sin(state.clock.elapsedTime * 1.2) * 0.04
    ref.current.rotation.z = state.clock.elapsedTime * 0.08
  })
  return (
    <mesh ref={ref} position={[0, 0, -0.6]}>
      <circleGeometry args={[3.0, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.07} />
    </mesh>
  )
}

/* ─── Corner accent ───────────────────────────────────────────── */
function CornerAccent({ pos, color }: { pos: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 2.5 + pos[0]) * 0.35
  })
  return (
    <mesh ref={ref} position={pos}>
      <planeGeometry args={[0.18, 0.18]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  )
}

/* ─── Scan line ───────────────────────────────────────────────── */
function ScanLine({ cardW, cardH }: { cardW: number; cardH: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = (state.clock.elapsedTime * 0.35) % 1
    ref.current.position.y = cardH / 2 - t * cardH
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = t < 0.08 ? (t / 0.08) * 0.3 : t > 0.92 ? ((1 - t) / 0.08) * 0.3 : 0.3
  })
  return (
    <mesh ref={ref} position={[0, cardH / 2, 0.025]}>
      <planeGeometry args={[cardW, 0.035]} />
      <meshBasicMaterial color="#D4FF4F" transparent opacity={0.3} />
    </mesh>
  )
}

/* ─── Ambient sparkles ────────────────────────────────────────── */
function Sparkles() {
  const ref   = useRef<THREE.Points>(null)
  const count = 80
  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const ph  = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 7
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2 - 0.5
      ph[i] = Math.random() * Math.PI * 2
    }
    return { positions: pos, phases: ph }
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const arr = ref.current.geometry.attributes.position.array as Float32Array
    const t   = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += 0.004
      if (arr[i * 3 + 1] > 2.5) arr[i * 3 + 1] = -2.5
      arr[i * 3] += Math.sin(t * 0.5 + phases[i]) * 0.002
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ;(ref.current.material as THREE.PointsMaterial).size = 0.025 + Math.sin(t * 2) * 0.008
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#D4FF4F" sizeAttenuation transparent opacity={0.55} />
    </points>
  )
}

/* ─── Profile card — smooth manual float, no drei Float ──────────
 *
 *  Two overlapping sine waves for Y → organic, never repetitive feel
 *  Mouse lerp at 0.028 → silky slow tilt tracking
 *  Subtle breathing scale (±0.6%) → card feels alive
 * ─────────────────────────────────────────────────────────────── */
function ProfileCard() {
  const texture  = useTexture('/images/profile.jpg')
  const groupRef = useRef<THREE.Group>(null)
  const [aspect, setAspect] = useState(0.8)
  const t0 = useRef(0)

  useEffect(() => {
    const img = texture.image as HTMLImageElement | ImageBitmap | undefined
    if (!img) return
    const w = (img as HTMLImageElement).naturalWidth  || (img as HTMLImageElement).width  || (img as ImageBitmap).width  || 0
    const h = (img as HTMLImageElement).naturalHeight || (img as HTMLImageElement).height || (img as ImageBitmap).height || 0
    if (w > 0 && h > 0) setAspect(w / h)
  }, [texture])

  const cardW = 2.4
  const cardH = cardW / aspect

  useFrame((_, delta) => {
    if (!groupRef.current) return
    t0.current += delta
    const t = t0.current

    /* Dual-frequency float */
    const targetY = Math.sin(t * 0.62) * 0.10 + Math.sin(t * 0.37) * 0.038
    const targetX = Math.sin(t * 0.44) * 0.024
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05)
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05)

    /* Subtle breathing scale — no mouse tilt */
    groupRef.current.scale.setScalar(1 + Math.sin(t * 0.88) * 0.006)
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0.13, -0.13, -0.2]}>
        <planeGeometry args={[cardW + 0.1, cardH + 0.1]} />
        <meshBasicMaterial color="#D4FF4F" transparent opacity={0.2} />
      </mesh>
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[cardW + 0.22, cardH + 0.22]} />
        <meshBasicMaterial color="#FF5C39" transparent opacity={0.55} />
      </mesh>
      <mesh>
        <planeGeometry args={[cardW, cardH]} />
        <meshStandardMaterial map={texture} roughness={0.1} metalness={0.04} />
      </mesh>
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[cardW, cardH]} />
        <meshBasicMaterial color="#D4FF4F" transparent opacity={0.035} />
      </mesh>
      <ScanLine cardW={cardW} cardH={cardH} />
      <CornerAccent pos={[-cardW / 2 - 0.05,  cardH / 2 + 0.05, 0.02]} color="#FF5C39" />
      <CornerAccent pos={[ cardW / 2 + 0.05,  cardH / 2 + 0.05, 0.02]} color="#D4FF4F" />
      <CornerAccent pos={[-cardW / 2 - 0.05, -cardH / 2 - 0.05, 0.02]} color="#D4FF4F" />
      <CornerAccent pos={[ cardW / 2 + 0.05, -cardH / 2 - 0.05, 0.02]} color="#FF5C39" />
    </group>
  )
}

/* ══════════ WEATHER COMPONENTS ══════════════════════════════════
 *
 * Visible frustum at z=0 : x ≈ [-4.1, 4.1]   y ≈ [-2.0, 2.63]
 *
 * ═══════════════════════════════════════════════════════════════ */

/* ─── Sun ─────────────────────────────────────────────────────── */
function Sun() {
  const groupRef = useRef<THREE.Group>(null)
  const coreRef  = useRef<THREE.Group>(null)

  const rays = useMemo<Array<[[number,number,number],[number,number,number]]>>(() =>
    Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2
      return [
        [Math.cos(a) * 0.55, Math.sin(a) * 0.55, 0],
        [Math.cos(a) * 1.15, Math.sin(a) * 1.15, 0],
      ]
    }), [])

  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.z = state.clock.elapsedTime * 0.3
    if (coreRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.07
      coreRef.current.scale.setScalar(s)
    }
  })

  return (
    <group ref={groupRef} position={[-2.6, 1.8, -0.8]}>
      <mesh>
        <circleGeometry args={[1.6, 48]} />
        <meshBasicMaterial color="#FFD060" transparent opacity={0.06} />
      </mesh>
      <mesh>
        <circleGeometry args={[1.0, 48]} />
        <meshBasicMaterial color="#FFD060" transparent opacity={0.12} />
      </mesh>
      <group ref={coreRef}>
        <mesh>
          <sphereGeometry args={[0.45, 24, 24]} />
          <meshStandardMaterial color="#FFD060" emissive="#FF8C00" emissiveIntensity={2.5} roughness={0.1} />
        </mesh>
      </group>
      {rays.map(([start, end], i) => (
        <Line key={i} points={[start, end]} color="#FFD060" lineWidth={i % 3 === 0 ? 2.5 : 1.2} transparent opacity={0.6} />
      ))}
    </group>
  )
}

/* ─── Sun shafts ──────────────────────────────────────────────── */
function SunShafts() {
  const refs   = useRef<THREE.Mesh[]>([])
  const shafts = useMemo(() => Array.from({ length: 5 }, (_, i) => ({
    x: -3.5 + i * 0.65, angle: -0.15 + i * 0.05, phase: i * 0.9,
  })), [])

  useFrame((state) => {
    refs.current.forEach((m, i) => {
      if (!m) return
      ;(m.material as THREE.MeshBasicMaterial).opacity =
        0.04 + Math.sin(state.clock.elapsedTime * 0.55 + shafts[i].phase) * 0.025
    })
  })

  return (
    <>
      {shafts.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) refs.current[i] = el }}
          position={[s.x, 0.8, -1.5]}
          rotation={[0, 0, s.angle]}
        >
          <planeGeometry args={[0.22, 7]} />
          <meshBasicMaterial color="#FFD060" transparent opacity={0.04} />
        </mesh>
      ))}
    </>
  )
}

/* ─── Heat particles ──────────────────────────────────────────── */
function HeatParticles() {
  const ref   = useRef<THREE.Points>(null)
  const count = 70
  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const ph  = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 7
      pos[i * 3 + 1] = Math.random() * 4.5 - 2
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2 - 0.5
      ph[i] = Math.random() * Math.PI * 2
    }
    return { positions: pos, phases: ph }
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const arr = ref.current.geometry.attributes.position.array as Float32Array
    const t   = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += 0.014
      arr[i * 3]     += Math.sin(t * 0.9 + phases[i]) * 0.003
      if (arr[i * 3 + 1] > 2.5) {
        arr[i * 3 + 1] = -2.0
        arr[i * 3]     = (Math.random() - 0.5) * 7
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ;(ref.current.material as THREE.PointsMaterial).opacity = 0.22 + Math.sin(t * 0.8) * 0.08
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#FFD060" sizeAttenuation transparent opacity={0.22} />
    </points>
  )
}

/* ─── Realistic cloud — ellipsoid blobs, height-tinted, flat base ─
 *
 *  Each blob is a squashed sphere (scale x/y/z ≠ 1) mimicking a puff.
 *  Real cumulus clouds have a flat base → no blobs below y = -0.05.
 *  Colors are tinted by height: sunlit white on top, blue-grey below.
 *  Horizontal-only drift; y barely moves so no bouncing effect.
 * ─────────────────────────────────────────────────────────────── */
function RealisticCloud({
  pos, scale = 1, baseColor = '#ffffff', dark = false,
}: {
  pos: [number, number, number]
  scale?: number
  baseColor?: string
  dark?: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const phase    = useRef(Math.random() * Math.PI * 2)
  const spd      = useRef(0.065 + Math.random() * 0.04)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.x = pos[0] + Math.sin(t * spd.current + phase.current) * 0.28
    groupRef.current.position.y = pos[1] + Math.sin(t * spd.current * 0.4 + phase.current) * 0.025
  })

  /*
   * Each blob: position, radius, opacity, x/y/z scale for ellipsoid shape.
   * sx > 1 = wider than tall (pillow puff).  sy < 1 = squashed vertically.
   */
  type Blob = {
    p: [number, number, number]; r: number; op: number
    sx: number; sy: number; sz: number
  }

  /* Tier 1 — dense core puffs */
  const core: Blob[] = [
    { p: [ 0.00,  0.00,  0.00], r: 0.60, op: dark ? 0.97 : 0.94, sx: 1.30, sy: 0.82, sz: 1.10 },
    { p: [ 0.62,  0.08,  0.05], r: 0.50, op: dark ? 0.94 : 0.91, sx: 1.25, sy: 0.80, sz: 1.05 },
    { p: [-0.60,  0.06,  0.05], r: 0.48, op: dark ? 0.92 : 0.88, sx: 1.20, sy: 0.80, sz: 1.00 },
  ]
  /* Tier 2 — dome & upper puffs */
  const dome: Blob[] = [
    { p: [ 0.28,  0.44,  0.03], r: 0.42, op: dark ? 0.89 : 0.85, sx: 1.15, sy: 0.88, sz: 1.05 },
    { p: [-0.30,  0.42,  0.03], r: 0.40, op: dark ? 0.86 : 0.82, sx: 1.10, sy: 0.85, sz: 1.00 },
    { p: [ 0.10,  0.60,  0.01], r: 0.34, op: dark ? 0.83 : 0.78, sx: 1.20, sy: 0.90, sz: 1.00 },
    { p: [ 0.95,  0.04,  0.02], r: 0.36, op: dark ? 0.82 : 0.77, sx: 1.15, sy: 0.78, sz: 1.00 },
    { p: [-0.95,  0.02,  0.02], r: 0.34, op: dark ? 0.80 : 0.74, sx: 1.12, sy: 0.78, sz: 1.00 },
    { p: [ 0.50,  0.52,  0.04], r: 0.28, op: dark ? 0.78 : 0.72, sx: 1.10, sy: 0.85, sz: 0.95 },
    { p: [-0.52,  0.50,  0.04], r: 0.27, op: dark ? 0.76 : 0.70, sx: 1.08, sy: 0.85, sz: 0.95 },
  ]
  /* Tier 3 — mid body (flat base, wider spread) */
  const body: Blob[] = [
    { p: [ 1.18,  0.00, -0.03], r: 0.26, op: 0.60, sx: 1.20, sy: 0.72, sz: 0.90 },
    { p: [-1.18,  0.00, -0.03], r: 0.24, op: 0.56, sx: 1.18, sy: 0.72, sz: 0.90 },
    { p: [ 0.76, -0.02, -0.02], r: 0.22, op: 0.52, sx: 1.25, sy: 0.68, sz: 0.88 },
    { p: [-0.76, -0.02, -0.02], r: 0.21, op: 0.48, sx: 1.22, sy: 0.68, sz: 0.88 },
    { p: [ 0.00, -0.03, -0.04], r: 0.28, op: 0.44, sx: 1.40, sy: 0.60, sz: 0.80 }, // flat base centre
    { p: [ 0.85,  0.48,  0.04], r: 0.22, op: 0.40, sx: 1.05, sy: 0.82, sz: 0.92 },
    { p: [-0.85,  0.46,  0.04], r: 0.20, op: 0.38, sx: 1.05, sy: 0.82, sz: 0.92 },
  ]
  /* Tier 4 — wispy transparent edges */
  const wisp: Blob[] = [
    { p: [ 1.48,  0.08, -0.10], r: 0.18, op: 0.22, sx: 1.30, sy: 0.65, sz: 0.80 },
    { p: [-1.48,  0.06, -0.10], r: 0.17, op: 0.20, sx: 1.28, sy: 0.65, sz: 0.80 },
    { p: [ 0.00,  0.78, -0.08], r: 0.20, op: 0.18, sx: 1.10, sy: 0.90, sz: 0.85 },
    { p: [ 0.95, -0.04, -0.12], r: 0.15, op: 0.15, sx: 1.35, sy: 0.55, sz: 0.70 },
    { p: [-0.95, -0.04, -0.12], r: 0.14, op: 0.15, sx: 1.32, sy: 0.55, sz: 0.70 },
    { p: [ 1.72,  0.02, -0.20], r: 0.13, op: 0.10, sx: 1.20, sy: 0.60, sz: 0.75 },
    { p: [-1.72,  0.02, -0.20], r: 0.12, op: 0.08, sx: 1.18, sy: 0.60, sz: 0.75 },
    { p: [ 0.42,  0.78, -0.10], r: 0.14, op: 0.10, sx: 1.05, sy: 0.88, sz: 0.80 },
    { p: [-0.42,  0.76, -0.10], r: 0.13, op: 0.10, sx: 1.05, sy: 0.88, sz: 0.80 },
  ]

  const blobs = [...core, ...dome, ...body, ...wisp]

  /* Height-based color for realistic top-lit look */
  const blobColor = (y: number) => {
    if (dark) {
      if (y > 0.35) return '#2e4462'
      if (y > 0.05) return '#1c2e48'
      return '#0d1a2e'
    }
    if (y > 0.45) return '#ffffff'
    if (y > 0.12) return '#f2f5f8'
    if (y > -0.02) return '#e4eaf0'
    return baseColor === '#ffffff' ? '#d0d8e4' : baseColor
  }

  return (
    <group ref={groupRef} position={pos} scale={[scale, scale, scale]}>
      {blobs.map(({ p, r, op, sx, sy, sz }, i) => (
        <mesh key={i} position={p} scale={[sx, sy, sz]}>
          <sphereGeometry args={[r, 22, 16]} />
          <meshStandardMaterial
            color={blobColor(p[1])}
            roughness={1.0}
            metalness={0}
            transparent
            opacity={op}
          />
        </mesh>
      ))}
      {/* Dark cloud interior backlight */}
      {dark && (
        <mesh position={[0, 0.08, -0.18]}>
          <sphereGeometry args={[0.85, 10, 7]} />
          <meshBasicMaterial color="#0a1525" transparent opacity={0.28} />
        </mesh>
      )}
    </group>
  )
}

/* ─── Wispy haze particles that drift slowly between clouds ───── */
function CloudWisps({ color = '#d8e8f4', opacity = 0.13 }: {
  color?: string
  opacity?: number
}) {
  const ref   = useRef<THREE.Points>(null)
  const count = 65
  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const ph  = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 9.0
      pos[i * 3 + 1] = Math.random() * 3.4 - 0.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2.5 - 0.3
      ph[i] = Math.random() * Math.PI * 2
    }
    return { positions: pos, phases: ph }
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const arr = ref.current.geometry.attributes.position.array as Float32Array
    const t   = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      arr[i * 3] += 0.0012
      if (arr[i * 3] > 4.5) arr[i * 3] = -4.5
      arr[i * 3 + 1] += Math.sin(t * 0.18 + phases[i]) * 0.0004
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.24} color={color} sizeAttenuation transparent opacity={opacity} />
    </points>
  )
}

/* ─── Rain — varied streak lengths + wind angle ───────────────── */
function Rain({ count = 500, speed = 0.09, opacity = 0.72, stormy = false }: {
  count?: number; speed?: number; opacity?: number; stormy?: boolean
}) {
  const ref = useRef<THREE.LineSegments>(null)

  /* Each drop stores: top-x, top-y, z, dx (wind x-shift), streak-len */
  const { positions, meta } = useMemo(() => {
    const pos  = new Float32Array(count * 6)
    const meta = new Float32Array(count * 2) // [dx, len] per drop
    for (let i = 0; i < count; i++) {
      const x   = (Math.random() - 0.5) * 9
      const y   = Math.random() * 6.0 - 2.0
      const z   = (Math.random() - 0.5) * 3.5 - 0.5
      const len = 0.14 + Math.random() * 0.20   // varied streak: 0.14–0.34
      const dx  = stormy ? -(0.03 + Math.random() * 0.04) : -(0.015 + Math.random() * 0.015)
      pos[i * 6]     = x;          pos[i * 6 + 1] = y;       pos[i * 6 + 2] = z
      pos[i * 6 + 3] = x + dx;     pos[i * 6 + 4] = y - len; pos[i * 6 + 5] = z
      meta[i * 2]    = dx;          meta[i * 2 + 1] = len
    }
    return { positions: pos, meta }
  }, [count, stormy])

  useFrame(() => {
    if (!ref.current) return
    const arr = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      const dx  = meta[i * 2]
      const len = meta[i * 2 + 1]
      arr[i * 6 + 1] -= speed
      arr[i * 6 + 4] -= speed
      /* Reset when bottom tip exits bottom of frustum */
      if (arr[i * 6 + 4] < -2.4) {
        const x = (Math.random() - 0.5) * 9
        const y = 3.8
        arr[i * 6]     = x;       arr[i * 6 + 1] = y
        arr[i * 6 + 3] = x + dx;  arr[i * 6 + 4] = y - len
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color={stormy ? '#a0c8e8' : '#b8d8f0'}
        transparent
        opacity={opacity}
      />
    </lineSegments>
  )
}

/* ─── Fog / mist particles ────────────────────────────────────── */
function FogLayer() {
  const ref   = useRef<THREE.Points>(null)
  const count = 200
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 10
      arr[i * 3 + 1] = Math.random() * 4.5 - 2.0
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4 - 0.5
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const arr = ref.current.geometry.attributes.position.array as Float32Array
    const t   = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      arr[i * 3] += 0.005
      if (arr[i * 3] > 5) arr[i * 3] = -5
      arr[i * 3 + 1] += Math.sin(t * 0.2 + i * 0.5) * 0.001
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ;(ref.current.material as THREE.PointsMaterial).opacity = 0.28 + Math.sin(t * 0.4) * 0.07
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.32} color="#c0d4e8" sizeAttenuation transparent opacity={0.28} />
    </points>
  )
}

/* ─── Lightning — main bolt + branch + double-flash sequence ─────── */
function Lightning() {
  const lightRef   = useRef<THREE.PointLight>(null)
  const light2Ref  = useRef<THREE.PointLight>(null)
  const lineGroup  = useRef<THREE.Group>(null)
  const timer      = useRef(1.2 + Math.random() * 2.8)

  /* Main bolt — left side */
  const bolt = useMemo<[number,number,number][]>(() => [
    [-1.8,  2.2, 0.8],
    [-2.2,  1.6, 0.8],
    [-1.6,  0.9, 0.8],
    [-2.0,  0.2, 0.8],
    [-1.7, -0.5, 0.8],
    [-2.1, -1.1, 0.8],
    [-1.9, -1.8, 0.8],
  ], [])

  /* Secondary branch peeling off mid-bolt */
  const branch = useMemo<[number,number,number][]>(() => [
    [-1.6,  0.9, 0.8],
    [-0.9,  0.4, 0.8],
    [-0.5, -0.1, 0.8],
    [-0.8, -0.5, 0.8],
  ], [])

  useFrame((_, delta) => {
    timer.current -= delta
    if (timer.current > 0) return
    timer.current = 1.8 + Math.random() * 3.5

    const fl = (ref: React.RefObject<THREE.PointLight>, v: number, d: number) =>
      setTimeout(() => { if (ref.current) ref.current.intensity = v }, d)
    const show = (on: boolean, d: number) =>
      setTimeout(() => { if (lineGroup.current) lineGroup.current.visible = on }, d)

    /* Double-flash: bright → dark → secondary → off */
    fl(lightRef, 70, 0);   fl(lightRef, 0, 70)
    fl(lightRef, 38, 110); fl(lightRef, 0, 175)
    fl(light2Ref, 40, 10); fl(light2Ref, 0, 80)
    show(true, 0); show(false, 80); show(true, 110); show(false, 190)
  })

  return (
    <>
      <pointLight ref={lightRef}  position={[-2.0, 1.2, 3.0]} intensity={0} color="#cce8ff" distance={16} decay={2} />
      <pointLight ref={light2Ref} position={[ 0.0, 0.5, 3.0]} intensity={0} color="#d8f0ff" distance={12} decay={2} />
      <group ref={lineGroup} visible={false}>
        {/* Main bolt: bright core + wide glow */}
        <Line points={bolt}   color="#ffffff" lineWidth={2.5} />
        <Line points={bolt}   color="#a8d8ff" lineWidth={7}  transparent opacity={0.28} />
        {/* Branch: thinner */}
        <Line points={branch} color="#e0f0ff" lineWidth={1.5} />
        <Line points={branch} color="#90c8f0" lineWidth={4}  transparent opacity={0.18} />
      </group>
    </>
  )
}

/* ─── Weather scenes ──────────────────────────────────────────── */
function WeatherScene({ type }: { type: WeatherType }) {
  switch (type) {

    case 'sunny':
      return (
        <>
          <Sun />
          <SunShafts />
          <HeatParticles />
          <RealisticCloud pos={[ 2.8,  1.6, -1.2]} scale={0.72} baseColor="#fffef0" />
          <RealisticCloud pos={[-1.2,  2.1, -1.5]} scale={0.60} baseColor="#fffef0" />
        </>
      )

    case 'partly_cloudy':
      return (
        <>
          <Sun />
          <SunShafts />
          <RealisticCloud pos={[ 3.0,  1.2, -0.5]} scale={1.02} baseColor="#eef5ff" />
          <RealisticCloud pos={[-3.0,  0.9, -0.6]} scale={0.92} baseColor="#eef5ff" />
          <RealisticCloud pos={[ 1.5,  2.1, -1.0]} scale={0.78} baseColor="#f4f8ff" />
          <RealisticCloud pos={[-1.9,  1.9, -1.2]} scale={0.82} baseColor="#f0f5ff" />
          <RealisticCloud pos={[ 0.0, -1.1,  1.2]} scale={0.88} baseColor="#e8f0fc" />
          <CloudWisps color="#e8f2ff" opacity={0.10} />
        </>
      )

    case 'cloudy':
      return (
        <>
          <RealisticCloud pos={[-3.2,  1.5, -0.4]} scale={1.12} baseColor="#b8c8d8" />
          <RealisticCloud pos={[ 3.2,  1.5, -0.5]} scale={1.05} baseColor="#b8c8d8" />
          <RealisticCloud pos={[-1.5,  2.2, -1.0]} scale={0.92} baseColor="#c0d0e0" />
          <RealisticCloud pos={[ 1.5,  2.2, -0.8]} scale={0.97} baseColor="#c0d0e0" />
          <RealisticCloud pos={[ 0.0,  2.4, -1.4]} scale={1.05} baseColor="#b0c0d0" />
          <RealisticCloud pos={[-2.8, -0.5,  0.8]} scale={0.88} baseColor="#a8b8c8" />
          <RealisticCloud pos={[ 2.8, -0.5,  0.6]} scale={0.82} baseColor="#a8b8c8" />
          <CloudWisps color="#c8d8e8" opacity={0.14} />
        </>
      )

    case 'foggy':
      return (
        <>
          <FogLayer />
          <CloudWisps color="#ccd8e4" opacity={0.20} />
          <RealisticCloud pos={[-2.5,  1.1,  0.5]} scale={0.92} baseColor="#ccd8e4" />
          <RealisticCloud pos={[ 2.5,  1.3,  0.3]} scale={0.88} baseColor="#ccd8e4" />
          <RealisticCloud pos={[ 0.0,  1.9, -0.8]} scale={1.05} baseColor="#c8d4e0" />
          <RealisticCloud pos={[-3.0, -0.2,  1.0]} scale={0.78} baseColor="#ccd8e4" />
          <RealisticCloud pos={[ 3.0, -0.2,  0.8]} scale={0.72} baseColor="#ccd8e4" />
        </>
      )

    case 'drizzle':
      return (
        <>
          <Rain count={260} speed={0.05} opacity={0.50} />
          <RealisticCloud pos={[-3.0,  1.4, -0.3]} scale={1.05} baseColor="#9aacbc" />
          <RealisticCloud pos={[ 3.0,  1.4, -0.4]} scale={0.92} baseColor="#9aacbc" />
          <RealisticCloud pos={[-1.4,  2.1, -0.9]} scale={0.88} baseColor="#a0b0c0" />
          <RealisticCloud pos={[ 1.4,  2.1, -0.7]} scale={0.92} baseColor="#a0b0c0" />
          <RealisticCloud pos={[ 0.0, -1.0,  1.0]} scale={0.82} baseColor="#8898a8" />
          <CloudWisps color="#b0c4d4" opacity={0.12} />
        </>
      )

    case 'rainy':
      return (
        <>
          <Rain count={500} speed={0.10} opacity={0.75} />
          <RealisticCloud pos={[-3.2,  1.5, -0.3]} scale={1.12} baseColor="#607080" />
          <RealisticCloud pos={[ 3.2,  1.5, -0.4]} scale={1.05} baseColor="#607080" />
          <RealisticCloud pos={[-1.5,  2.1, -0.9]} scale={0.96} baseColor="#6a7a8a" />
          <RealisticCloud pos={[ 1.5,  2.1, -0.8]} scale={1.02} baseColor="#6a7a8a" />
          <RealisticCloud pos={[ 0.0,  2.4, -1.3]} scale={1.05} baseColor="#5a6a7a" />
          <RealisticCloud pos={[-2.8, -0.6,  0.8]} scale={0.88} baseColor="#607080" />
          <RealisticCloud pos={[ 2.8, -0.6,  0.6]} scale={0.82} baseColor="#607080" />
          <CloudWisps color="#8090a8" opacity={0.14} />
        </>
      )

    case 'stormy':
      return (
        <>
          <Rain count={680} speed={0.14} opacity={0.85} stormy />
          <Lightning />
          <RealisticCloud pos={[-3.0,  1.4, -0.3]} scale={1.12} dark />
          <RealisticCloud pos={[ 3.0,  1.4, -0.5]} scale={1.05} dark />
          <RealisticCloud pos={[-1.5,  2.1, -0.9]} scale={0.92} dark />
          <RealisticCloud pos={[ 1.5,  2.1, -0.8]} scale={0.97} dark />
          <RealisticCloud pos={[ 0.0,  2.4, -1.3]} scale={1.08} dark />
          <RealisticCloud pos={[-2.8, -0.5,  0.8]} scale={0.88} dark />
          <RealisticCloud pos={[ 2.8, -0.5,  0.6]} scale={0.82} dark />
          <CloudWisps color="#202838" opacity={0.22} />
        </>
      )

    default:
      return (
        <>
          <RealisticCloud pos={[-3.0, 1.4, -0.4]} scale={1.02} baseColor="#c8d8e8" />
          <RealisticCloud pos={[ 3.0, 1.4, -0.5]} scale={0.92} baseColor="#c8d8e8" />
          <RealisticCloud pos={[ 0.0, 2.0, -1.0]} scale={0.88} baseColor="#c0d0e0" />
          <CloudWisps color="#c8d8e8" opacity={0.10} />
        </>
      )
  }
}

/* ─── Per-weather lighting ────────────────────────────────────── */
function WeatherLights({ type }: { type: WeatherType }) {
  switch (type) {
    case 'sunny':
    case 'partly_cloudy':
      return (
        <>
          <ambientLight intensity={1.2} />
          <pointLight position={[-4, 4, 4]} intensity={4.0} color="#FFD060" />
          <pointLight position={[ 4,-2, 4]} intensity={2.2} color="#ffd6cc" />
          <pointLight position={[ 0, 3, 3]} intensity={2.5} color="#ffffff" />
        </>
      )
    case 'foggy':
      return (
        <>
          <ambientLight intensity={0.95} />
          <pointLight position={[0, 4, 4]} intensity={2.0} color="#d0e8f8" />
          <pointLight position={[0,-2, 4]} intensity={1.4} color="#e8f0ff" />
        </>
      )
    case 'stormy':
      return (
        <>
          <ambientLight intensity={0.16} />
          <pointLight position={[-4, 4, 4]} intensity={3.2} color="#FF5C39" />
          <pointLight position={[ 4,-2, 4]} intensity={2.2} color="#D4FF4F" />
          <pointLight position={[ 0, 3, 3]} intensity={1.6} color="#ffffff" />
        </>
      )
    case 'rainy':
    case 'drizzle':
      return (
        <>
          <ambientLight intensity={0.55} />
          <pointLight position={[-4, 4, 4]} intensity={2.2} color="#90b0d0" />
          <pointLight position={[ 4,-2, 4]} intensity={1.5} color="#b0c8e8" />
          <pointLight position={[ 0, 3, 3]} intensity={1.8} color="#d8e8ff" />
        </>
      )
    case 'cloudy':
      return (
        <>
          <ambientLight intensity={0.78} />
          <pointLight position={[-4, 4, 4]} intensity={2.4} color="#c0ccd8" />
          <pointLight position={[ 4,-2, 4]} intensity={1.8} color="#d0dce8" />
          <pointLight position={[ 0, 3, 3]} intensity={2.2} color="#ffffff" />
        </>
      )
    default:
      return (
        <>
          <ambientLight intensity={0.22} />
          <pointLight position={[-4, 4, 4]} intensity={3.5} color="#FF5C39" />
          <pointLight position={[ 4,-2, 4]} intensity={2.2} color="#D4FF4F" />
          <pointLight position={[ 0, 3, 3]} intensity={1.8} color="#ffffff" />
        </>
      )
  }
}

/* ─── Scene root ──────────────────────────────────────────────── */
export default function ProfileScene() {
  const [mounted,     setMounted]     = useState(false)
  const [weatherType, setWeatherType] = useState<WeatherType>('loading')
  const [weatherInfo, setWeatherInfo] = useState<{ temp?: number; description?: string }>({})

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    fetch('/api/weather')
      .then((r) => r.json())
      .then((data) => {
        setWeatherType(codeToWeatherType(data.weathercode ?? -1))
        setWeatherInfo({ temp: data.temperature, description: data.description })
      })
      .catch(() => setWeatherType('cloudy'))
  }, [mounted])

  const glowColor = (weatherType === 'sunny' || weatherType === 'partly_cloudy') ? '#FFD060' : '#FF5C39'

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0.3, 5.5], fov: 46 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <WeatherLights type={weatherType} />
        <GlowDisc color={glowColor} />

        <Suspense fallback={null}>
          <ProfileCard />
        </Suspense>

        <OrbitRing radius={2.05} count={90} color="#FF5C39" speed={0.28}  tiltX={Math.PI * 0.22}               size={0.04}  opacity={0.7}  />
        <OrbitRing radius={2.55} count={70} color="#D4FF4F" speed={-0.18} tiltX={Math.PI * 0.5}  tiltZ={0.4}  size={0.035} opacity={0.55} />
        <OrbitRing radius={1.75} count={50} color="#ffffff" speed={0.42}  tiltX={Math.PI * 0.35} tiltZ={-0.6} size={0.028} opacity={0.35} />

        <LeadOrb radius={2.05} speed={0.28}  color="#FF5C39" tiltX={Math.PI * 0.22} offset={0}       />
        <LeadOrb radius={2.55} speed={-0.18} color="#D4FF4F" tiltX={Math.PI * 0.5}  offset={Math.PI} />

        <Sparkles />
        <WeatherScene type={weatherType} />
      </Canvas>

      {mounted && weatherType !== 'loading' && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-[11px] font-mono text-white/65 whitespace-nowrap shadow-lg">
            <span>{WEATHER_EMOJI[weatherType]}</span>
            <span>Mumbai</span>
            {weatherInfo.temp !== undefined && (
              <span className="text-[#D4FF4F] font-semibold">{weatherInfo.temp}°C</span>
            )}
            {weatherInfo.description && (
              <>
                <span className="text-white/25">·</span>
                <span>{weatherInfo.description}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
