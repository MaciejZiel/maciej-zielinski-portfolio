import { useEffect, useRef, type RefObject } from 'react'
import { useMotionValueEvent, type MotionValue } from 'framer-motion'

interface PointerTarget {
  x: number
  y: number
  active: boolean
}

export function SpatialField({
  pointerTarget,
  reduceMotion,
  pageVisible,
  scrollYProgress,
}: {
  pointerTarget: RefObject<PointerTarget>
  reduceMotion: boolean
  pageVisible: boolean
  scrollYProgress: MotionValue<number>
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const scrollRef = useRef(0)

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    scrollRef.current = progress
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: true })
    if (!canvas || !context) return

    let width = 0
    let height = 0
    let frame = 0
    let previousFrame = 0
    let currentTime = 0
    let pointerX = -1000
    let pointerY = -1000
    let pointerWeight = 0
    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const draw = (timestamp: number) => {
      if (width === 0 || height === 0) return
      const elapsed = previousFrame === 0 ? 0 : Math.min(timestamp - previousFrame, 50)
      previousFrame = timestamp

      const pointer = pointerTarget.current
      const pointerMix = reduceMotion ? 0 : 1 - Math.exp(-0.012 * elapsed)
      pointerX += ((pointer.active ? pointer.x : -1000) - pointerX) * pointerMix
      pointerY += ((pointer.active ? pointer.y : -1000) - pointerY) * pointerMix
      pointerWeight += ((pointer.active && !reduceMotion ? 1 : 0) - pointerWeight) * pointerMix

      const progress = reduceMotion ? 0 : scrollRef.current
      const centerX = width * 0.5
      const centerY = height * 0.5
      const scale = 1 + (progress - 0.35) * 0.036
      const stepX = 94
      const stepY = 88
      const columns = Math.ceil(width / stepX) + 3
      const rows = Math.ceil(height / stepY) + 3
      const originX = (width - (columns - 1) * stepX) / 2 - stepX
      const originY = (height - (rows - 1) * stepY) / 2 - stepY
      const radius = Math.min(360, width * 0.3)
      const time = reduceMotion || !pageVisible ? currentTime : (currentTime += elapsed)
      const phase = time * 0.00022
      const pointAt = (column: number, row: number) => {
        const baseX = originX + column * stepX
        const baseY = originY + row * stepY
        const centeredY = baseY - centerY
        const ambient = reduceMotion || !pageVisible ? 0 : 3.6
        const wave = Math.sin(baseX * 0.004 + phase + baseY * 0.002) * ambient
        const pointerDX = baseX - pointerX
        const pointerDY = baseY - pointerY
        const distance = Math.hypot(pointerDX, pointerDY)
        const falloff = pointerWeight * Math.pow(Math.max(0, 1 - distance / radius), 2)
        const inverseDistance = 1 / Math.max(distance, 1)

        return {
          x: centerX + (baseX - centerX) * scale + centeredY * progress * 0.012 + wave - pointerDX * inverseDistance * falloff * 48,
          y: centerY + centeredY * scale + Math.cos(baseX * 0.004 - phase) * ambient * 0.65 - pointerDY * inverseDistance * falloff * 48,
        }
      }

      context.clearRect(0, 0, width, height)
      context.lineWidth = 0.7
      for (let row = 0; row < rows; row += 1) {
        context.beginPath()
        for (let column = 0; column < columns; column += 1) {
          const point = pointAt(column, row)
          if (column === 0) context.moveTo(point.x, point.y)
          else context.lineTo(point.x, point.y)
        }
        context.strokeStyle = 'rgba(226,233,226,0.105)'
        context.stroke()
      }
      for (let column = 0; column < columns; column += 1) {
        context.beginPath()
        for (let row = 0; row < rows; row += 1) {
          const point = pointAt(column, row)
          if (row === 0) context.moveTo(point.x, point.y)
          else context.lineTo(point.x, point.y)
        }
        context.strokeStyle = 'rgba(226,233,226,0.105)'
        context.stroke()
      }
    }

    const handleResize = () => {
      resize()
      if (reduceMotion || !pageVisible) draw(0)
    }

    handleResize()
    if (reduceMotion || !pageVisible) draw(0)
    else {
      const animate = (timestamp: number) => {
        frame = requestAnimationFrame(animate)
        if (timestamp - previousFrame < 1000 / (window.innerWidth <= 760 ? 20 : 30)) return
        draw(timestamp)
      }
      frame = requestAnimationFrame(animate)
    }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', handleResize)
    }
  }, [pageVisible, pointerTarget, reduceMotion])

  return <canvas className="spatial-field" ref={canvasRef} aria-hidden="true" />
}
