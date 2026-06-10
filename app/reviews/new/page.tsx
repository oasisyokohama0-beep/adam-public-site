import type { Metadata } from 'next'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { BDivider } from '@/components/common/BDivider'
import therapistsData from '@/lib/data/therapists.json'
import type { Therapist } from '@/lib/types'
import { ReviewForm } from './ReviewForm'

export const metadata: Metadata = {
  title: '口コミを投稿する',
  description: '[STORE_NAME]の口コミを投稿いただけます。掲載までお時間をいただきます。',
}

// TODO(handover): ダミーデータを Supabase クエリに置換
// 参照実装: reservation-saas/lib/hp/queries.ts:getPublicPlayers
// 取得条件: users(role='player') JOIN player_profiles WHERE is_active=true AND is_public=true
const therapists = therapistsData as Therapist[]

export default function ReviewNewPage() {
  // ReviewForm に渡す選択肢（player_id 任意）
  const playerOptions = therapists.map(t => ({
    id: t.id,
    name: t.name,
    romanName: t.romanName,
  }))

  return (
    <PageWrapper>
      <main>
        <div className="px-6 pt-10 pb-6 text-center">
          <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold italic">Post a Review</span>
          <div className="font-jp text-[22px] mt-3 tracking-[4px]">口コミを投稿する</div>
          <div className="mt-4"><BDivider /></div>
          <p className="font-jp text-[12px] text-ink-sub leading-loose mt-5 px-2">
            ご利用いただきありがとうございました。<br />
            いただいた内容は、確認後の掲載となります。
          </p>
        </div>

        <ReviewForm playerOptions={playerOptions} />
      </main>
    </PageWrapper>
  )
}
