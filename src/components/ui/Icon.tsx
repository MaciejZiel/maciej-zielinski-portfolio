import type { IconName } from '../../types/portfolio'

interface IconProps {
  name: IconName
  className?: string
}

export function Icon({ name, className }: IconProps) {
  switch (name) {
    case 'github':
      return (
        <svg
          aria-hidden="true"
          className={className}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.31 6.84 9.65.5.1.68-.22.68-.49 0-.24-.01-1.05-.02-1.9-2.78.62-3.37-1.21-3.37-1.21-.45-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.58 2.35 1.12 2.93.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.15-4.56-5.12 0-1.13.39-2.06 1.04-2.79-.1-.26-.45-1.33.1-2.78 0 0 .85-.28 2.8 1.07A9.43 9.43 0 0 1 12 6.84c.85 0 1.7.12 2.5.37 1.95-1.35 2.8-1.07 2.8-1.07.56 1.45.21 2.52.1 2.78.65.73 1.04 1.66 1.04 2.79 0 3.98-2.34 4.85-4.57 5.11.36.32.68.96.68 1.94 0 1.4-.01 2.53-.01 2.87 0 .27.18.59.69.49A10.23 10.23 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'linkedin':
      return (
        <svg
          aria-hidden="true"
          className={className}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M6.94 8.5H3.56V20h3.38V8.5Zm.22-3.57C7.15 3.8 6.26 3 5.27 3s-1.89.8-1.89 1.93c0 1.11.88 1.93 1.86 1.93h.02c1.02 0 1.9-.82 1.9-1.93ZM20 13.01c0-3.32-1.77-4.86-4.14-4.86-1.91 0-2.76 1.06-3.24 1.8V8.5H9.24c.05.95 0 11.5 0 11.5h3.38v-6.42c0-.34.02-.68.12-.92.27-.68.88-1.38 1.9-1.38 1.34 0 1.88 1.04 1.88 2.57V20H20v-6.99Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'mail':
      return (
        <svg
          aria-hidden="true"
          className={className}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M4 6.5h16c1.1 0 2 .9 2 2v7c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-7c0-1.1.9-2 2-2Zm0 1.8v.37l8 4.95 8-4.95V8.3H4Zm16 7.4v-4.92l-7.48 4.63a1 1 0 0 1-1.04 0L4 10.78v4.92h16Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'arrow-up-right':
    default:
      return (
        <svg
          aria-hidden="true"
          className={className}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M7 17 17 7M9.5 7H17v7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
  }
}
