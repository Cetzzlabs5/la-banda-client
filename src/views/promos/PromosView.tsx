import { useState } from 'react'
import { Ticket } from 'lucide-react'
import { usePromos } from '@/hooks/usePromos'
import type { PromoFilterType } from '@/types/promo'
import CyberCard from '@/components/ui/CyberCard'
import CyberButton from '@/components/ui/CyberButton'
import NeonBadge from '@/components/ui/NeonBadge'
import { toast } from 'sonner'

const USER_BALANCE = 12450

const FILTER_TABS: { label: string; value: PromoFilterType }[] = [
  { label: 'Todos',    value: 'todos'    },
  { label: 'Bares',   value: 'bares'    },
  { label: 'Boliches', value: 'boliches' },
]

function PromoSkeleton() {
  return (
    <div className="card-cyber overflow-hidden animate-pulse">
      <div className="h-44 w-full bg-[rgba(100,116,139,0.1)]" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-24 bg-[rgba(100,116,139,0.15)] rounded" />
        <div className="h-5 w-48 bg-[rgba(100,116,139,0.2)] rounded" />
        <div className="h-10 w-full bg-[rgba(100,116,139,0.1)] rounded" />
      </div>
    </div>
  )
}

export default function PromosView() {
  const [activeFilter, setActiveFilter] = useState<PromoFilterType>('todos')
  const { promos, isLoading, isError } = usePromos(activeFilter)

  const handleRedeem = (promoTitle: string) => {
    toast.info(`Canjeando: ${promoTitle}`)
  }

  return (
    <div className="px-4 py-4 flex flex-col gap-5 max-w-lg mx-auto">

      {/* Balance Card */}
      <CyberCard>
        <p className="text-[10px] uppercase tracking-widest text-[#64748b] font-semibold">Tu Balance</p>
        <div className="flex items-baseline gap-2 mt-1">
          <span
            className="text-4xl font-black font-mono leading-none"
            style={{ color: '#e08e2e', textShadow: '0 0 20px rgba(224,142,46,0.6)' }}
          >
            {USER_BALANCE.toLocaleString('es-AR')}
          </span>
          <span className="text-sm font-bold uppercase tracking-widest text-[#e08e2e]">PTS</span>
        </div>
        <p className="text-xs text-[#1fa4a9] mt-2">
          Canjeá tus puntos por recompensas exclusivas
        </p>
      </CyberCard>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {FILTER_TABS.map(({ label, value }) => {
          const isActive = activeFilter === value
          return (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              className={[
                'flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200',
                isActive
                  ? 'bg-[#1fa4a9] text-[#081726] glow-cyan-sm'
                  : 'bg-[rgba(15,42,68,0.6)] text-[#64748b] border border-[rgba(100,116,139,0.3)] hover:text-[#f4f7fa] hover:border-[rgba(31,164,169,0.3)]',
              ].join(' ')}
              style={{ clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0% 100%)' }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Section Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-px bg-[#1fa4a9]" />
        <span className="text-[10px] uppercase tracking-widest text-[#1fa4a9] font-bold">
          Promociones Disponibles
        </span>
      </div>

      {isError && (
        <div className="card-cyber p-6 text-center">
          <p className="text-sm text-[#e53e3e]">No se pudieron cargar las promos</p>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col gap-4">
          <PromoSkeleton />
          <PromoSkeleton />
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {promos.length === 0 ? (
            <div className="card-cyber p-8 text-center flex flex-col items-center gap-3">
              <Ticket size={32} color="#64748b" strokeWidth={1.5} />
              <p className="text-sm text-[#64748b]">Sin promociones disponibles</p>
              <p className="text-xs text-[#64748b] opacity-60">
                Las promos aparecerán una vez conectado al backend.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {promos.map((promo) => (
                <div key={promo._id} className="card-cyber overflow-hidden">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={promo.imageUrl}
                      alt={promo.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,23,38,0.8)] via-transparent to-transparent" />
                    <div className="absolute top-3 right-3">
                      <NeonBadge variant="amber">{promo.pointsCost.toLocaleString('es-AR')} PTS</NeonBadge>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#64748b]">{promo.venue}</p>
                      <h3 className="text-base font-bold text-[#f4f7fa] mt-0.5">{promo.title}</h3>
                    </div>
                    <CyberButton variant="primary" fullWidth onClick={() => handleRedeem(promo.title)}>
                      Canjear Ahora
                    </CyberButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="pb-4" />
    </div>
  )
}
