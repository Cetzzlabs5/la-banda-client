import { forwardRef, useState, type InputHTMLAttributes, type ReactElement } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface CyberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactElement
}

const CyberInput = forwardRef<HTMLInputElement, CyberInputProps>(
  ({ label, error, icon, className = '', type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-widest text-[#1fa4a9]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3 text-[#64748b] flex items-center pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            type={inputType}
            {...props}
            className={[
              'w-full bg-transparent',
              'border border-[rgba(100,116,139,0.4)]',
              'text-[#f4f7fa] placeholder:text-[#64748b]',
              'py-3.5 pr-4 rounded-sm text-sm',
              'transition-all duration-200 outline-none',
              'focus:border-[#1fa4a9] focus:shadow-[0_0_0_1px_rgba(31,164,169,0.3),0_0_12px_rgba(31,164,169,0.2)]',
              icon ? 'pl-10' : 'pl-4',
              error ? 'border-[#e53e3e] focus:border-[#e53e3e]' : '',
              className,
            ].join(' ')}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 text-[#64748b] hover:text-[#1fa4a9] transition-colors"
            >
              {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
            </button>
          )}
        </div>
        {error && (
          <span className="text-xs text-[#e53e3e] mt-0.5">{error}</span>
        )}
      </div>
    )
  }
)

CyberInput.displayName = 'CyberInput'
export default CyberInput
