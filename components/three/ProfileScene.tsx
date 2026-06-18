'use client'

import { useRef, useMemo, Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, useTexture, Line } from '@react-three/drei'
import { useTheme } from 'next-themes'
import * as THREE from 'three'

/* ─── Profile image card ──────────────────────────────────── */
function ProfileCard() {
  const texture = useTexture('/images/profile.jpg')
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = Math.sin(t * 0.45) * 0.05
    groupRef.current.rotation.x = Math.sin(t * 0.30) * 0.025
  })

  return (
    <Float speed={2} floatIntensity={0.35} rotationIntensity={0}>
      <group ref={groupRef}>
        <mesh position={[0.12, -0.12, -0.14]}>
          <planeGeometry args={[2.46, 3.06]} />
          <meshBasicMaterial color="#D4FF4F" transparent opacity={0.22} />
        </mesh>
        <mesh position={[0, 0, -0.10]}>
          <planeGeometry args={[2.56, 3.16]} />
          <meshBasicMaterial color="#FF5C39" transparent opacity={0.55} />
        </mesh>
        <mesh>
          <planeGeometry args={[2.34, 2.94]} />
          <meshStandardMaterial map={texture} roughness={0.15} metalness={0.06} />
        </mesh>
      </group>
    </Float>
  )
}

/* ─── Dark mode: Storm cloud ──────────────────────────────── */
function StormCloud({ pos, scale = 1 }: { pos: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Group>(null)
  const offset = useRef(Math.random() * Math.PI * 2)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime + offset.current
    ref.current.position.x = pos[0] + Math.sin(t * 0.26) * 0.20
    ref.current.position.y = pos[1] + Math.sin(t * 0.42) * 0.06
  })

  const blobs: Array<{ p: [number, number, number]; r: number }> = [
    { p: [0, 0, 0], r: 0.54 },
    { p: [0.52, 0.12, 0], r: 0.42 },
    { p: [-0.52, 0.10, 0], r: 0.40 },
    { p: [0.26, 0.33, 0], r: 0.32 },
    { p: [-0.28, 0.31, 0], r: 0.30 },
    { p: [0.75, -0.04, 0], r: 0.29 },
    { p: [-0.75, -0.04, 0], r: 0.27 },
    { p: [0.10, 0.50, 0], r: 0.24 },
  ]

  return (
    <group ref={ref} position={pos} scale={[scale, scale, scale]}>
      {blobs.map(({ p, r }, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[r, 12, 8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.92} metalness={0} transparent opacity={0.90} />
        </mesh>
      ))}
      <mesh position={[0, 0, -0.08]}>
        <sphereGeometry args={[0.70, 10, 7]} />
        <meshBasicMaterial color="#334155" transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

/* ─── Light mode: Fluffy white cloud ─────────────────────── */
function LightCloud({ pos, scale = 1 }: { pos: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Group>(null)
  const offset = useRef(Math.random() * Math.PI * 2)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime + offset.current
    ref.current.position.x = pos[0] + Math.sin(t * 0.20) * 0.25
    ref.current.position.y = pos[1] + Math.sin(t * 0.35) * 0.08
  })

  const blobs: Array<{ p: [number, number, number]; r: number }> = [
    { p: [0, 0, 0], r: 0.58 },
    { p: [0.55, 0.14, 0], r: 0.44 },
    { p: [-0.55, 0.12, 0], r: 0.42 },
    { p: [0.28, 0.36, 0], r: 0.35 },
    { p: [-0.30, 0.34, 0], r: 0.33 },
    { p: [0.78, -0.02, 0], r: 0.30 },
    { p: [-0.78, -0.02, 0], r: 0.28 },
    { p: [0.12, 0.54, 0], r: 0.26 },
    { p: [-0.12, 0.52, 0], r: 0.24 },
  ]

  return (
    <group ref={ref} position={pos} scale={[scale, scale, scale]}>
      {blobs.map(({ p, r }, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[r, 14, 10]} />
          <meshStandardMaterial color="#e8f0ff" roughness={0.4} metalness={0} transparent opacity={0.88} />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Dark mode: Rain ─────────────────────────────────────── */
function Rain() {
  const ref = useRef<THREE.Points>(null)
  const count = 420

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 8
      arr[i * 3 + 1] = Math.random() * 9 - 2
      arr[i * 3 + 2] = (Math.random() - 0.5) * 3 - 1
    }
    return arr
  }, [])

  useFrame(() => {
    if (!ref.current) return
    const arr = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] -= 0.08
      if (arr[i * 3 + 1] < -2.5) {
        arr[i * 3 + 1] = 6.5
        arr[i * 3]     = (Math.random() - 0.5) * 8
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.024} color="#93c5fd" sizeAttenuation transparent opacity={0.65} />
    </points>
  )
}

/* ─── Light mode: Snow ────────────────────────────────────── */
function Snow() {
  const ref = useRef<THREE.Points>(null)
  const count = 200
  const timeRef = useRef(0)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 8
      arr[i * 3 + 1] = Math.random() * 9 - 2
      arr[i * 3 + 2] = (Math.random() - 0.5) * 3 - 1
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    timeRef.current += delta
    const arr = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] -= 0.018
      arr[i * 3]     += Math.sin(timeRef.current * 0.8 + i * 0.6) * 0.003
      if (arr[i * 3 + 1] < -2.5) {
        arr[i * 3 + 1] = 6.5
        arr[i * 3]     = (Math.random() - 0.5) * 8
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#cce4ff" sizeAttenuation transparent opacity={0.85} />
    </points>
  )
}

/* ─── Dark mode: Lightning ────────────────────────────────── */
function Lightning() {
  const lightRef  = useRef<THREE.PointLight>(null)
  const lineGroup = useRef<THREE.Group>(null)
  const timer     = useRef(2 + Math.random() * 3)

  const zigzag = useMemo<[number, number, number][]>(() => [
    [1.10, 2.20, 0.6],
    [0.75, 1.55, 0.6],
    [1.30, 0.90, 0.6],
    [0.85, 0.25, 0.6],
    [1.15, -0.40, 0.6],
    [0.90, -1.05, 0.6],
    [1.05, -1.70, 0.6],
    [0.95, -2.10, 0.6],
  ], [])

  useFrame((_, delta) => {
    timer.current -= delta
    if (timer.current > 0) return
    timer.current = 2.5 + Math.random() * 3.5

    const flash = (intensity: number, delay: number) =>
      setTimeout(() => { if (lightRef.current) lightRef.current.intensity = intensity }, delay)
    const showLine = (on: boolean, delay: number) =>
      setTimeout(() => { if (lineGroup.current) lineGroup.current.visible = on }, delay)

    flash(40, 0); flash(0, 90); flash(22, 110); flash(0, 170)
    showLine(true, 0); showLine(false, 200)
  })

  return (
    <>
      <pointLight ref={lightRef} position={[1.2, 1.5, 2.5]} intensity={0} color="#e0f2fe" distance={12} decay={2} />
      <group ref={lineGroup} visible={false}>
        <Line points={zigzag} color="#e0f2fe" lineWidth={2.5} />
        <Line points={zigzag} color="#93c5fd" lineWidth={6} transparent opacity={0.25} />
      </group>
    </>
  )
}

/* ─── Theme-conditional scene contents ───────────────────── */
function ConditionalScene({ isDark }: { isDark: boolean }) {
  return isDark ? (
    <>
      <StormCloud pos={[-2.9, -2.4, 0.9]} scale={1.00} />
      <StormCloud pos={[ 2.6, -2.6, 0.5]} scale={0.88} />
      <StormCloud pos={[ 0.2, -2.8, 1.3]} scale={1.12} />
      <StormCloud pos={[-1.6, -3.0, 1.0]} scale={0.80} />
      <StormCloud pos={[ 1.9, -2.9, 0.7]} scale={0.90} />
      <StormCloud pos={[-0.8, -3.3, -0.2]} scale={0.95} />
      <StormCloud pos={[ 1.1, -3.5, -0.4]} scale={0.82} />
      <Rain />
      <Lightning />
    </>
  ) : (
    <>
      <LightCloud pos={[-2.9, -2.4, 0.9]} scale={1.00} />
      <LightCloud pos={[ 2.6, -2.6, 0.5]} scale={0.88} />
      <LightCloud pos={[ 0.2, -2.8, 1.3]} scale={1.12} />
      <LightCloud pos={[-1.6, -3.0, 1.0]} scale={0.80} />
      <LightCloud pos={[ 1.9, -2.9, 0.7]} scale={0.90} />
      <LightCloud pos={[-0.8, -3.3, -0.2]} scale={0.95} />
      <LightCloud pos={[ 1.1, -3.5, -0.4]} scale={0.82} />
      <Snow />
    </>
  )
}

/* ─── Scene root ──────────────────────────────────────────── */
export default function ProfileScene() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = !mounted || resolvedTheme !== 'light'

  return (
    <Canvas
      camera={{ position: [0, 0.3, 5.2], fov: 46 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      {isDark ? (
        <>
          <ambientLight intensity={0.22} />
          <pointLight position={[-4, 4, 4]} intensity={3.5} color="#FF5C39" />
          <pointLight position={[4, -2, 4]} intensity={2.2} color="#D4FF4F" />
          <pointLight position={[0, 3, 3]}  intensity={1.8} color="#ffffff" />
        </>
      ) : (
        <>
          <ambientLight intensity={0.85} />
          <pointLight position={[-4, 4, 4]} intensity={2.5} color="#ffd6cc" />
          <pointLight position={[4, -2, 4]} intensity={1.8} color="#ccf0ff" />
          <pointLight position={[0, 3, 3]}  intensity={2.2} color="#ffffff" />
        </>
      )}

      <Suspense fallback={null}>
        <ProfileCard />
      </Suspense>

      <ConditionalScene isDark={isDark} />
    </Canvas>
  )
}
