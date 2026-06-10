import type { Metadata } from 'next'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { BDivider } from '@/components/common/BDivider'

export const metadata: Metadata = {
  title: '規約・プライバシー',
  description: '[STORE_NAME]のご利用規約・プライバシーポリシー。',
}

export default function TermsPage() {
  return (
    <PageWrapper>
      <main>
        <div className="px-6 pt-10 pb-6 text-center">
          <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold italic">Legal</span>
          <div className="font-jp text-[22px] mt-3 tracking-[4px]">規約・プライバシー</div>
          <div className="mt-4"><BDivider /></div>
        </div>

        {/* ── 利用規約 ── */}
        <div className="px-[22px] pb-8">
          <div className="text-center mb-5">
            <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold italic">Terms of Service</span>
            <div className="font-jp text-base mt-2">ご利用規約</div>
          </div>

          {/* LEGAL(handover): 利用規約本文
              担当：イグチ（オーナー or 弁護士監修テキストを差し込み）
              ▼ この div の中身を差し替えてください ▼ */}
          <div className="font-jp text-[12.5px] leading-[2] text-ink-sub bg-cream border border-rule-gold p-5 text-center">
            <div className="font-serif text-[10px] tracking-[2px] text-gold italic mb-2">LEGAL(handover)</div>
            ここに利用規約本文を差し込みます
          </div>
        </div>

        <div className="px-[22px] py-2"><BDivider /></div>

        {/* ── キャンセルポリシー ── */}
        <div className="px-[22px] pt-6 pb-6">
          <div className="text-center mb-5">
            <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold italic">Cancellation</span>
            <div className="font-jp text-base mt-2">キャンセルポリシー</div>
          </div>

          {/* LEGAL(handover): キャンセルポリシー本文
              担当：イグチ（オーナー確認済みの規定テキスト） */}
          <div className="font-jp text-[12.5px] leading-[2] text-ink-sub bg-cream border border-rule-gold p-5 text-center">
            <div className="font-serif text-[10px] tracking-[2px] text-gold italic mb-2">LEGAL(handover)</div>
            ここにキャンセルポリシーを差し込みます
          </div>
        </div>

        <div className="px-[22px] py-2"><BDivider /></div>

        {/* ── プライバシーポリシー ── */}
        <div className="px-[22px] pt-6 pb-10">
          <div className="text-center mb-5">
            <span className="font-serif text-[11px] tracking-[4px] uppercase text-gold italic">Privacy Policy</span>
            <div className="font-jp text-base mt-2">プライバシーポリシー</div>
          </div>

          {/* LEGAL(handover): プライバシーポリシー本文
              担当：イグチ（個人情報の取り扱い・Cookie等） */}
          <div className="font-jp text-[12.5px] leading-[2] text-ink-sub bg-cream border border-rule-gold p-5 text-center">
            <div className="font-serif text-[10px] tracking-[2px] text-gold italic mb-2">LEGAL(handover)</div>
            ここにプライバシーポリシーを差し込みます
          </div>

          {/* LEGAL(handover): 最終更新日 */}
          <div className="font-serif text-[10px] text-ink-mute italic text-center mt-4">
            最終更新: [LEGAL(handover): 更新日]
          </div>
        </div>
      </main>
    </PageWrapper>
  )
}
