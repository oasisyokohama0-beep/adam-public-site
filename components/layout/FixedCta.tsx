import storeData from '@/lib/data/store.json'
import { MessageCircle, Phone } from 'lucide-react'
import type { StoreInfo } from '@/lib/types'

// TODO(handover): Supabase クエリに置換 / テーブル: store_info
const store = storeData as StoreInfo

export function FixedCta() {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[80] grid grid-cols-2 border-t border-rule-gold bg-bg/92 px-3 py-2.5 shadow-[0_-18px_50px_rgba(0,0,0,0.45)] backdrop-blur-md">
      {/* LEGAL(handover): LINE URL — store.json lineUrl から取得。実値に差し替え後はプレースホルダーが消えること */}
      <a
        href={store.lineUrl ?? '#'}
        className="flex items-center justify-center gap-2 border border-gold/45 bg-[rgba(199,188,163,0.08)] py-3 font-serif text-[12px] tracking-[2.5px] text-ink no-underline transition-colors hover:bg-[rgba(199,188,163,0.14)]"
      >
        <MessageCircle size={14} strokeWidth={1.5} className="text-[#6FD17D]" aria-hidden="true" />
        <span>LINE で予約</span>
      </a>
      {/* LEGAL(handover): 電話番号 — store.json phone から取得。実値に差し替え後はプレースホルダーが消えること */}
      <a
        href={`tel:${store.phone}`}
        className="flex items-center justify-center gap-2 border border-wine bg-wine/85 py-3 font-serif text-[12px] tracking-[2.5px] text-ink no-underline transition-colors hover:bg-wine"
      >
        <Phone size={13} strokeWidth={1.5} className="text-gold" aria-hidden="true" />
        <span>電話する</span>
      </a>
    </div>
  )
}
