'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Clear-night backdrop, shown only when the live Mumbai weather says it is night (Open-Meteo `is_day = 0`)
 * and the sky is clear/partly cloudy. A soft midnight vignette (fading into the page at its edges),
 * a handful of twinkling stars and a moon.
 */
export default function NightSky({ low = false }: { low?: boolean }) {
  const { viewport } = useThree()
  const starsMat = useRef<THREE.PointsMaterial>(null)

  const skyTex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const g = c.getContext('2d')!
    const grad = g.createRadialGradient(128, 128, 20, 128, 128, 128)
    grad.addColorStop(0, 'rgba(20, 24, 52, 0.94)')
    grad.addColorStop(0.55, 'rgba(24, 28, 60, 0.7)')
    grad.addColorStop(1, 'rgba(24, 28, 60, 0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 256, 256)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])

  const moonTex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const g = c.getContext('2d')!
    const halo = g.createRadialGradient(64, 64, 8, 64, 64, 64)
    halo.addColorStop(0, 'rgba(245, 240, 230, 0.55)')
    halo.addColorStop(1, 'rgba(245, 240, 230, 0)')
    g.fillStyle = halo
    g.fillRect(0, 0, 128, 128)
    g.fillStyle = '#F5F0E6'
    g.beginPath()
    g.arc(64, 64, 20, 0, Math.PI * 2)
    g.fill()
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])

  const starPositions = useMemo(() => {
    const n = low ? 70 : 150
    const arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 1.7
      arr[i * 3 + 1] = (Math.random() - 0.5) * 1.5
      arr[i * 3 + 2] = 0
    }
    return arr
  }, [low])

  useEffect(
    () => () => {
      skyTex.dispose()
      moonTex.dispose()
    },
    [skyTex, moonTex],
  )

  useFrame((s) => {
    if (starsMat.current) starsMat.current.opacity = 0.65 + Math.sin(s.clock.elapsedTime * 1.3) * 0.25
  })

  const w = viewport.width * 1.9
  const h = viewport.height * 1.9

  return (
    <group>
      <mesh position={[0, 0.2, -4]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={skyTex} transparent depthWrite={false} />
      </mesh>

      <points position={[0, 0.2, -3.9]} scale={[w, h, 1]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={starPositions} count={starPositions.length / 3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial ref={starsMat} color="#FFF3D6" size={0.045} sizeAttenuation transparent opacity={0.8} depthWrite={false} />
      </points>

      <mesh position={[viewport.width * 0.27, viewport.height * 0.3, -3.8]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial map={moonTex} transparent depthWrite={false} />
      </mesh>
    </group>
  )
}
