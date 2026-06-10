import type { Metadata } from 'next'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { BDivider } from '@/components/common/BDivider'
import coursesData from '@/lib/data/courses.json'
import type { Course } from '@/lib/types'

export const metadata: Metadata = {
  title: '料金・システム',
  description: '料金表・コース一覧・オプション。',
}

// TODO(handover): ダミーデータを Supabase クエリに置換
// 元データ: lib/data/courses.json / テーブル: courses
const courses = coursesData as Course[]

export default function SystemPage() {
  return (
    <PageWrapper>
      <main>
        {/* Header */}
        <div className="px-6 pt-10 pb-6 text-center">
          <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold italic">Price List</span>
          <div className="font-jp text-[24px] mt-3 tracking-[6px]">料金表</div>
          <div className="mt-4"><BDivider /></div>
          {/* LEGAL(handover): 税表示・特商法に関する注記
              担当：イグチ（特定商取引法の表示要否を確認の上テキスト差し込み） */}
          <div className="font-jp text-[11px] text-ink-sub mt-4 leading-loose">
            表示価格はすべて税込です
          </div>
        </div>

        {/* Courses */}
        <div className="px-6">
          {courses.map((c, i) => (
            <div
              key={c.id}
              className="py-6 text-center"
              style={{
                borderTop: `1px solid ${i === 0 ? 'var(--color-rule-gold)' : 'var(--color-rule)'}`,
                borderBottom: i === courses.length - 1 ? '1px solid var(--color-rule-gold)' : 'none',
              }}
            >
              <div className="font-serif text-[11px] tracking-[3px] text-gold italic">{c.name}</div>
              <div className="flex items-baseline justify-center gap-3.5 mt-3.5">
                <span className="font-serif text-[36px] italic text-ink">{c.durationMin}</span>
                <span className="font-serif text-[10px] tracking-[2.5px] text-ink-sub italic">MIN</span>
                <span className="w-px h-[30px] bg-rule-gold self-center" />
                <span className="font-serif text-[24px] text-ink">¥{c.price.toLocaleString()}</span>
              </div>
              <div className="font-jp text-[11px] text-ink-sub mt-3">{c.description}</div>
              {c.isFirstOnly && (
                <div className="mt-3.5 mx-auto max-w-[240px] p-2.5 bg-cream border border-rule-gold">
                  <div className="font-serif text-[9px] tracking-[3px] text-gold-dk italic">FOR YOUR FIRST VISIT</div>
                  <div className="font-jp text-[11px] mt-1">初回ご来店の方限定割引</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Options */}
        <div className="px-[30px] pt-10">
          <div className="text-center">
            <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold italic">Options</span>
          </div>
          {/* LEGAL(handover): オプション料金表
              担当：イグチ（実際のオプション・金額を差し込み） */}
          <div className="mt-4 font-jp text-[12.5px] leading-[2] text-ink-sub bg-cream border border-rule-gold p-5 text-center">
            <div className="font-serif text-[10px] tracking-[2px] text-gold italic mb-2">LEGAL(handover)</div>
            ここにオプション料金を差し込みます
          </div>
        </div>

        {/* System / Cancellation notes */}
        <div className="px-[30px] pt-10 pb-8">
          <div className="text-center">
            <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold italic">System</span>
            <div className="font-jp text-base mt-2">ご利用について</div>
          </div>
          {/* LEGAL(handover): キャンセル規定・ご利用ルール
              担当：イグチ（オーナー確認済みの規定を差し込み） */}
          <div className="mt-5 font-jp text-[12.5px] leading-[2] text-ink-sub bg-cream border border-rule-gold p-5 text-center">
            <div className="font-serif text-[10px] tracking-[2px] text-gold italic mb-2">LEGAL(handover)</div>
            ここにご利用ルール・キャンセル規定を差し込みます
          </div>
        </div>
      </main>
    </PageWrapper>
  )
}
