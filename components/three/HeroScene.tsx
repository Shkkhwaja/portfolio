'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial, Environment } from '@react-three/drei'
import * as THREE from 'three'

function TorusKnot({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const targetRotX = useRef(0)
  const targetRotY = useRef(0)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    targetRotX.current += (mouseY * 0.3 - targetRotX.current) * 0.05
    targetRotY.current += (mouseX * 0.3 - targetRotY.current) * 0.05

    meshRef.current.rotation.x = targetRotX.current + t * 0.08
    meshRef.current.rotation.y = targetRotY.current + t * 0.12
  })

  return (
    <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} castShadow>
        <torusKnotGeometry args={[1.0, 0.35, 160, 20, 2, 3]} />
        <meshStandardMaterial
          color="#FF5C39"
          roughness={0.1}
          metalness={0.8}
          emissive="#FF2200"
          emissiveIntensity={0.15}
          wireframe={false}
        />
      </mesh>
    </Float>
  )
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 120

  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03
    pointsRef.current.rotation.x = state.clock.elapsedTime * 0.015
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#D4FF4F" sizeAttenuation transparent opacity={0.7} />
    </points>
  )
}

export default function HeroScene() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  return (
    <div
      className="w-full h-full"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMouse({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
          y: -((e.clientY - rect.top) / rect.height - 0.5) * 2,
        })
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#FF5C39" />
        <pointLight position={[-5, -3, -5]} intensity={1.2} color="#D4FF4F" />
        <pointLight position={[0, -5, 3]} intensity={0.8} color="#FFFFFF" />
        <TorusKnot mouseX={mouse.x} mouseY={mouse.y} />
        <Particles />
        <Environment preset="night" />
      </Canvas>
    </div>
  )
}
