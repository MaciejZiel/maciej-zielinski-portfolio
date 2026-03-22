import type { PropsWithChildren } from 'react'

import type { ButtonVariant, IconName } from '../../types/portfolio'
import { Icon } from './Icon'

interface ButtonLinkProps extends PropsWithChildren {
  href: string
  variant?: ButtonVariant
  icon?: IconName
  external?: boolean
  className?: string
}

export function ButtonLink({
  children,
  href,
  variant = 'secondary',
  icon,
  external = false,
  className,
}: ButtonLinkProps) {
  const composedClassName = ['button-link', `button-link--${variant}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <a
      className={composedClassName}
      href={href}
      rel={external ? 'noreferrer' : undefined}
      target={external ? '_blank' : undefined}
    >
      <span>{children}</span>
      {icon ? <Icon name={icon} className="button-link__icon" /> : null}
    </a>
  )
}
