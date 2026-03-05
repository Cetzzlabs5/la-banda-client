export type PromoFilterType = 'todos' | 'bares' | 'boliches'

export interface Promo {
  _id: string
  title: string
  venue: string
  category: Exclude<PromoFilterType, 'todos'>
  pointsCost: number
  imageUrl: string
  description?: string
}
