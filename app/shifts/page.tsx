import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { BDivider } from '@/components/common/BDivider'
import therapistsData from '@/lib/data/therapists.json'
import shiftsData from '@/lib/data/shifts.json'
import type { Therapist, Shift } from '@/lib/types'

export const metadata: Metadata = {
  title: '本日の出勤',
  description: '[STORE_NAME]の本日・今週の出勤スケジュール。',
}

// TODO(handover): ダミーデータを Supabase クエリに置換
// テーブル: shifts / フィルタ: date BETWEEN today AND today+6, player_profiles.is_public=true
const therapists = therapistsData as Therapist[]
const shifts = shiftsData as Shift[]

const GRAD: Record<string, [string, string]> = {
  ren:   ['#C9A998', '#7A5E54'],
  sora:  ['#A8B5C9', '#4F5E7A'],
  yuki:  ['#E5D4D0', '#9B7A78'],
  aoi:   ['#B8C9A8', '#5E7A4F'],
  haru:  ['#E8C9C5', '#A77878'],
  shion: ['#C9B098', '#7A5E3E'],
}

// 直近7日（ダミーデータ期間に合わせてハードコード）
// TODO(handover): new Date() に変更し dynamic rendering にする
const BASE_DATE = new Date('2026-05-12')
const DISPLAY_DATES = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(BASE_DATE)
  d.setDate(d.getDate() + i)
  return d.toISOString().slice(0, 10)
})
const DOW_JP = ['日', '月', '火', '水', '木', '金', '土']

// HH:mm → 分（深夜26時対応）
function toMin(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

// タイムラインバーコンポーネント
function ShiftBar({ shift }: { shift: Shift }) {
  const start = toMin(shift.startTime)
  const end   = toMin(shift.endTime)
  const total = end - start
  if (total <= 0) return null

  return (
    <div className="mt-3">
      {/* 時刻ラベル */}
      <div className="flex justify-between mb-1">
        <span className="font-serif text-[10px] italic text-ink-sub">{shift.startTime}</span>
        <span className="font-serif text-[10px] italic text-ink-sub">{shift.endTime}</span>
      </div>

      {/* バー */}
      <div className="relative h-3 bg-cream border border-rule-gold overflow-hidden">
        {/* 空き時間（全体） */}
        <div className="absolute inset-0 bg-cream" />

        {/* 予約済みスロット */}
        {shift.bookedSlots.map((slot, i) => {
          const slotStart = toMin(slot.startTime)
          const slotEnd   = toMin(slot.endTime)
          const left  = ((slotStart - start) / total) * 100
          const width = ((slotEnd - slotStart) / total) * 100
          return (
            <div
              key={i}
              className="absolute inset-y-0"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                background: 'var(--color-ink-mute)',
              }}
            />
          )
        })}
      </div>

      {/* 凡例 */}
      {shift.bookedSlots.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
          {shift.bookedSlots.map((slot, i) => (
            <span key={i} className="font-serif text-[9px] italic text-ink-mute">
              {slot.startTime}〜{slot.endTime} 予約済み
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ShiftsPage() {
  return (
    <PageWrapper>
      <main>
        <div className="px-6 pt-10 pb-6 text-center">
          <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold italic">Schedule</span>
          <div className="font-jp text-[22px] mt-3 tracking-[4px]">出勤スケジュール</div>
          <div className="mt-4"><BDivider /></div>
        </div>

        {/* 日付タブ */}
        <div className="px-4 overflow-x-auto">
          <div className="flex gap-2 pb-1" style={{ width: 'max-content' }}>
            {DISPLAY_DATES.map((date, i) => {
              const d = new Date(date)
              const dow = DOW_JP[d.getDay()]
              const hasShift = shifts.some(s => s.date === date)
              return (
                <div
                  key={date}
                  className="flex-shrink-0 w-11 py-3 text-center border"
                  style={{
                    background: i === 0 ? 'var(--color-ink)' : 'transparent',
                    color: i === 0 ? '#fff' : 'var(--color-ink)',
                    borderColor: i === 0 ? 'var(--color-ink)' : 'var(--color-rule-gold)',
                    opacity: hasShift || i === 0 ? 1 : 0.5,
                  }}
                >
                  <div
                    className="font-serif text-[8px] tracking-[1.5px] italic"
                    style={{ color: i === 0 ? 'var(--color-gold)' : 'var(--color-ink-sub)' }}
                  >
                    {dow}
                  </div>
                  <div className="font-serif text-[20px] italic mt-1">{d.getDate()}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 本日の出勤 */}
        <div className="px-[22px] mt-6">
          <div className="text-center mb-4">
            <div className="font-serif text-[10px] tracking-[3px] text-gold italic">
              {DISPLAY_DATES[0].slice(5).replace('-', '/')} 出勤
            </div>
          </div>

          {(() => {
            const todayShifts = shifts.filter(s => s.date === DISPLAY_DATES[0])
            if (todayShifts.length === 0) {
              return (
                <div className="text-center py-10 font-serif text-[11px] text-ink-mute italic">
                  本日の出勤はありません
                </div>
              )
            }
            return todayShifts.map(s => {
              const t = therapists.find(th => th.id === s.therapistId)
              if (!t) return null
              const [from, to] = GRAD[t.id] ?? ['#C9A998', '#7A5E54']
              return (
                <div key={s.id} className="mb-4 border border-rule-gold bg-surface p-4">
                  <Link href={`/players/${t.id}`} className="block no-underline">
                    <div className="flex gap-3 items-center">
                      <div className="w-[56px] flex-shrink-0 p-[3px] border border-rule-gold">
                        <div className="relative overflow-hidden" style={{ height: 70 }}>
                          {t.mainPhotoUrl ? (
                            <Image
                              src={t.mainPhotoUrl}
                              alt={t.name}
                              fill
                              sizes="56px"
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
                      <div className="flex-1 min-w-0">
                        <div className="font-serif text-[10px] tracking-[2px] text-gold italic">{t.romanName}</div>
                        <div className="font-jp text-[16px] mt-0.5">{t.name}</div>
                        <div className="font-serif text-[12px] italic text-gold-dk mt-1">
                          {s.startTime} 〜 {s.endTime}
                        </div>
                      </div>
                      <div className="font-serif text-[14px] italic text-gold flex-shrink-0">→</div>
                    </div>
                  </Link>

                  {/* タイムラインバー */}
                  <ShiftBar shift={s} />
                </div>
              )
            })
          })()}
        </div>

        {/* 週間スケジュール */}
        <div className="px-[22px] pt-6 pb-4">
          <div className="text-center mb-5">
            <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold italic">Weekly</span>
            <div className="font-jp text-base mt-2">今週の出勤一覧</div>
          </div>

          {therapists.map(t => {
            const myShifts = shifts.filter(s => s.therapistId === t.id && DISPLAY_DATES.includes(s.date))
            if (myShifts.length === 0) return null
            return (
              <div key={t.id} className="mb-4 p-4 bg-surface border border-rule-gold">
                <Link href={`/players/${t.id}`} className="no-underline">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="font-serif text-[10px] tracking-[2px] text-gold italic">{t.romanName}</div>
                    <div className="font-jp text-[14px] text-ink">{t.name}</div>
                  </div>
                </Link>
                <div className="flex flex-col gap-4">
                  {myShifts
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map(s => {
                      const d = new Date(s.date)
                      return (
                        <div key={s.id}>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="font-jp text-ink-sub">
                              {s.date.slice(5).replace('-', '/')}（{DOW_JP[d.getDay()]}）
                            </span>
                            <span className="font-serif italic text-gold-dk">
                              {s.startTime}〜{s.endTime}
                            </span>
                          </div>
                          <ShiftBar shift={s} />
                        </div>
                      )
                    })}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </PageWrapper>
  )
}
