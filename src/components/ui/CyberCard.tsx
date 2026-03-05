import type { ReactNode, HTMLAttributes } from 'react'

interface CyberCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  noPadding?: boolean
}

export default function CyberCard({ children, noPadding = false, className = '', ...props }: CyberCardProps) {
  return (
    <div
      {...props}
      className={[
        'card-cyber',
        noPadding ? '' : 'p-5',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
