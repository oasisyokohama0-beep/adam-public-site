import type { Metadata } from 'next'
import Link from 'next/link'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { BDivider } from '@/components/common/BDivider'
import reviewsData from '@/lib/data/reviews.json'
import type { Review } from '@/lib/types'

export const metadata: Metadata = {
  title: 'お客様の声',
  description: '[STORE_NAME]をご利用いただいたお客様の口コミ・レビュー。',
}

// TODO(handover): ダミーデータを Supabase クエリに置換 / テーブル: reviews
const reviews = (reviewsData as Review[]).sort(
  (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
)

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-[12px]" style={{ color: i < n ? 'var(--color-gold)' : 'var(--color-ink-mute)' }}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  return (
    <PageWrapper>
      <main>
        <div className="px-6 pt-10 pb-6 text-center">
          <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold italic">Voice</span>
          <div className="font-jp text-[22px] mt-3 tracking-[4px]">お客様の声</div>
          <div className="mt-4"><BDivider /></div>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="font-serif text-[32px] italic text-gold">{avg.toFixed(1)}</div>
            <div>
              <Stars n={Math.round(avg)} />
              <div className="font-serif text-[10px] tracking-[1.5px] text-ink-sub italic mt-1">
                {reviews.length} reviews
              </div>
            </div>
          </div>
        </div>

        {/* CTA: 口コミを投稿する */}
        <div className="px-[22px] pt-2 pb-6 text-center">
          <Link
            href="/reviews/new"
            className="inline-block px-8 py-3 bg-ink text-white font-serif tracking-[2.5px] text-[11px] no-underline"
          >
            POST A REVIEW
          </Link>
          <p className="mt-2.5 font-jp text-[11px] text-ink-sub leading-loose">
            ご利用いただいたお客様の口コミをお寄せください
          </p>
        </div>

        <div className="px-[22px] flex flex-col gap-3.5 pb-10">
          {reviews.map(r => (
            <div key={r.id} className="bg-surface border border-rule-gold p-[18px]">
              <div className="flex items-center justify-between">
                <div className="font-serif text-[18px] italic text-gold leading-none">&ldquo;</div>
                <div className="flex items-center gap-2">
                  {r.therapistName && (
                    <div className="font-serif text-[9px] tracking-[2px] text-gold italic">{r.therapistName}</div>
                  )}
                  <Stars n={r.rating} />
                </div>
              </div>
              <div className="font-jp text-[12.5px] leading-loose mt-2">{r.content}</div>
              <div className="font-serif text-[10px] tracking-[1.5px] italic text-ink-sub mt-3">
                — {r.authorName}
              </div>
            </div>
          ))}
        </div>
      </main>
    </PageWrapper>
  )
}
