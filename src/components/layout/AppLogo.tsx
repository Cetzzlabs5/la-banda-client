import { Gamepad2 } from 'lucide-react'

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { icon: 18, text: 'text-base' },
  md: { icon: 22, text: 'text-xl' },
  lg: { icon: 32, text: 'text-3xl' },
}

export default function AppLogo({ size = 'md' }: AppLogoProps) {
  const { icon, text } = sizeMap[size]

  return (
    <div className="flex items-center gap-2">
      <div className="p-1.5 border border-[#1fa4a9] glow-cyan-sm">
        <Gamepad2 size={icon} color="#1fa4a9" strokeWidth={2} />
      </div>
      <span
        className={`${text} font-black uppercase tracking-wider text-glow-cyan`}
        style={{ color: '#1fa4a9' }}
      >
        CETZZ{' '}
        <span className="text-[#f4f7fa]" style={{ textShadow: 'none' }}>
          NIGHTS
        </span>
      </span>
    </div>
  )
}
