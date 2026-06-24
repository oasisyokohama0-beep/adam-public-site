import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { BDivider } from '@/components/common/BDivider'
import therapistsData from '@/lib/data/therapists.json'
import type { Therapist } from '@/lib/types'

export const metadata: Metadata = {
  title: '在籍セラピスト',
  description: 'ADAM TOKYOの在籍セラピスト一覧。初めての方にも安心のセラピストが揃っています。',
}

// TODO(handover): ダミーデータを Supabase クエリに置換
// テーブル: users(role='player') + player_profiles / フィルタ: is_active=true, is_public=true
const therapists = therapistsData as Therapist[]

const GRAD: Record<string, [string, string]> = {
  ren:   ['#C9A998', '#7A5E54'],
  sora:  ['#A8B5C9', '#4F5E7A'],
  yuki:  ['#E5D4D0', '#9B7A78'],
  aoi:   ['#B8C9A8', '#5E7A4F'],
  haru:  ['#E8C9C5', '#A77878'],
  shion: ['#C9B098', '#7A5E3E'],
}

export default function PlayersPage() {
  return (
    <PageWrapper>
      <main>
        {/* Page header */}
        <div className="px-6 pt-9 pb-6 text-center">
          <div className="font-jp text-[22px] tracking-[4px]">在籍セラピスト</div>
          <div className="mt-4"><BDivider /></div>
        </div>

        {/* Filter tabs */}
        <div className="px-6 pb-3.5 flex justify-center gap-[18px]">
          {['ALL', 'TODAY', 'NEW'].map((f, i) => (
            <div
              key={f}
              className="font-serif text-[11px] tracking-[2.5px] italic pb-1 cursor-pointer"
              style={{
                color: i === 0 ? 'var(--color-ink)' : 'var(--color-ink-mute)',
                borderBottom: i === 0 ? '1px solid var(--color-gold)' : 'none',
              }}
            >
              {f}
            </div>
          ))}
        </div>

        {/* Editorial list */}
        <div className="px-[22px]">
          {therapists.map((t, i) => {
            const [from, to] = GRAD[t.id] ?? ['#C9A998', '#7A5E54']
            return (
              <Link key={t.id} href={`/players/${t.id}`} className="block no-underline">
                <div
                  className="py-6 flex gap-4 items-start"
                  style={{ borderTop: '1px solid rgba(42,38,34,0.10)' }}
                >
                  {/* Thumbnail */}
                  <div className="w-[100px] flex-shrink-0 p-[3px] border border-rule-gold">
                    <div className="relative overflow-hidden" style={{ height: 130 }}>
                      {t.mainPhotoUrl ? (
                        <Image
                          src={t.mainPhotoUrl}
                          alt={t.name}
                          fill
                          sizes="100px"
                          className="object-cover"
                          style={{ objectPosition: t.photoPosition ?? '50% 30%' }}
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{ background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)` }}
                        >
                          <span className="absolute left-2 bottom-1.5 font-mono text-[9px] tracking-[1.2px] text-white/65">
                            {t.romanName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex justify-between items-baseline">
                      <div className="font-serif text-[10px] tracking-[2.5px] text-gold italic">
                        No.{String(i + 1).padStart(2, '0')}
                      </div>
                      {t.isNew && (
                        <div className="font-serif text-[9px] tracking-[2.5px] text-gold italic">NEW</div>
                      )}
                    </div>
                    <div className="font-jp text-[20px] mt-1">{t.name}</div>
                    <div className="font-serif text-[11px] tracking-[2px] text-ink-sub italic mt-0.5">{t.romanName}</div>
                    <div className="text-[10.5px] text-ink-sub mt-1.5">{t.age}歳 ／ {t.height}cm</div>
                    <div className="font-jp text-[11.5px] leading-relaxed mt-2 text-ink">
                      {t.introduction && t.introduction.length > 38
                        ? t.introduction.slice(0, 38) + '…'
                        : t.introduction}
                    </div>
                    <div className="mt-2.5 font-serif text-[10px] tracking-[2px] text-gold italic">
                      view profile →
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
