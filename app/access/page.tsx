import type { Metadata } from 'next'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { BDivider } from '@/components/common/BDivider'
import storeData from '@/lib/data/store.json'
import type { StoreInfo } from '@/lib/types'

export const metadata: Metadata = {
  title: 'アクセス',
  description: 'アクセス情報。完全予約制。',
}

// TODO(handover): Supabase クエリに置換
// 元データ: lib/data/store.json / テーブル: store_info
const store = storeData as StoreInfo

export default function AccessPage() {
  return (
    <PageWrapper>
      <main>
        <div className="px-6 pt-10 pb-6 text-center">
          <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold italic">Access</span>
          <div className="font-jp text-[22px] mt-3 tracking-[4px]">アクセス</div>
          <div className="mt-4"><BDivider /></div>
          <div className="font-jp text-[11px] text-ink-sub mt-4 leading-loose">
            完全予約制です。ご予約確定後に詳細な場所をお知らせします。
          </div>
        </div>

        {/* エリア情報 */}
        <div className="px-[22px] flex flex-col gap-4 pb-8">
          {/* LEGAL(handover): エリア・アクセス情報
              担当：イグチ（実際の営業エリアを差し込み） */}
          <div className="bg-surface border border-rule-gold p-5">
            <div className="font-serif text-[10px] tracking-[3px] text-gold italic mb-1.5">Area</div>
            <div className="font-jp text-[16px]">{store.area}</div>
            <div className="w-full h-px bg-rule-gold my-3" />
            {/* LEGAL(handover): エリア詳細・最寄り駅
                担当：イグチ（公開OKな範囲で記載すること） */}
            <div className="font-jp text-[12px] text-ink-sub leading-relaxed">
              [STORE_ACCESS_DETAIL]
            </div>
          </div>
        </div>

        {/* 店舗情報テーブル（store.json から読み込み） */}
        <div className="px-[22px] pb-8">
          <div className="text-center mb-5">
            <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold italic">Information</span>
          </div>
          <div className="bg-surface border border-rule-gold divide-y divide-rule">
            <div className="flex py-4 px-4 gap-4">
              <div className="w-16 flex-shrink-0 font-serif text-[10px] tracking-[1.5px] italic text-gold">営業時間</div>
              {/* LEGAL(handover): 営業時間 — store.json businessHours から自動取得 */}
              <div className="font-jp text-[12.5px] text-ink leading-relaxed">{store.businessHours}</div>
            </div>
            <div className="flex py-4 px-4 gap-4">
              <div className="w-16 flex-shrink-0 font-serif text-[10px] tracking-[1.5px] italic text-gold">定休日</div>
              {/* LEGAL(handover): 定休日 — store.json closedDays から自動取得 */}
              <div className="font-jp text-[12.5px] text-ink leading-relaxed">{(store as StoreInfo & { closedDays?: string }).closedDays}</div>
            </div>
            <div className="flex py-4 px-4 gap-4">
              <div className="w-16 flex-shrink-0 font-serif text-[10px] tracking-[1.5px] italic text-gold">電話</div>
              {/* LEGAL(handover): 電話番号 — store.json phone から自動取得 */}
              <a href={`tel:${store.phone}`} className="font-jp text-[12.5px] text-ink leading-relaxed no-underline">
                {store.phone}
              </a>
            </div>
            <div className="flex py-4 px-4 gap-4">
              <div className="w-16 flex-shrink-0 font-serif text-[10px] tracking-[1.5px] italic text-gold">LINE</div>
              {/* LEGAL(handover): LINE URL — store.json lineUrl から自動取得 */}
              <a href={store.lineUrl} className="font-jp text-[12.5px] text-ink leading-relaxed no-underline">
                {store.lineUrl}
              </a>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-[22px] pb-8">
          <div className="bg-surface text-white px-6 py-6 text-center">
            <div className="font-serif text-[10px] tracking-[4px] text-gold italic">RESERVATIONS</div>
            <div className="font-jp text-sm mt-3 leading-relaxed">ご予約・お問い合わせはこちら</div>
            <div className="w-7 h-px bg-gold mx-auto my-4" />
            <div className="flex gap-2.5 justify-center">
              {/* LEGAL(handover): LINE URL — store.json lineUrl から取得 */}
              <a href={store.lineUrl ?? '#'} className="flex-1 max-w-[130px] py-3 border border-gold text-gold font-serif tracking-[2px] text-[11px] text-center no-underline">
                LINE
              </a>
              {/* LEGAL(handover): 電話番号 — store.json phone から取得 */}
              <a href={`tel:${store.phone}`} className="flex-1 max-w-[130px] py-3 border border-gold text-gold font-serif tracking-[2px] text-[11px] text-center no-underline">
                TEL
              </a>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  )
}
