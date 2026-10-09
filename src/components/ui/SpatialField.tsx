import { useEffect, useRef, type RefObject } from 'react'
import { useMotionValueEvent, type MotionValue } from 'framer-motion'

interface PointerTarget {
  x: number
  y: number
  active: boolean
}

type RGB = [number, number, number]

interface ColorStop {
  progress: number
  rgb: RGB
}

const fieldColorAnchors: Array<{ selector: string; rgb: RGB }> = [
  { selector: '#top', rgb: [194, 225, 126] },
  { selector: '#about', rgb: [194, 225, 126] },
  { selector: '#project-caseflow', rgb: [123, 228, 184] },
  { selector: '#project-clip-to-text', rgb: [255, 184, 108] },
  { selector: '#project-agentic-rag-platform', rgb: [130, 177, 255] },
  { selector: '#project-motorsport-api', rgb: [212, 165, 224] },
  { selector: '#project-live-flights-map', rgb: [240, 120, 135] },
  { selector: '#skills', rgb: [194, 225, 126] },
  { selector: '#contact', rgb: [194, 225, 126] },
]

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

function cellNoise(column: number, row: number) {
  const value = Math.sin(column * 127.1 + row * 311.7) * 43758.5453
  return value - Math.floor(value)
}

function colorAtProgress(stops: ColorStop[], progress: number): RGB {
  if (!stops.length) return [194, 225, 126]
  if (progress <= stops[0].progress) return stops[0].rgb

  const nextIndex = stops.findIndex((stop) => stop.progress >= progress)
  if (nextIndex === -1) return stops[stops.length - 1].rgb

  const from = stops[nextIndex - 1]
  const to = stops[nextIndex]
  const interval = Math.max(to.progress - from.progress, 0.0001)
  const linearProgress = clamp01((progress - from.progress) / interval)
  const easedProgress = linearProgress * linearProgress * (3 - 2 * linearProgress)
  const neutral: RGB = [104, 104, 104]
  const mix = (start: RGB, end: RGB, amount: number): RGB =>
    start.map((channel, index) => Math.round(channel + (end[index] - channel) * amount)) as RGB
  const segmentProgress = easedProgress < 0.5 ? easedProgress * 2 : (easedProgress - 0.5) * 2
  const segmentEase = segmentProgress * segmentProgress * (3 - 2 * segmentProgress)

  return easedProgress < 0.5
    ? mix(from.rgb, neutral, segmentEase)
    : mix(neutral, to.rgb, segmentEase)
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
  const colorStopsRef = useRef<ColorStop[]>([])
  const elapsedRef = useRef(0)
  const hasWokenRef = useRef(false)

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const fieldProgress = reduceMotion ? 0 : progress
    scrollRef.current = fieldProgress
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

    const measureColorStops = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      colorStopsRef.current = fieldColorAnchors.flatMap(({ selector, rgb }) => {
        const element = document.querySelector<HTMLElement>(selector)
        if (!element) return []
        const bounds = element.getBoundingClientRect()
        const centerInDocument = bounds.top + window.scrollY + bounds.height / 2
        return [{
          progress: clamp01((centerInDocument - window.innerHeight * 0.52) / maxScroll),
          rgb,
        }]
      })
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      measureColorStops()
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

      const pointer = pointerTarget.current
      const pointerMix = reduceMotion ? 0 : 1 - Math.exp(-0.012 * elapsed)
      pointerX += ((pointer.active ? pointer.x : -1000) - pointerX) * pointerMix
      pointerY += ((pointer.active ? pointer.y : -1000) - pointerY) * pointerMix
      pointerWeight += ((pointer.active && !reduceMotion ? 1 : 0) - pointerWeight) * pointerMix

      const scroll = reduceMotion ? 0 : scrollRef.current
      const [red, green, blue] = colorAtProgress(colorStopsRef.current, scroll).map((channel) => Math.round(channel))
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
          const falloff = pointerWeight * Math.pow(clamp01(1 - distance / radius), 2)

          if (falloff > 0.001 && distance > 0.5) {
            // Blend the ambient current with a local outward impulse around the pointer.
            const impulse = Math.min(0.88, falloff * 1.12)
            directionX = directionX * (1 - impulse) + dx / distance * impulse
            directionY = directionY * (1 - impulse) + dy / distance * impulse
            const magnitude = Math.hypot(directionX, directionY) || 1
            directionX /= magnitude
            directionY /= magnitude
          }

          const driftX = Math.sin(phase + row * 0.21 + column * 0.07) * 1.15
          const driftY = Math.cos(phase * 0.82 + column * 0.16 - row * 0.09) * 1.1
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
    const layoutObserver = new ResizeObserver(measureColorStops)
    fieldColorAnchors.forEach(({ selector }) => {
      const element = document.querySelector<HTMLElement>(selector)
      if (element) layoutObserver.observe(element)
    })
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
      layoutObserver.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [pageVisible, pointerTarget, reduceMotion])

  return <canvas className="spatial-field" ref={canvasRef} aria-hidden="true" />
}
