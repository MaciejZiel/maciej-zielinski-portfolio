import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type Ref,
  type ReactNode,
} from 'react'

type RevealTag = 'div' | 'article' | 'section' | 'aside' | 'header' | 'a'

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: RevealTag
  children: ReactNode
  delay?: number
  href?: string
  rel?: string
  target?: string
}

export function Reveal({
  as = 'div',
  children,
  className,
  delay = 0,
  href,
  rel,
  style,
  target,
  ...props
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const element = ref.current

    if (!element || isVisible) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (!entry?.isIntersecting) {
          return
        }

        setIsVisible(true)
        observer.unobserve(entry.target)
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -10% 0px',
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [isVisible])

  const combinedClassName = ['reveal', isVisible && 'reveal--visible', className]
    .filter(Boolean)
    .join(' ')

  const combinedStyle = {
    '--reveal-delay': `${delay}ms`,
    ...style,
  } as CSSProperties

  switch (as) {
    case 'article':
      return (
        <article
          {...props}
          ref={ref as Ref<HTMLElement>}
          className={combinedClassName}
          style={combinedStyle}
        >
          {children}
        </article>
      )
    case 'section':
      return (
        <section
          {...props}
          ref={ref as Ref<HTMLElement>}
          className={combinedClassName}
          style={combinedStyle}
        >
          {children}
        </section>
      )
    case 'aside':
      return (
        <aside
          {...props}
          ref={ref as Ref<HTMLElement>}
          className={combinedClassName}
          style={combinedStyle}
        >
          {children}
        </aside>
      )
    case 'header':
      return (
        <header
          {...props}
          ref={ref as Ref<HTMLElement>}
          className={combinedClassName}
          style={combinedStyle}
        >
          {children}
        </header>
      )
    case 'a':
      return (
        <a
          {...props}
          href={href}
          ref={ref as Ref<HTMLAnchorElement>}
          rel={rel}
          target={target}
          className={combinedClassName}
          style={combinedStyle}
        >
          {children}
        </a>
      )
    case 'div':
    default:
      return (
        <div
          {...props}
          ref={ref as Ref<HTMLDivElement>}
          className={combinedClassName}
          style={combinedStyle}
        >
          {children}
        </div>
      )
  }
}
