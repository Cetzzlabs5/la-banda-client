interface NeonBadgeProps {
  children: React.ReactNode
  variant?: 'cyan' | 'amber'
  className?: string
}

export default function NeonBadge({ children, variant = 'amber', className = '' }: NeonBadgeProps) {
  const styles = {
    cyan: 'bg-[rgba(31,164,169,0.15)] border border-[rgba(31,164,169,0.4)] text-[#1fa4a9]',
    amber: 'bg-[rgba(224,142,46,0.15)] border border-[rgba(224,142,46,0.4)] text-[#e08e2e]',
  }

  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-1',
        'text-xs font-bold uppercase tracking-wider',
        'font-mono rounded-sm',
        styles[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
