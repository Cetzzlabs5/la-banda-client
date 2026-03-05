import { QrCode, Users, MapPin, Trophy, ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import CyberCard from '@/components/ui/CyberCard'
import NeonBadge from '@/components/ui/NeonBadge'

// Mock data — replace with actual React Query hooks when endpoints are ready
const MOCK_USER_STATS = {
  points: 12450,
  rank: 'ELITE NIGHT',
  nextLevelPoints: 15000,
  totalGroups: 3,
  name: 'Alex',
}

export default function HomeView() {
  const progressPct = Math.min(
    100,
    Math.round((MOCK_USER_STATS.points / MOCK_USER_STATS.nextLevelPoints) * 100)
  )

  return (
    <div className="px-4 py-4 flex flex-col gap-5 max-w-lg mx-auto">

      {/* Hero */}
      <div className="pt-2">
        <h1
          className="text-4xl font-black uppercase tracking-wider leading-tight text-[#f4f7fa]"
          style={{ textShadow: '0 0 30px rgba(31,164,169,0.15)' }}
        >
          Dominá
          <br />
          <span className="text-glow-cyan" style={{ color: '#1fa4a9' }}>
            La Noche
          </span>
        </h1>
        <p className="text-sm text-[#64748b] mt-2 tracking-wide">
          Puntos, beneficios y pedidos en tiempo real.
        </p>
      </div>

      {/* Score Card */}
      <CyberCard>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <span className="text-[10px] uppercase tracking-widest text-[#64748b] font-semibold">
              Mi Score de Puntos
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className="text-5xl font-black font-mono leading-none"
                style={{ color: '#e08e2e', textShadow: '0 0 20px rgba(224,142,46,0.6)' }}
              >
                {MOCK_USER_STATS.points.toLocaleString('es-AR')}
              </span>
              <span className="text-xs text-[#64748b] font-mono font-semibold">pts</span>
            </div>
          </div>
          <div
            className="p-3 border border-[rgba(224,142,46,0.3)] bg-[rgba(224,142,46,0.08)]"
            style={{ clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0% 100%)' }}
          >
            <Trophy size={24} color="#e08e2e" strokeWidth={1.5} />
          </div>
        </div>

        {/* Rank row */}
        <div className="flex items-center justify-between mt-4 text-[10px] uppercase tracking-widest">
          <span className="text-[#1fa4a9] font-bold">Rango: {MOCK_USER_STATS.rank}</span>
          <span className="text-[#64748b]">
            Próximo Nivel:{' '}
            <span className="text-[#f4f7fa] font-mono font-bold">
              {MOCK_USER_STATS.nextLevelPoints.toLocaleString('es-AR')}
            </span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-1.5 w-full rounded-full bg-[rgba(100,116,139,0.2)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, #1fa4a9, #e08e2e)',
              boxShadow: '0 0 8px rgba(31,164,169,0.5)',
            }}
          />
        </div>
      </CyberCard>

      {/* QR Scan Button */}
      <div className="flex flex-col items-center gap-2">
        <button
          className="w-full flex items-center justify-center gap-4 py-5 font-black uppercase tracking-widest text-base transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #1fa4a9 0%, #25bec4 100%)',
            clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0% 100%)',
            color: '#081726',
            boxShadow: '0 0 25px rgba(31,164,169,0.5), 0 0 50px rgba(31,164,169,0.2)',
            animation: 'pulse-glow 2s ease-in-out infinite',
          }}
        >
          <QrCode size={28} strokeWidth={2} />
          Escanear QR
        </button>
        <p className="text-[10px] uppercase tracking-widest text-[#64748b]">
          Escaneá para sumar puntos y pedir
        </p>
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase tracking-widest text-[#64748b]">Grupos Totales:</span>
          <span
            className="text-sm font-black font-mono"
            style={{ color: '#e08e2e', textShadow: '0 0 8px rgba(224,142,46,0.5)' }}
          >
            {MOCK_USER_STATS.totalGroups}
          </span>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/grupos" className="block group">
          <CyberCard className="flex flex-col items-center gap-3 py-6 transition-all duration-200 hover:border-[rgba(31,164,169,0.5)]">
            <Users size={28} color="#1fa4a9" strokeWidth={1.5} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#f4f7fa]">
              Mis Grupos
            </span>
            <NeonBadge variant="cyan">{MOCK_USER_STATS.totalGroups}</NeonBadge>
          </CyberCard>
        </Link>

        <Link to="/salidas" className="block group">
          <CyberCard className="flex flex-col items-center gap-3 py-6 transition-all duration-200 hover:border-[rgba(224,142,46,0.4)] border-[rgba(224,142,46,0.2)]">
            <MapPin size={28} color="#e08e2e" strokeWidth={1.5} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#f4f7fa]">
              Salidas Activas
            </span>
            <NeonBadge variant="amber">Ver</NeonBadge>
          </CyberCard>
        </Link>
      </div>

      {/* Quick shortcut to promos */}
      <Link
        to="/promos"
        className="flex items-center justify-between px-4 py-3 border border-[rgba(31,164,169,0.15)] bg-[rgba(15,42,68,0.4)] hover:border-[rgba(31,164,169,0.35)] transition-all"
        style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
      >
        <span className="text-xs uppercase tracking-widest text-[#64748b]">Ver todas las promociones</span>
        <ChevronRight size={16} color="#1fa4a9" strokeWidth={1.5} />
      </Link>

      <div className="pb-4" />
    </div>
  )
}
