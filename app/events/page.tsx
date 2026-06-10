import type { Metadata } from 'next'
import Link from 'next/link'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { BDivider } from '@/components/common/BDivider'
import eventsData from '@/lib/data/events.json'
import type { StoreEvent } from '@/lib/types'

export const metadata: Metadata = {
  title: 'イベント・キャンペーン',
  description: '[STORE_NAME]開催中・予定のイベント、キャンペーン一覧。',
}

// TODO(handover): ダミーデータを Supabase クエリに置換
// 参照実装: reservation-saas/lib/hp/queries.ts:getStoreEvents
// 取得条件: store_events WHERE is_active=true ORDER BY start_date DESC, sort_order ASC
// 統合時は空配列フォールバックを保持する
const rawEvents = eventsData as StoreEvent[]

// 並び順: start_date DESC、同日内は配列順（sort_order ASC 相当）を維持
const events = [...rawEvents].sort((a, b) => {
  const da = new Date(a.startDate).getTime()
  const db = new Date(b.startDate).getTime()
  return db - da
})

// EventSlider と同じグラデーション系統のカラーセット
const GRAD_SET: Array<[string, string]> = [
  ['#D8C9B3', '#8C6B43'],
  ['#E8D5C4', '#B8956A'],
  ['#C4A78A', '#5C4630'],
  ['#D2B48C', '#7A5A3A'],
]

function fmt(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

function periodText(evt: StoreEvent) {
  if (evt.endDate) return `${fmt(evt.startDate)} — ${fmt(evt.endDate)}`
  return `${fmt(evt.startDate)} 〜`
}

export default function EventsPage() {
  return (
    <PageWrapper>
      <main>
        {/* ── Header ── */}
        <div className="px-6 pt-10 pb-6 text-center">
          <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold italic">Events</span>
          <div className="font-jp text-[22px] mt-3 tracking-[4px]">イベント・キャンペーン</div>
          <div className="mt-4"><BDivider /></div>
        </div>

        {/* ── List ── */}
        {events.length === 0 ? (
          <div className="px-[22px] pt-6 pb-16 text-center">
            <p className="font-jp text-[13px] text-ink-sub leading-loose">
              現在開催中・予定のイベントはありません
            </p>
          </div>
        ) : (
          <div className="px-[22px] pb-10 flex flex-col gap-4">
            {events.map((evt, i) => {
              const [from, to] = GRAD_SET[i % GRAD_SET.length]
              return (
                <article
                  key={evt.id}
                  className="relative overflow-hidden border border-rule-gold"
                  style={{ minHeight: 150 }}
                >
                  <div
                    className="relative h-full"
                    style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
                  >
                    <div className="absolute inset-2 border border-white/40 pointer-events-none" />
                    <div className="relative px-[22px] py-[22px] flex flex-col gap-2 text-white">
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-[9px] tracking-[3px] italic opacity-90">{evt.tag}</span>
                        <span className="font-serif text-[9px] tracking-[2px] italic opacity-85">{periodText(evt)}</span>
                      </div>
                      <h2 className="font-jp text-[16px] leading-relaxed font-medium mt-1">{evt.title}</h2>
                      {evt.subtitle && (
                        <p className="font-serif text-[10px] tracking-[2px] italic opacity-90 mt-1">
                          {evt.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* ── Back to top ── */}
        <div className="px-[22px] pb-10 text-center">
          <Link href="/" className="font-serif text-[11px] tracking-[2px] text-gold italic no-underline">
            ← TOP に戻る
          </Link>
        </div>
      </main>
    </PageWrapper>
  )
}
