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
const otherSections = [
  { label: '指名料', sub: 'PRICE' },
  { label: '出張エリア / 交通費', sub: 'AREA / TRANSPORTATION EXPENSES' },
  { label: '延長', sub: 'PRICE' },
  { label: '注意事項', sub: 'NOTES' },
]

function courseDurationLabel(course: Course) {
  switch (course.id) {
    case 'nap':
      return '施術120分 + お昼寝120分'
    case 'morning':
      return '22:00〜翌05:00'
    case 'overnight':
      return '22:00〜翌10:00'
    default:
      return `${course.durationMin}分`
  }
}

function CourseRow({ course, index, total }: { course: Course; index: number; total: number }) {
  const durationLabel = courseDurationLabel(course)
  const showDuration = durationLabel !== course.name

  return (
    <div
      className="py-5"
      style={{
        borderTop: `1px solid ${index === 0 ? 'var(--color-rule-gold)' : 'var(--color-rule)'}`,
        borderBottom: index === total - 1 ? '1px solid var(--color-rule-gold)' : 'none',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 text-left">
          <div className="font-jp text-[15px] leading-relaxed tracking-[1px] text-ink">{course.name}</div>
          {showDuration && (
            <div className="mt-1 font-serif text-[11px] tracking-[2px] text-gold italic">
              {durationLabel}
            </div>
          )}
          {course.description && (
            <div className="mt-2 font-jp text-[11px] leading-relaxed text-ink-sub">
              {course.description}
            </div>
          )}
        </div>
        <div className="shrink-0 pt-0.5 text-right">
          <div className="font-serif text-[24px] leading-none text-ink">
            ¥{course.price.toLocaleString()}
          </div>
          <div className="mt-1 font-serif text-[9px] uppercase tracking-[2px] text-ink-mute">tax in</div>
        </div>
      </div>
      {course.isFirstOnly && (
        <div className="mt-3.5 mx-auto max-w-[240px] p-2.5 bg-cream border border-rule-gold">
          <div className="font-serif text-[9px] tracking-[3px] text-gold-dk italic">FOR YOUR FIRST VISIT</div>
          <div className="font-jp text-[11px] mt-1">初回ご来店の方限定割引</div>
        </div>
      )}
    </div>
  )
}

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
        <section className="px-5 pb-4">
          <div className="mb-4 border border-rule-gold bg-[rgba(199,188,163,0.04)] px-5 py-4 text-center">
            <div className="font-jp text-[15px] tracking-[2px] text-ink">コース / 料金</div>
            <div className="mt-1 font-serif text-[10px] uppercase tracking-[4px] text-gold">Price</div>
          </div>
          {courses.map((course, index) => (
            <CourseRow key={course.id} course={course} index={index} total={courses.length} />
          ))}
        </section>

        {/* Other headings from the source system page */}
        <section className="px-5 pb-10 pt-6">
          <div className="grid gap-3">
            {otherSections.map(section => (
              <div
                key={section.label}
                className="border border-rule bg-[rgba(199,188,163,0.03)] px-5 py-4 text-center"
              >
                <div className="font-jp text-[14px] tracking-[2px] text-ink">{section.label}</div>
                <div className="mt-1 font-serif text-[9px] uppercase tracking-[3px] text-gold">{section.sub}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PageWrapper>
  )
}
