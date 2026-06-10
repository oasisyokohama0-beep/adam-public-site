import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { BDivider } from '@/components/common/BDivider'
import diaryData from '@/lib/data/diary.json'
import type { DiaryPost } from '@/lib/types'

export const metadata: Metadata = {
  title: '写メ日記',
  description: '[STORE_NAME]セラピストの写メ日記・ブログ。',
}

// TODO(handover): ダミーデータを Supabase クエリに置換
// 参照実装: reservation-saas/lib/hp/queries.ts:getDiaryPosts
// 取得条件: diary_posts WHERE is_published=true ORDER BY posted_at DESC
//          + diary_images（先頭1枚を JOIN、sort_order ASC LIMIT 1）
const posts = (diaryData as DiaryPost[]).sort(
  (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
)

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

function excerpt(text: string, max = 100): string {
  const flat = text.replace(/\s+/g, ' ').trim()
  if (flat.length <= max) return flat
  return flat.slice(0, max) + '…'
}

function thumbUrl(post: DiaryPost): string | null {
  if (post.images.length === 0) return null
  const sorted = [...post.images].sort((a, b) => a.sortOrder - b.sortOrder)
  return sorted[0]?.url ?? null
}

export default function DiaryPage() {
  return (
    <PageWrapper>
      <main>
        <div className="px-6 pt-10 pb-6 text-center">
          <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold italic">Diary</span>
          <div className="font-jp text-[22px] mt-3 tracking-[4px]">写メ日記</div>
          <div className="mt-4"><BDivider /></div>
        </div>

        {posts.length === 0 ? (
          <div className="px-[22px] pt-6 pb-16 text-center">
            <p className="font-jp text-[13px] text-ink-sub leading-loose">現在投稿はありません</p>
          </div>
        ) : (
          <div className="px-[22px] pb-10 grid grid-cols-2 gap-3">
            {posts.map(p => {
              const url = thumbUrl(p)
              return (
                <Link
                  key={p.id}
                  href={`/diary/${p.id}`}
                  className="block no-underline group"
                  aria-label={`${p.title} — ${p.therapistName}`}
                >
                  <article className="flex flex-col">
                    {/* Thumbnail */}
                    <div className="relative w-full aspect-[3/4] bg-cream overflow-hidden border border-rule-gold">
                      {url ? (
                        <Image
                          src={url}
                          alt=""
                          fill
                          sizes="(max-width: 430px) 50vw, 215px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-serif text-[10px] tracking-[2px] italic text-ink-mute">no image</span>
                        </div>
                      )}
                    </div>

                    {/* Meta + text */}
                    <div className="pt-2.5">
                      <div className="font-serif text-[9px] tracking-[2px] text-gold italic">
                        {formatDate(p.postedAt)} ・ {p.therapistName}
                      </div>
                      <h2 className="font-jp text-[13px] mt-1 leading-snug line-clamp-2">{p.title}</h2>
                      <p className="font-jp text-[11px] text-ink-sub mt-1.5 leading-relaxed line-clamp-2">
                        {excerpt(p.content, 80)}
                      </p>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </PageWrapper>
  )
}
