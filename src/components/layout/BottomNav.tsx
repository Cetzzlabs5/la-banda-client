import { useLocation, Link } from 'react-router'
import { Home, Ticket, MapPin, User } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/',        label: 'HOME',   Icon: Home   },
  { path: '/promos',  label: 'PROMOS', Icon: Ticket },
  { path: '/mapa',    label: 'MAPA',   Icon: MapPin },
  { path: '/profile', label: 'PERFIL', Icon: User   },
] as const

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="glass-bottom fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-3">
      {NAV_ITEMS.map(({ path, label, Icon }) => {
        const isActive = pathname === path
        return (
          <Link
            key={path}
            to={path}
            className="flex flex-col items-center gap-1 min-w-[56px] transition-all duration-200 group"
          >
            <span
              className={[
                'flex items-center justify-center transition-all duration-200',
                isActive
                  ? 'text-[#1fa4a9] drop-shadow-[0_0_6px_rgba(31,164,169,0.8)]'
                  : 'text-[#64748b] group-hover:text-[#f4f7fa]',
              ].join(' ')}
            >
              <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
            </span>
            <span
              className={[
                'text-[9px] font-bold uppercase tracking-widest transition-colors duration-200',
                isActive ? 'text-[#1fa4a9]' : 'text-[#64748b] group-hover:text-[#f4f7fa]',
              ].join(' ')}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
