import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { BDivider } from '@/components/common/BDivider'
import rankingData from '@/lib/data/ranking.json'
import therapistsData from '@/lib/data/therapists.json'
import type { RankingEntry, Therapist } from '@/lib/types'

export const metadata: Metadata = {
  title: 'ランキング',
  description: '[STORE_NAME]月間人気セラピストランキング。',
}

// TODO(handover): ダミーデータを Supabase クエリに置換 / テーブル: ranking_monthly
const ranking = rankingData as RankingEntry[]
const therapists = therapistsData as Therapist[]

const GRAD: Record<string, [string, string]> = {
  ren:   ['#C9A998', '#7A5E54'],
  sora:  ['#A8B5C9', '#4F5E7A'],
  yuki:  ['#E5D4D0', '#9B7A78'],
  aoi:   ['#B8C9A8', '#5E7A4F'],
  haru:  ['#E8C9C5', '#A77878'],
  shion: ['#C9B098', '#7A5E3E'],
}

const RANK_LABEL = ['', 'No.1', 'No.2', 'No.3', 'No.4', 'No.5']

export default function RankingPage() {
  return (
    <PageWrapper>
      <main>
        <div className="px-6 pt-10 pb-6 text-center">
          <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold italic">Ranking</span>
          <div className="font-jp text-[22px] mt-3 tracking-[4px]">月間ランキング</div>
          <div className="mt-4"><BDivider /></div>
          <div className="font-serif text-[10px] tracking-[2px] text-ink-sub italic mt-3">2026年5月</div>
        </div>

        <div className="px-[22px] flex flex-col gap-5 pb-10">
          {ranking.map(entry => {
            const t = therapists.find(th => th.id === entry.therapistId)
            const [from, to] = GRAD[entry.therapistId] ?? ['#C9A998', '#7A5E54']
            return (
              <Link key={entry.rank} href={`/players/${entry.therapistId}`} className="block no-underline">
                <div className="bg-surface border border-rule-gold p-5">
                  <div className="flex gap-4 items-center">
                    {/* Rank badge */}
                    <div
                      className="w-10 h-10 flex items-center justify-center flex-shrink-0 border border-rule-gold"
                      style={{ background: entry.rank === 1 ? 'var(--color-gold)' : 'transparent' }}
                    >
                      <span
                        className="font-serif text-[18px] italic"
                        style={{ color: entry.rank === 1 ? '#fff' : 'var(--color-gold)' }}
                      >
                        {entry.rank}
                      </span>
                    </div>

                    {/* Photo */}
                    <div className="w-[72px] flex-shrink-0 p-[3px] border border-rule-gold">
                      <div className="relative overflow-hidden" style={{ height: 90 }}>
                        {t?.mainPhotoUrl ? (
                          <Image
                            src={t.mainPhotoUrl}
                            alt={entry.therapistName}
                            fill
                            sizes="72px"
                            className="object-cover"
                            style={{ objectPosition: t.photoPosition ?? '50% 30%' }}
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className="absolute inset-0"
                            style={{ background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)` }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="font-serif text-[9px] tracking-[2.5px] text-gold italic">
                        {RANK_LABEL[entry.rank]}
                      </div>
                      <div className="font-jp text-[18px] mt-0.5">{entry.therapistName}</div>
                      <div className="font-serif text-[10px] tracking-[2px] text-ink-sub italic mt-0.5">
                        {entry.romanName}
                      </div>
                      <div className="mt-2">
                        <div className="font-jp text-[10px] text-ink-sub">{entry.label}</div>
                        <div className="font-serif text-[16px] italic text-gold-dk mt-0.5">{entry.value}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </PageWrapper>
  )
}
