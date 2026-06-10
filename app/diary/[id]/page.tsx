import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { BDivider } from '@/components/common/BDivider'
import diaryData from '@/lib/data/diary.json'
import type { DiaryPost } from '@/lib/types'

// TODO(handover): ダミーデータを Supabase クエリに置換
// 参照実装: reservation-saas/lib/hp/queries.ts:getDiaryPosts
// 取得条件:
//   - diary_posts WHERE id=:id AND is_published=true
//   - diary_images WHERE diary_post_id=:id ORDER BY sort_order ASC
//   - players JOIN（therapistName / therapistId 解決）
const posts = (diaryData as DiaryPost[]).sort(
  (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
)

export async function generateStaticParams() {
  return posts.map(p => ({ id: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const p = posts.find(p => p.id === id)
  if (!p) return {}
  return { title: `${p.title} — ${p.therapistName}` }
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export default async function DiaryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const idx = posts.findIndex(p => p.id === id)
  if (idx === -1) notFound()

  const post = posts[idx]
  const prev = idx > 0 ? posts[idx - 1] : null
  const next = idx < posts.length - 1 ? posts[idx + 1] : null
  const images = [...post.images].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <PageWrapper>
      <main>
        {/* ── Header ── */}
        <div className="px-6 pt-10 pb-6 text-center">
          <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold italic">Diary</span>
          <div className="font-serif text-[10px] tracking-[2px] text-ink-sub italic mt-3">
            {formatDate(post.postedAt)}
          </div>
          <h1 className="font-jp text-[20px] mt-2 leading-snug">{post.title}</h1>
          <div className="mt-4">
            <Link
              href={`/players/${post.therapistId}`}
              className="font-serif text-[10px] tracking-[2px] text-gold italic no-underline border-b border-rule-gold pb-0.5"
            >
              {post.therapistName} の紹介ページ →
            </Link>
          </div>
          <div className="mt-5"><BDivider /></div>
        </div>

        {/* ── Image gallery ── */}
        {images.length > 0 && (
          <div className="px-[22px] pb-6">
            {images.length === 1 ? (
              <div className="relative w-full aspect-[3/4] bg-cream overflow-hidden border border-rule-gold">
                <Image
                  src={images[0].url}
                  alt=""
                  fill
                  sizes="(max-width: 430px) 100vw, 430px"
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div
                className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2"
                style={{ scrollbarWidth: 'thin' }}
                role="region"
                aria-label="画像ギャラリー"
              >
                {images.map((img, i) => (
                  <div
                    key={img.id}
                    className="relative flex-shrink-0 w-[78%] aspect-[3/4] bg-cream overflow-hidden border border-rule-gold snap-center"
                  >
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      sizes="(max-width: 430px) 80vw, 340px"
                      className="object-cover"
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>
            )}
            {images.length > 1 && (
              <p className="mt-2 font-serif text-[9px] tracking-[2px] italic text-ink-mute text-center">
                ← swipe / {images.length} photos →
              </p>
            )}
          </div>
        )}

        {/* ── Body ── */}
        <div className="px-[30px] pb-10">
          <div className="font-jp text-[14px] leading-[2.2] text-ink whitespace-pre-wrap">{post.content}</div>
        </div>

        {/* ── Prev / Next ── */}
        <div className="px-[22px] pb-6 flex items-stretch gap-2 text-center">
          {prev ? (
            <Link
              href={`/diary/${prev.id}`}
              className="flex-1 py-3 border border-rule-gold no-underline text-ink"
              aria-label={`前の投稿: ${prev.title}`}
            >
              <div className="font-serif text-[9px] tracking-[2px] text-gold italic">← NEWER</div>
              <div className="font-jp text-[11px] mt-1 line-clamp-1">{prev.title}</div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Link
              href={`/diary/${next.id}`}
              className="flex-1 py-3 border border-rule-gold no-underline text-ink"
              aria-label={`次の投稿: ${next.title}`}
            >
              <div className="font-serif text-[9px] tracking-[2px] text-gold italic">OLDER →</div>
              <div className="font-jp text-[11px] mt-1 line-clamp-1">{next.title}</div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>

        {/* ── Back ── */}
        <div className="px-[22px] pb-10 text-center">
          <Link href="/diary" className="font-serif text-[11px] tracking-[2px] text-gold italic no-underline">
            ← 日記一覧に戻る
          </Link>
        </div>
      </main>
    </PageWrapper>
  )
}
