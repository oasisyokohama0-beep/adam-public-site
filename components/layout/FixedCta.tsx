import storeData from '@/lib/data/store.json'
import type { StoreInfo } from '@/lib/types'

// TODO(handover): Supabase クエリに置換 / テーブル: store_info
const store = storeData as StoreInfo

export function FixedCta() {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[80] flex shadow-[0_-1px_0_rgba(184,149,106,0.45)]">
      {/* LEGAL(handover): LINE URL — store.json lineUrl から取得。実値に差し替え後はプレースホルダーが消えること */}
      <a
        href={store.lineUrl ?? '#'}
        className="flex-1 flex items-center justify-center gap-1.5 py-[14px] bg-line-green text-white font-serif text-[13px] tracking-[3px] no-underline"
      >
        <span>💬</span>
        <span>LINE で予約</span>
      </a>
      {/* LEGAL(handover): 電話番号 — store.json phone から取得。実値に差し替え後はプレースホルダーが消えること */}
      <a
        href={`tel:${store.phone}`}
        className="flex-1 flex items-center justify-center gap-1.5 py-[14px] bg-gold text-bg font-serif text-[13px] tracking-[3px] no-underline"
      >
        <span>📞</span>
        <span>電話する</span>
      </a>
    </div>
  )
}
