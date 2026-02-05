'use client'

import React, { useEffect, useRef } from 'react'
import styles from './AnimatedBackground.module.css'

interface AnimatedBackgroundProps {
  style?: React.CSSProperties
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
}

export default function AnimatedBackground({ style }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles
    particlesRef.current = Array.from({ length: 25 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }))

    // Animation loop
    const animate = () => {
      const particles = particlesRef.current

      // Update particle positions
      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1

        // Keep within bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))
      })

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      const maxDistance = 200
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.15
            ctx.strokeStyle = `rgba(0, 234, 150, ${opacity})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw particles
      particles.forEach((particle) => {
        // Outer glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          5
        )
        gradient.addColorStop(0, 'rgba(0, 234, 150, 0.6)')
        gradient.addColorStop(0.5, 'rgba(0, 234, 150, 0.3)')
        gradient.addColorStop(1, 'rgba(0, 234, 150, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 5, 0, Math.PI * 2)
        ctx.fill()

        // Inner particle
        ctx.fillStyle = 'rgba(0, 234, 150, 0.8)'
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className={styles.animatedBackground} style={style}>
      {/* Animated gradient layers */}
      <div className={`${styles.gradientLayer} ${styles.gradientLayer1}`}></div>
      <div className={`${styles.gradientLayer} ${styles.gradientLayer2}`}></div>
      <div className={`${styles.gradientLayer} ${styles.gradientLayer3}`}></div>

      {/* Canvas for particles and connections */}
      <canvas ref={canvasRef} className={styles.networkCanvas} />

      {/* Overlay for depth */}
      <div className={styles.backgroundOverlay}></div>
    </div>
  )
}
