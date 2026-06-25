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

const VOICE_POINTS = [
  '初めてでも相談しやすい空気',
  '予約前後のやり取りが丁寧',
  '落ち着いた時間を過ごせる接客',
]

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="text-[12px]"
          style={{ color: i < n ? 'var(--color-gold)' : 'var(--color-ink-mute)' }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date))
}

function ReviewCard({ review, featured = false }: { review: Review; featured?: boolean }) {
  return (
    <article
      className={[
        'border border-rule-gold bg-surface text-ink shadow-[0_18px_50px_rgba(0,0,0,0.22)]',
        featured ? 'p-6' : 'p-5',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-serif text-[10px] uppercase tracking-[3px] text-gold">Review</div>
          <div className="mt-2 font-jp text-[13px] leading-relaxed text-ink-sub">
            {review.therapistName ? `${review.therapistName}への口コミ` : '店舗への口コミ'}
          </div>
        </div>
        <Stars n={review.rating} />
      </div>

      <p
        className={[
          'mt-4 font-jp leading-loose text-ink',
          featured ? 'text-[14px]' : 'text-[13px]',
        ].join(' ')}
      >
        {review.content}
      </p>

      <div className="mt-5 flex items-end justify-between gap-4 border-t border-rule-gold/60 pt-4">
        <div>
          <div className="font-jp text-[12px] text-ink">{review.authorName}</div>
          <div className="mt-1 font-serif text-[10px] tracking-[1.5px] text-ink-sub">
            {formatDate(review.postedAt)}
          </div>
        </div>
        <div className="font-serif text-[26px] leading-none text-gold">”</div>
      </div>
    </article>
  )
}

export default function ReviewsPage() {
  const reviewCount = reviews.length
  const avg = reviewCount ? reviews.reduce((s, r) => s + r.rating, 0) / reviewCount : 0
  const featured = reviews[0]
  const otherReviews = reviews.slice(1)
  const therapistCount = new Set(reviews.map(r => r.therapistId).filter(Boolean)).size

  return (
    <PageWrapper>
      <main>
        <section className="px-6 pt-10 pb-7 text-center">
          <span className="font-serif text-[11px] uppercase tracking-[4px] text-gold">Voice</span>
          <h1 className="font-jp text-[22px] mt-3 tracking-[4px] text-ink">お客様の声</h1>
          <div className="mt-4"><BDivider /></div>
          <p className="mx-auto mt-5 max-w-[330px] font-jp text-[12.5px] leading-loose text-ink-sub">
            ご来店前の不安が少しでもやわらぐように、雰囲気・接客・過ごし方が伝わる口コミをまとめています。
          </p>
        </section>

        <section className="mx-[22px] border border-rule-gold bg-[linear-gradient(180deg,rgba(199,188,163,0.08),rgba(142,43,48,0.14))] px-5 py-6 text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="font-serif text-[34px] text-gold">{avg.toFixed(1)}</div>
            <div className="text-left">
              <Stars n={Math.round(avg)} />
              <div className="font-serif text-[10px] tracking-[1.5px] text-ink-sub mt-1">
                {reviewCount} reviews
              </div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 border-y border-rule-gold/60 py-4">
            <div>
              <div className="font-serif text-[20px] text-gold">{reviewCount}</div>
              <div className="mt-1 font-jp text-[10px] text-ink-sub">掲載数</div>
            </div>
            <div className="border-x border-rule-gold/50">
              <div className="font-serif text-[20px] text-gold">{therapistCount}</div>
              <div className="mt-1 font-jp text-[10px] text-ink-sub">担当者</div>
            </div>
            <div>
              <div className="font-serif text-[20px] text-gold">5.0</div>
              <div className="mt-1 font-jp text-[10px] text-ink-sub">最高評価</div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {VOICE_POINTS.map(point => (
              <span
                key={point}
                className="border border-rule-gold/60 bg-bg/40 px-3 py-1.5 font-jp text-[10.5px] text-ink-sub"
              >
                {point}
              </span>
            ))}
          </div>
        </section>

        <section className="px-[22px] pt-6 pb-8 text-center">
          <Link
            href="/reviews/new"
            className="inline-block border border-wine bg-wine px-8 py-3 font-jp text-[12px] tracking-[2px] text-ink no-underline"
          >
            口コミを投稿する
          </Link>
          <p className="mt-3 font-jp text-[11px] leading-loose text-ink-sub">
            掲載前に内容を確認し、個人が特定される情報は伏せて公開します。
          </p>
        </section>

        {featured ? (
          <section className="px-[22px] pb-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-jp text-[15px] tracking-[2px] text-ink">注目の口コミ</h2>
              <span className="font-serif text-[10px] uppercase tracking-[3px] text-gold">Featured</span>
            </div>
            <ReviewCard review={featured} featured />
          </section>
        ) : (
          <section className="px-[22px] pb-8">
            <div className="border border-rule-gold bg-surface p-6 text-center">
              <div className="font-jp text-[15px] text-ink">口コミを準備中です</div>
              <p className="mt-3 font-jp text-[12px] leading-loose text-ink-sub">
                ご利用後の感想を投稿いただくと、確認後こちらに掲載されます。
              </p>
            </div>
          </section>
        )}

        <section className="px-[22px] flex flex-col gap-4 pb-10">
          {otherReviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </section>
      </main>
    </PageWrapper>
  )
}
