'use client'

import { useEffect, useRef, useState } from 'react'

type Shape = {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  rotation: number
  color: string
  speed: number
  driftX: number
  driftY: number
}

export default function FloatingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shapesRef = useRef<Shape[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const colors = ['#FF5C39', '#D4FF4F', '#FFFFFF']
    shapesRef.current = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 60 + 20,
      opacity: Math.random() * 0.04 + 0.01,
      rotation: Math.random() * Math.PI * 2,
      color: colors[i % 3],
      speed: Math.random() * 0.003 + 0.001,
      driftX: (Math.random() - 0.5) * 0.3,
      driftY: (Math.random() - 0.5) * 0.3,
    }))

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMouseMove)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      shapesRef.current.forEach((shape) => {
        shape.rotation += shape.speed
        shape.x += shape.driftX
        shape.y += shape.driftY

        // Wrap around edges
        if (shape.x < -shape.size) shape.x = canvas.width + shape.size
        if (shape.x > canvas.width + shape.size) shape.x = -shape.size
        if (shape.y < -shape.size) shape.y = canvas.height + shape.size
        if (shape.y > canvas.height + shape.size) shape.y = -shape.size

        // Subtle mouse parallax
        const dx = (mouseRef.current.x / canvas.width - 0.5) * 8
        const dy = (mouseRef.current.y / canvas.height - 0.5) * 8

        ctx.save()
        ctx.translate(shape.x + dx * 0.02, shape.y + dy * 0.02)
        ctx.rotate(shape.rotation)
        ctx.globalAlpha = shape.opacity

        // Draw rectangle/diamond
        ctx.strokeStyle = shape.color
        ctx.lineWidth = 1
        ctx.beginPath()
        const s = shape.size
        ctx.rect(-s / 2, -s / 2, s, s)
        ctx.stroke()
        ctx.restore()
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
