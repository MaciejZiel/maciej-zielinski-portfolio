import { useEffect, useRef, type RefObject } from 'react'
import { useMotionValueEvent, type MotionValue } from 'framer-motion'

interface PointerTarget {
  x: number
  y: number
  active: boolean
}

interface FieldScene {
  rgb: [number, number, number]
  flow: number
  pointer: number
}

const scenes: Record<string, FieldScene> = {
  top: { rgb: [194, 225, 126], flow: 0.76, pointer: 1 },
  about: { rgb: [194, 225, 126], flow: 0.68, pointer: 0.9 },
  steel: { rgb: [123, 228, 184], flow: 0.48, pointer: 0.88 },
  signal: { rgb: [255, 184, 108], flow: 1, pointer: 1.08 },
  vision: { rgb: [130, 177, 255], flow: 0.58, pointer: 0.92 },
  flights: { rgb: [113, 198, 218], flow: 0.78, pointer: 1 },
  track: { rgb: [212, 165, 224], flow: 0.88, pointer: 1.04 },
  skills: { rgb: [194, 225, 126], flow: 0.58, pointer: 0.86 },
  contact: { rgb: [194, 225, 126], flow: 0.34, pointer: 0.82 },
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

function cellNoise(column: number, row: number) {
  const value = Math.sin(column * 127.1 + row * 311.7) * 43758.5453
  return value - Math.floor(value)
}

export function SpatialField({
  chapter,
  pointerTarget,
  reduceMotion,
  pageVisible,
  scrollYProgress,
}: {
  chapter: string
  pointerTarget: RefObject<PointerTarget>
  reduceMotion: boolean
  pageVisible: boolean
  scrollYProgress: MotionValue<number>
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const scrollRef = useRef(0)
  const sceneRef = useRef<FieldScene>({ ...scenes.top, rgb: [...scenes.top.rgb] })
  const elapsedRef = useRef(0)
  const hasWokenRef = useRef(false)

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
    const wakeStartedAt = performance.now()
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
      if (!width || !height) return

      const elapsed = previousFrame ? Math.min(timestamp - previousFrame, 50) : 0
      previousFrame = timestamp
      if (!reduceMotion && pageVisible) elapsedRef.current += elapsed

      const scene = sceneRef.current
      const targetScene = scenes[chapter] ?? scenes.top
      const sceneMix = reduceMotion ? 1 : 1 - Math.exp(-0.0019 * elapsed)
      scene.rgb = scene.rgb.map((channel, index) => channel + (targetScene.rgb[index] - channel) * sceneMix) as FieldScene['rgb']
      scene.flow += (targetScene.flow - scene.flow) * sceneMix
      scene.pointer += (targetScene.pointer - scene.pointer) * sceneMix

      const pointer = pointerTarget.current
      const pointerMix = reduceMotion ? 0 : 1 - Math.exp(-0.012 * elapsed)
      pointerX += ((pointer.active ? pointer.x : -1000) - pointerX) * pointerMix
      pointerY += ((pointer.active ? pointer.y : -1000) - pointerY) * pointerMix
      pointerWeight += ((pointer.active && !reduceMotion ? 1 : 0) - pointerWeight) * pointerMix

      const scroll = reduceMotion ? 0 : scrollRef.current
      const wakeProgress = reduceMotion || !pageVisible || hasWokenRef.current
        ? 1
        : Math.min(1, Math.max(0, (timestamp - wakeStartedAt) / 1180))
      if (wakeProgress === 1) hasWokenRef.current = true

      const mobile = width <= 760
      const spacingX = mobile ? 38 : 40
      const spacingY = mobile ? 42 : 38
      const columns = Math.ceil(width / spacingX) + 2
      const rows = Math.ceil(height / spacingY) + 2
      const originX = (width - (columns - 1) * spacingX) / 2 - spacingX / 2
      const originY = (height - (rows - 1) * spacingY) / 2 - spacingY / 2
      const radius = Math.min(360, width * (mobile ? 0.62 : 0.32))
      const phase = elapsedRef.current * 0.00016 + scroll * 1.35
      const [red, green, blue] = scene.rgb.map((channel) => Math.round(channel))
      const basePath = new Path2D()
      const outerResponse = new Path2D()
      const middleResponse = new Path2D()
      const innerResponse = new Path2D()

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const baseX = originX + column * spacingX
          const baseY = originY + row * spacingY
          const seed = cellNoise(column, row)
          const u = baseX / width
          const v = baseY / height

          // Overlapping broad waves form a coherent current without turning into a rigid grid.
          const fieldAngle =
            Math.sin(u * Math.PI * 4.2 + Math.sin(v * Math.PI * 2.6 + phase * 0.72) * 0.82 + phase) * 0.62 +
            Math.cos(v * Math.PI * 3.4 - u * Math.PI * 2.1 - phase * 0.83) * 0.48 +
            Math.sin((u - v) * Math.PI * 2.35 + phase * 0.48) * 0.3 +
            (scroll - 0.35) * 0.4

          let directionX = Math.cos(fieldAngle)
          let directionY = Math.sin(fieldAngle)
          const dx = baseX - pointerX
          const dy = baseY - pointerY
          const distance = Math.hypot(dx, dy)
          const falloff = pointerWeight * Math.pow(clamp01(1 - distance / radius), 2) * scene.pointer

          if (falloff > 0.001 && distance > 0.5) {
            // Blend the ambient current with a local outward impulse around the pointer.
            const impulse = Math.min(0.88, falloff * 1.12)
            directionX = directionX * (1 - impulse) + dx / distance * impulse
            directionY = directionY * (1 - impulse) + dy / distance * impulse
            const magnitude = Math.hypot(directionX, directionY) || 1
            directionX /= magnitude
            directionY /= magnitude
          }

          const driftX = Math.sin(phase + row * 0.21 + column * 0.07) * scene.flow * 1.6
          const driftY = Math.cos(phase * 0.82 + column * 0.16 - row * 0.09) * scene.flow * 1.5
          const centerX = baseX + driftX
          const centerY = baseY + driftY
          const length = (6 + seed * 6.5 + falloff * 10) * (mobile ? 0.9 : 1)
          const halfLength = length * 0.5
          const x1 = centerX - directionX * halfLength
          const y1 = centerY - directionY * halfLength
          const x2 = centerX + directionX * halfLength
          const y2 = centerY + directionY * halfLength

          basePath.moveTo(x1, y1)
          basePath.lineTo(x2, y2)
          if (falloff > 0.08) {
            const path = falloff > 0.62 ? innerResponse : falloff > 0.3 ? middleResponse : outerResponse
            path.moveTo(x1, y1)
            path.lineTo(x2, y2)
          }
        }
      }

      context.clearRect(0, 0, width, height)
      context.lineCap = 'round'
      context.lineWidth = mobile ? 0.8 : 0.85
      context.strokeStyle = `rgba(${red},${green},${blue},${0.2 * wakeProgress})`
      context.stroke(basePath)

      // A restrained local lift makes the field's pointer response easy to notice.
      context.lineWidth = mobile ? 1 : 1.05
      context.strokeStyle = `rgba(${red},${green},${blue},${0.12 * wakeProgress})`
      context.stroke(outerResponse)
      context.strokeStyle = `rgba(${red},${green},${blue},${0.2 * wakeProgress})`
      context.stroke(middleResponse)
      context.lineWidth = mobile ? 1.1 : 1.2
      context.strokeStyle = `rgba(${red},${green},${blue},${0.3 * wakeProgress})`
      context.stroke(innerResponse)
    }

    const handleResize = () => {
      resize()
      if (reduceMotion || !pageVisible) draw(0)
    }

    handleResize()
    if (!reduceMotion && pageVisible) {
      const animate = (timestamp: number) => {
        frame = requestAnimationFrame(animate)
        if (timestamp - previousFrame < 1000 / 30) return
        draw(timestamp)
      }
      frame = requestAnimationFrame(animate)
    }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', handleResize)
    }
  }, [chapter, pageVisible, pointerTarget, reduceMotion])

  return <canvas className="spatial-field" ref={canvasRef} aria-hidden="true" />
}
