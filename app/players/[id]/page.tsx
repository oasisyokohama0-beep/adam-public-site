import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { BDivider } from '@/components/common/BDivider'
import therapistsData from '@/lib/data/therapists.json'
import shiftsData from '@/lib/data/shifts.json'
import reviewsData from '@/lib/data/reviews.json'
import diaryData from '@/lib/data/diary.json'
import type { Therapist, Shift, Review, DiaryPost } from '@/lib/types'

// TODO(handover): ダミーデータを Supabase クエリに置換
// テーブル: users + player_profiles / フィルタ: id = params.id
const therapists = therapistsData as Therapist[]
const shifts = shiftsData as Shift[]
const reviews = reviewsData as Review[]
// TODO(handover): diary_posts + diary_images（先頭画像）/ player_id = params.id
const diaryPosts = diaryData as DiaryPost[]

// セラピスト別 SNS リンク
// LEGAL(handover): 各 URL は実値に差し替え。
// 統合時は player_profiles に sns_line / sns_instagram / sns_x / sns_twitcast カラムを追加するか、
// player_sns 子テーブルを設けるかは判断。href = '#' の場合は非表示で OK。
const PLAYER_SNS: Record<string, { line?: string; instagram?: string; x?: string; twitcast?: string }> = {}

const WEEK_DAYS = ['月', '火', '水', '木', '金', '土', '日']
const WEEK_EN   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const GRAD: Record<string, [string, string]> = {
  ren:   ['#C9A998', '#7A5E54'],
  sora:  ['#A8B5C9', '#4F5E7A'],
  yuki:  ['#E5D4D0', '#9B7A78'],
  aoi:   ['#B8C9A8', '#5E7A4F'],
  haru:  ['#E8C9C5', '#A77878'],
  shion: ['#C9B098', '#7A5E3E'],
}

// SNS アイコン — 簡素なジオメトリで各プラットフォームを表現
function IconLine() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11c0 4.5-4 8-9 8-1 0-2-.1-2.9-.4-1.5 1-3.5 1.7-5.6 1.9.8-.9 1.4-1.9 1.7-3.1C2.9 16.4 2 14.1 2 11.5 2 7 6 3.5 11 3.5s10 3 10 7.5z" />
    </svg>
  )
}
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="4.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}
function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  )
}
function IconTwitcast() {
  // 放送波をイメージしたラジオ波アイコン
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
      <path d="M8.6 8.6a4.8 4.8 0 000 6.8M15.4 8.6a4.8 4.8 0 010 6.8" />
      <path d="M5.5 5.5a9 9 0 000 13M18.5 5.5a9 9 0 010 13" />
    </svg>
  )
}

function formatYMD(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export async function generateStaticParams() {
  return therapists.map(t => ({ id: t.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const t = therapists.find(t => t.id === id)
  if (!t) return {}
  return { title: `${t.name}（${t.romanName}）` }
}

export default async function PlayerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // TODO(handover): Supabase クエリに置換
  const t = therapists.find(t => t.id === id)
  if (!t) notFound()

  // 直近シフト (今日以降、最大7日)
  const today = new Date().toISOString().slice(0, 10)
  const myShifts = shifts
    .filter(s => s.therapistId === t.id && s.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 7)

  // セラピストの口コミ（最大3件）
  const allMyReviews = reviews.filter(r => r.therapistId === t.id)
  const myReviews = allMyReviews.slice(0, 3)

  // セラピストの写メ日記（最大3件、postedAt 降順）
  const myDiary = diaryPosts
    .filter(p => p.therapistId === t.id)
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
    .slice(0, 3)

  // SNS リンク
  // imageSrc が指定されているサービスは画像で描画、それ以外は SVG で描画
  type SnsItem = {
    key: string
    href: string
    label: string
    Icon?: () => React.JSX.Element
    imageSrc?: string
  }
  const sns = PLAYER_SNS[t.id] ?? {}
  const snsItemsRaw: Array<SnsItem | null> = [
    sns.line      ? { key: 'line',      href: sns.line,      label: 'LINE',       Icon: IconLine }                                            : null,
    // LEGAL(handover): /public/images/icons/sns-instagram.png に画像配置（権利確認後に差し替え可）
    sns.instagram ? { key: 'instagram', href: sns.instagram, label: 'Instagram',  imageSrc: '/images/icons/sns-instagram.png' }               : null,
    sns.x         ? { key: 'x',         href: sns.x,         label: 'X',          Icon: IconX }                                               : null,
    sns.twitcast  ? { key: 'twitcast',  href: sns.twitcast,  label: 'ツイキャス', Icon: IconTwitcast }                                        : null,
  ]
  const snsItems: SnsItem[] = snsItemsRaw.filter((v): v is SnsItem => v !== null)

  const [from, to] = GRAD[t.id] ?? ['#C9A998', '#7A5E54']

  return (
    <PageWrapper>
      <main>
        {/* カバー写真 */}
        <div className="mx-[22px] mt-6">
          <div className="p-1.5 border border-rule-gold">
            <div className="relative overflow-hidden" style={{ height: 380 }}>
              {t.mainPhotoUrl ? (
                <Image
                  src={t.mainPhotoUrl}
                  alt={t.name}
                  fill
                  sizes="(max-width: 430px) 100vw, 430px"
                  className="object-cover"
                  style={{ objectPosition: t.photoPosition ?? '50% 30%' }}
                  priority
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)` }}
                />
              )}
            </div>
          </div>
        </div>

        {/* 名前ブロック */}
        <div className="px-6 pt-7 pb-2 text-center">
          <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold italic">Therapist</span>
          <div className="font-serif text-[30px] italic text-gold mt-2 tracking-[4px]">{t.romanName}</div>
          <div className="font-jp text-[28px] mt-1.5 tracking-[8px]">{t.name}</div>
          <div className="mt-4"><BDivider /></div>
          <div className="text-[11px] text-ink-sub mt-3.5 tracking-[1.5px]">
            {t.age} 歳  ／  {t.height} cm
          </div>
        </div>

        {/* 自己紹介 */}
        <div className="px-[30px] py-6 text-center">
          <div className="font-jp text-[14px] leading-[2.2] text-ink">{t.introduction}</div>
          <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
            {t.tags.map(tag => (
              <span
                key={tag}
                className="font-jp text-[10.5px] px-3 py-[5px] border border-rule-gold text-gold-dk tracking-[1px]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* SNS リンク — クリーム × ゴールドの高級プレートスタイル */}
        {/* LEGAL(handover): 各 SNS アイコンの SVG は汎用形状で代用。
            本番運用時は LINE / Instagram / X / TwitCasting それぞれの公式ブランドガイドラインに
            準拠したアセットへ差し替えること。 */}
        {snsItems.length > 0 && (
          <div className="px-6 pb-2 text-center">
            <div className="flex items-center justify-center gap-4">
              {snsItems.map(({ key, href, label, Icon, imageSrc }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-14 h-14 rounded-full flex items-center justify-center text-gold-dk transition-transform hover:-translate-y-0.5 overflow-hidden"
                  style={{
                    background: 'linear-gradient(155deg, #FDFBF6 0%, #F0EADD 100%)',
                    border: '1.5px solid #C9A87E',
                    boxShadow:
                      '0 6px 12px -4px rgba(140,107,67,0.20), 0 1px 2px rgba(140,107,67,0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
                  }}
                >
                  {imageSrc ? (
                    <span className="relative w-[34px] h-[34px] inline-flex">
                      <Image
                        src={imageSrc}
                        alt={label}
                        fill
                        sizes="34px"
                        className="object-contain"
                      />
                    </span>
                  ) : Icon ? (
                    <span className="w-[22px] h-[22px] inline-flex">
                      <Icon />
                    </span>
                  ) : null}
                </a>
              ))}
            </div>
            <div className="font-serif text-[9px] tracking-[3px] text-gold italic mt-3.5">— SNS —</div>
          </div>
        )}

        {/* 出勤スケジュール */}
        <div className="bg-cream px-[22px] py-8 mt-4">
          <div className="text-center">
            <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold-dk italic">Schedule</span>
            <div className="font-jp text-[15px] mt-2">直近の出勤</div>
          </div>
          <div className="mt-5 flex flex-col gap-2">
            {myShifts.length === 0 ? (
              <div className="text-center font-serif text-[11px] text-ink-mute italic py-4">
                現在出勤予定はありません
              </div>
            ) : (
              myShifts.map(s => {
                const d = new Date(s.date)
                const dow = d.getDay()
                const dayIndex = dow === 0 ? 6 : dow - 1
                return (
                  <div
                    key={s.id}
                    className="flex items-center px-3.5 py-3 bg-surface border border-rule-gold"
                  >
                    <div className="w-9 font-jp text-[13px]">{WEEK_DAYS[dayIndex]}</div>
                    <div className="w-9 font-serif text-[11px] italic text-ink-sub">{WEEK_EN[dayIndex]}</div>
                    <div className="font-jp text-[12px] text-ink-sub">{s.date.slice(5).replace('-', '/')}</div>
                    <div className="flex-1 text-right font-serif text-[16px] italic text-gold-dk">
                      {s.startTime}〜{s.endTime}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* 口コミ */}
        {/* TODO(handover): rating カテゴリ別評価は現在 r.rating を全カテゴリ共通で表示。
            本実装では reviews テーブルに rating_impression / rating_service / rating_manner / rating_overall
            などのカラムを設けるか、別途 review_ratings 子テーブルから取得すること。 */}
        {myReviews.length > 0 && (
          <div className="px-[22px] pt-10 pb-4">
            <div className="text-center">
              <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold italic">Voice</span>
              <div className="font-jp text-[15px] mt-2">口コミ</div>
              <div className="mt-3"><BDivider /></div>
            </div>

            <div className="mt-6 flex flex-col gap-5">
              {myReviews.map(r => (
                <article key={r.id} className="bg-surface border border-rule-gold p-4">
                  {/* 上段：セラピスト写真 + 情報 */}
                  <div className="flex gap-3.5">
                    {/* 写真 */}
                    <div className="w-[36%] flex-shrink-0">
                      <div className="relative w-full aspect-[3/4] bg-cream overflow-hidden border border-rule-gold">
                        {t.mainPhotoUrl ? (
                          <Image
                            src={t.mainPhotoUrl}
                            alt={t.name}
                            fill
                            sizes="(max-width: 430px) 36vw, 140px"
                            className="object-cover"
                            style={{ objectPosition: t.photoPosition ?? '50% 25%' }}
                          />
                        ) : (
                          <div
                            className="absolute inset-0"
                            style={{ background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)` }}
                          />
                        )}
                      </div>
                    </div>

                    {/* 情報 */}
                    <div className="flex-1 flex flex-col">
                      <div className="font-jp text-[18px] leading-snug">{t.name}</div>
                      <div className="font-serif text-[11px] tracking-[2px] text-gold italic mt-0.5">
                        {t.romanName}{t.age ? ` (Age:${t.age})` : ''}
                      </div>

                      {/* 投稿者 / 投稿日 ミニテーブル */}
                      <div className="mt-3 border border-rule-gold">
                        <div className="grid grid-cols-[auto_1fr] text-[10.5px]">
                          <div className="bg-cream px-2.5 py-1.5 font-jp text-ink-sub border-r border-b border-rule-gold">
                            投稿者
                          </div>
                          <div className="bg-surface px-2.5 py-1.5 font-jp text-white text-center border-b border-rule-gold">
                            {r.authorName}
                          </div>
                          <div className="bg-cream px-2.5 py-1.5 font-jp text-ink-sub border-r border-rule-gold">
                            投稿日
                          </div>
                          <div className="px-2.5 py-1.5 font-serif italic text-gold-dk text-center">
                            {formatYMD(r.postedAt)}
                          </div>
                        </div>
                      </div>

                      {/* 4 カテゴリ評価 */}
                      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 font-jp text-[10.5px]">
                        {[
                          { label: '印象', value: r.rating },
                          { label: '接客', value: r.rating },
                          { label: '所作', value: r.rating },
                          { label: '総合', value: r.rating },
                        ].map(cat => (
                          <div key={cat.label} className="flex items-center gap-1.5">
                            <span className="text-ink-sub">{cat.label}：</span>
                            <span className="text-gold">★</span>
                            <span className="text-ink">{cat.value}/5</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 本文 */}
                  <div className="font-jp text-[12.5px] leading-loose text-ink mt-4 whitespace-pre-wrap">
                    {r.content}
                  </div>
                </article>
              ))}
            </div>

            {/* もっと見る CTA — 一覧へのリンク */}
            <div className="mt-5 flex justify-center">
              <Link
                href="/reviews"
                className="inline-flex items-center gap-2 bg-gold text-bg font-jp text-[12px] tracking-[2px] px-7 py-3 rounded-full no-underline"
              >
                {t.name} の口コミ ({allMyReviews.length}件)
                <span className="font-serif italic text-gold">→</span>
              </Link>
            </div>
          </div>
        )}

        {/* 写メ日記 */}
        {myDiary.length > 0 && (
          <div className="px-[22px] pt-8 pb-6">
            <div className="text-center">
              <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold italic">Diary</span>
              <div className="font-jp text-[15px] mt-2">写メ日記</div>
              <div className="mt-3"><BDivider /></div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {myDiary.map(p => {
                const thumb = [...p.images].sort((a, b) => a.sortOrder - b.sortOrder)[0]
                return (
                  <Link key={p.id} href={`/diary/${p.id}`} className="block no-underline">
                    <div className="relative w-full aspect-[3/4] bg-cream overflow-hidden border border-rule-gold">
                      {thumb ? (
                        <Image
                          src={thumb.url}
                          alt=""
                          fill
                          sizes="(max-width: 430px) 50vw, 200px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-serif text-[10px] tracking-[2px] italic text-ink-mute">no image</span>
                        </div>
                      )}
                    </div>
                    <div className="pt-2">
                      <div className="font-serif text-[9px] tracking-[2px] text-gold italic">
                        {formatYMD(p.postedAt)}
                      </div>
                      <div className="font-jp text-[12px] mt-1 leading-snug line-clamp-2">{p.title}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="pt-4 text-center">
              <Link href="/diary" className="font-jp text-[12px] text-gold no-underline">
                日記一覧へ →
              </Link>
            </div>
          </div>
        )}

        {/* 指名ボタン */}
        <div
          className="sticky bottom-0 px-[22px] pt-3.5 pb-[22px]"
          style={{ background: 'linear-gradient(180deg, transparent 0%, var(--color-bg) 30%)' }}
        >
          <div className="bg-surface text-white px-6 py-[18px] flex items-center justify-between">
            <div>
              <div className="font-serif text-[9px] tracking-[3px] text-gold italic">BOOK</div>
              <div className="font-jp text-[14px] mt-0.5">{t.name} を指名する</div>
            </div>
            <span className="font-serif text-[22px] italic text-gold">→</span>
          </div>
        </div>
      </main>
    </PageWrapper>
  )
}
