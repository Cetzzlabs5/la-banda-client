import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'amber' | 'ghost' | 'danger'
  isLoading?: boolean
  fullWidth?: boolean
  children: ReactNode
}

const variantClasses: Record<NonNullable<CyberButtonProps['variant']>, string> = {
  primary: 'bg-[#1fa4a9] text-[#081726] hover:bg-[#25bec4] animate-pulse-glow',
  amber:   'bg-[#e08e2e] text-[#081726] hover:bg-[#eea040] animate-pulse-glow-amber',
  ghost:   'bg-transparent border border-[rgba(31,164,169,0.4)] text-[#1fa4a9] hover:border-[#1fa4a9] hover:bg-[rgba(31,164,169,0.08)]',
  danger:  'bg-transparent border border-[rgba(229,62,62,0.4)] text-[#e53e3e] hover:border-[#e53e3e] hover:bg-[rgba(229,62,62,0.08)]',
}

export default function CyberButton({
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: CyberButtonProps) {
  const isDisabled = disabled || isLoading

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={[
        'clip-rhombus',
        'relative flex items-center justify-center gap-2',
        'px-8 py-4 font-bold uppercase tracking-widest text-sm',
        'transition-all duration-200 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none',
        variantClasses[variant],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Cargando...
        </span>
      ) : children}
    </button>
  )
}
