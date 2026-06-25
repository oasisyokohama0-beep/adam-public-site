import Link from 'next/link'
import Image from 'next/image'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { BDivider } from '@/components/common/BDivider'
import { EventSlider } from '@/components/common/EventSlider'
import { CastCard } from '@/components/players/CastCard'
import eventsData from '@/lib/data/events.json'
import newsData from '@/lib/data/news.json'
import rankingData from '@/lib/data/ranking.json'
import therapistsData from '@/lib/data/therapists.json'
import storeData from '@/lib/data/store.json'
import type { StoreEvent, RankingEntry, Therapist, StoreInfo, NewsItem } from '@/lib/types'

// TODO(handover): ダミーデータを Supabase クエリに置換
const events = eventsData as StoreEvent[]
const ranking = rankingData as RankingEntry[]
const therapists = therapistsData as Therapist[]
const news = newsData as NewsItem[]
// TODO(handover): Supabase クエリに置換 / テーブル: store_info
const store = storeData as StoreInfo

// Rank-by-id gradient fallback（写真が無いセラピスト用）
const GRAD: Record<string, [string, string]> = {
  ren:   ['#C9A998', '#7A5E54'],
  sora:  ['#A8B5C9', '#4F5E7A'],
  yuki:  ['#E5D4D0', '#9B7A78'],
  aoi:   ['#B8C9A8', '#5E7A4F'],
  haru:  ['#E8C9C5', '#A77878'],
  shion: ['#C9B098', '#7A5E3E'],
  rin:   ['#4A2325', '#B9957B'],
  rei:   ['#231F1B', '#9F826D'],
  shohei:['#2C2F34', '#B19A7E'],
  yuten: ['#281C20', '#8E2B30'],
}

// ランキング用キャッチコピー & 紹介文
// TODO(handover): player_profiles テーブル（または ranking_monthly に紐づく description カラム）
// から取得に置換。tagline は短いキャッチ、description は 2〜3 行の紹介文。
const RANK_COPY: Record<string, { tagline: string; description: string }> = {}

export default function TopPage() {
  const top5 = ranking.slice(0, 5)

  return (
    <PageWrapper>
      <main>
        {/* ── 店舗バナー（正方形ヒーロー） ── */}
        <section className="px-4 pb-8 pt-5 text-center">
          {/* LEGAL(handover): ヒーローロゴ — /images/logo.jpg（ブランドロゴ：リンゴ＋手＋ADAM TOKYO）。
              差し替える場合は同パスに正方形画像を配置。 */}
          <div
            className="relative aspect-square overflow-hidden border border-rule-gold shadow-[0_24px_80px_rgba(0,0,0,0.48)]"
            style={{ background: '#1A1614' }}
          >
            <Image
              src="/images/logo.jpg"
              alt={`${store.name} ロゴ`}
              fill
              priority
              sizes="(max-width: 430px) 100vw, 430px"
              className="object-cover"
            />
            <div className="absolute inset-2 border border-[rgba(199,188,163,0.5)] pointer-events-none" />
          </div>
          <div className="mx-auto mt-6 w-px h-8 bg-gold/45" />
          <p className="mt-5 font-serif text-[10px] uppercase tracking-[5px] text-gold">
            Private Men's Therapy
          </p>
          <h1 className="mt-3 font-jp text-[22px] leading-[1.75] tracking-[3px] text-ink">
            超性感特化型<br />プライベートサロン
          </h1>
          <p className="mx-auto mt-4 max-w-[310px] font-sans text-[12px] leading-[2] text-ink-sub">
            新宿発。静けさと余韻を大切にした、完全予約制の大人のリラクゼーション。
          </p>
        </section>

        {/* ── イベントバナー（EventSlider） ── */}
        <section className="mx-4 mt-2" aria-label="イベント・キャンペーン">
          {/* TOP は EventSlider 用に先頭3件のみ表示（一覧は /events） */}
          <EventSlider events={events.slice(0, 3)} />
          <div className="text-right pt-2">
            <Link
              href="/events"
              className="font-jp text-[11px] text-ink-sub no-underline hover:text-gold"
            >
              イベント一覧へ →
            </Link>
          </div>
        </section>

        {/* ── 在籍セラピスト ── */}
        <section aria-label="在籍セラピスト">
          <div className="px-6 pt-10 pb-5 text-center">
            <div className="font-serif text-[10px] uppercase tracking-[4px] text-gold">Therapists</div>
            <div className="mt-2 font-jp text-[20px] tracking-[2px]">在籍セラピスト</div>
            <div className="mt-3.5"><BDivider /></div>
          </div>
          <div className="px-[22px] grid grid-cols-2 gap-x-4 gap-y-7">
            {/* TODO(handover): テーブル: users(role='player') + player_profiles */}
            {therapists.slice(0, 4).map(t => (
              <CastCard key={t.id} therapist={t} />
            ))}
          </div>
          <div className="px-[22px] pt-[18px] text-center">
            <Link href="/players" className="font-jp text-[12px] text-gold no-underline">
              セラピスト一覧へ →
            </Link>
          </div>
        </section>

        {/* ── お知らせ ── */}
        <section className="px-[30px] pt-10 text-center" aria-label="お知らせ">
          <div className="font-serif text-[10px] uppercase tracking-[4px] text-gold">News</div>
          <div className="mt-2 font-jp text-[18px] tracking-[2px]">お知らせ</div>
          <div className="mt-[18px]">
            {/* TODO(handover): テーブル: news または store_events */}
            {news.map((n, i) => (
              <div
                key={n.id}
                className="py-4"
                style={{ borderBottom: i < news.length - 1 ? '1px solid rgba(42,38,34,0.10)' : 'none' }}
              >
                <div className="font-serif text-[11px] tracking-[2px] text-gold italic">{n.date} ・ {n.tag}</div>
                <div className="font-jp text-[12.5px] mt-1.5">{n.text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 月間ランキング TOP5 ── */}
        <section className="bg-surface mt-10 pt-12 pb-12" aria-label="月間ランキング">
          {/* Section header */}
          <div className="text-center px-6 pb-10">
            <div className="font-jp text-[22px] text-white tracking-[6px]">月間ランキング</div>
            <div className="font-serif text-[10px] tracking-[5px] text-gold uppercase mt-3">
              MONTHLY RANKING
            </div>
            <div className="w-10 h-px bg-gold mx-auto mt-3 opacity-70" />
          </div>

          {/* Entries — 写真左 / 情報右の2カラム */}
          <div className="px-[22px] flex flex-col gap-14">
            {/* TODO(handover): テーブル: ranking_monthly（current_month）+ player_profiles JOIN */}
            {top5.map(entry => {
              const t = therapists.find(th => th.id === entry.therapistId)
              const [from, to] = GRAD[entry.therapistId] ?? ['#C9A998', '#7A5E54']
              const copy = RANK_COPY[entry.therapistId]
              return (
                <Link
                  key={entry.rank}
                  href={`/players/${entry.therapistId}`}
                  className="block no-underline"
                >
                  <div className="flex gap-5 items-start">
                    {/* Photo — 二重フレーム */}
                    <div className="w-[46%] flex-shrink-0 relative">
                      {/* Ghost back frame — 少しズラしたゴールド線 */}
                      <div
                        className="absolute border border-gold/40 pointer-events-none"
                        style={{ top: 8, left: 8, right: -8, bottom: -8 }}
                      />
                      {/* 写真本体 */}
                      <div className="relative w-full aspect-[3/4] overflow-hidden border border-gold">
                        {t?.mainPhotoUrl ? (
                          <Image
                            src={t.mainPhotoUrl}
                            alt={entry.therapistName}
                            fill
                            sizes="(max-width: 430px) 46vw, 197px"
                            className="object-cover"
                            style={{ objectPosition: t.photoPosition ?? '50% 20%' }}
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className="absolute inset-0"
                            style={{
                              background: `
                                radial-gradient(circle at 50% 22%, rgba(242,233,216,0.25) 0 8%, transparent 9%),
                                radial-gradient(ellipse at 50% 58%, rgba(242,233,216,0.16) 0 20%, transparent 21%),
                                linear-gradient(160deg, ${from} 0%, ${to} 100%)
                              `,
                            }}
                          >
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.2)_56%,rgba(0,0,0,0.66)_100%)]" />
                            <div className="absolute inset-x-[18%] bottom-[17%] h-[38%] border border-gold/25 bg-bg/14 backdrop-blur-[1px]" />
                            <span className="absolute left-3 bottom-3 font-serif text-[10px] tracking-[3px] text-ink/70">
                              {entry.romanName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info — right */}
                    <div className="flex-1 text-left pl-1">
                      {/* ランク — No. + 大きな数字 */}
                      <div
                        className="font-serif flex items-baseline"
                        style={{
                          color: entry.rank === 1 ? '#EDE3CF' : '#A0967E',
                          lineHeight: 0.9,
                          fontStyle: 'italic',
                          fontWeight: 300,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 18,
                            letterSpacing: '0.02em',
                            marginRight: '0.1em',
                          }}
                        >
                          No.
                        </span>
                        <span
                          style={{
                            fontSize: 56,
                            letterSpacing: '-0.03em',
                          }}
                        >
                          {entry.rank}
                        </span>
                      </div>

                      {/* 名前を上下のゴールド線で挟む */}
                      <div className="w-12 h-px bg-gold opacity-60 mt-4" />
                      <div className="font-jp text-[24px] text-white mt-4 leading-tight">
                        {entry.therapistName}
                      </div>
                      <div className="font-serif text-[11px] tracking-[4px] text-gold italic mt-1.5">
                        {entry.romanName}
                      </div>
                      <div className="w-12 h-px bg-gold opacity-60 mt-4" />

                      {/* Tagline + 紹介文 */}
                      {copy && (
                        <div className="mt-4">
                          <div className="font-jp text-[14px] text-ink leading-relaxed">
                            {copy.tagline}
                          </div>
                          <div className="font-jp text-[11px] text-ink-mute leading-loose mt-2">
                            {copy.description}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="px-[22px] pt-10 text-center">
            <Link
              href="/ranking"
              className="font-jp text-[12px] text-gold no-underline border-b border-gold/40 pb-1"
            >
              ランキング一覧へ →
            </Link>
          </div>
        </section>

        {/* ── 予約ブロック ── */}
        <div className="px-[22px] pb-[30px] pt-4">
          <div className="border border-rule-gold bg-[linear-gradient(180deg,rgba(199,188,163,0.07),rgba(142,43,48,0.12))] px-6 py-8 text-center text-white">
            <div className="font-serif text-[10px] uppercase tracking-[4px] text-gold">Reservation</div>
            <div className="mt-2 font-jp text-[17px] leading-relaxed tracking-[1px]">ご予約・ご相談はこちら</div>
            <div className="w-[30px] h-px bg-gold mx-auto my-[18px]" />
            <div className="flex gap-2.5 justify-center">
              {/* LEGAL(handover): LINE URL — store.json lineUrl から取得 */}
              <a
                href={store.lineUrl ?? '#'}
                className="flex-1 max-w-[130px] border border-gold/45 bg-[rgba(199,188,163,0.08)] py-3 text-center font-jp text-[12px] tracking-[2px] text-white no-underline"
              >
                LINE で予約
              </a>
              {/* LEGAL(handover): 電話番号 — store.json phone から取得 */}
              <a
                href={`tel:${store.phone}`}
                className="flex-1 max-w-[130px] border border-wine bg-wine/85 py-3 text-center font-jp text-[12px] tracking-[2px] text-ink no-underline"
              >
                電話で予約
              </a>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  )
}
