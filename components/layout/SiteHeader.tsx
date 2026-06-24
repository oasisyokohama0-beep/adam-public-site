'use client'

import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import storeData from '@/lib/data/store.json'
import type { StoreInfo } from '@/lib/types'

// TODO(handover): Supabase クエリに置換 / テーブル: store_info
const store = storeData as StoreInfo

// 全主要ページへの動線を確保（v2.2 ナビゲーション規約準拠）
// - 同一URLへの重複リンク禁止
// - デッドアンカーは LEGAL(handover) マーカー付きのみ許容
const MENU_ITEMS: Array<{ label: string; href: string; legal?: true }> = [
  { label: 'TOP',            href: '/' },
  { label: '在籍セラピスト',  href: '/players' },
  { label: '本日の出勤',      href: '/shifts' },
  { label: 'ランキング',      href: '/ranking' },
  { label: 'お客様の声',      href: '/reviews' },
  { label: '写メ日記',        href: '/diary' },
  { label: '料金システム',    href: '/system' },
  { label: 'アクセス',        href: '/access' },
  { label: 'よくある質問',    href: '/terms' },
  // LEGAL(handover): 以下3項目のhrefは実URLに差し替えること（store.json or 外部URL）
  { label: '予約フォーム',    href: '#reserve',  legal: true },
  { label: 'セラピスト募集',  href: '#recruit',  legal: true },
  { label: 'お問い合わせ',    href: '#contact',  legal: true },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-bg/94 backdrop-blur-md border-b border-rule-gold">
      <div className="max-w-[430px] mx-auto flex items-center justify-between px-[22px] py-3">

        {/* Brand — 左 */}
        <Link href="/" className="text-center no-underline">
          {/* LEGAL(handover): 店舗名 — store.json nameRoman から取得 */}
          <div className="font-serif text-base tracking-[4px] text-ink uppercase">{store.nameRoman}</div>
          <div className="font-serif text-[8px] tracking-[2.5px] text-gold italic mt-px">est. 2024 ・ tokyo</div>
        </Link>

        {/* Hamburger — 右 */}
        <Sheet>
          <SheetTrigger
            aria-label="メニューを開く"
            className="flex flex-col justify-between items-end w-[22px] h-4 cursor-pointer bg-transparent border-none p-0"
          >
            <span className="block h-px bg-ink w-full" />
            <span className="block h-px bg-ink w-full" />
            <span className="block h-px bg-ink w-[70%]" />
          </SheetTrigger>

          <SheetContent
            side="right"
            showCloseButton={false}
            className="w-full max-w-[430px] p-0 bg-surface border-none flex flex-col gap-0"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-[22px] py-3 border-b border-rule-gold flex-shrink-0">
              <div className="w-[22px]" />
              <div className="text-center">
                <div className="font-serif text-sm tracking-[4px] text-ink uppercase">Menu</div>
              </div>
              <SheetClose className="w-[22px] h-4 relative bg-transparent border-none p-0 cursor-pointer">
                <span className="absolute top-[7px] left-0 block w-[22px] h-px bg-cream rotate-45" />
                <span className="absolute top-[7px] left-0 block w-[22px] h-px bg-cream -rotate-45" />
              </SheetClose>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto py-6 text-center" aria-label="サイトナビゲーション">
              {MENU_ITEMS.map(item => (
                <SheetClose key={item.label} render={<Link href={item.href} />}>
                  <div className="py-[14px] px-6">
                    <div className="font-jp text-base text-ink tracking-[3px]">{item.label}</div>
                  </div>
                </SheetClose>
              ))}
            </nav>

            {/* Footer */}
            <div className="flex-shrink-0 px-[22px] pb-6 pt-[18px] border-t border-rule-gold bg-surface text-center">
              <div className="font-serif text-[10px] tracking-[3px] text-gold italic">RESERVATIONS</div>
              <div className="flex gap-2 justify-center mt-2.5">
                {/* LEGAL(handover): LINE URL — store.json lineUrl から取得 */}
                <a
                  href={store.lineUrl ?? '#'}
                  className="flex-1 max-w-[130px] py-[11px] bg-line-green text-white font-serif tracking-[2px] text-[11px] text-center no-underline"
                >
                  LINE
                </a>
                {/* LEGAL(handover): 電話番号 — store.json phone から取得 */}
                <a
                  href={`tel:${store.phone}`}
                  className="flex-1 max-w-[130px] py-[11px] border border-gold text-gold font-serif tracking-[2px] text-[11px] text-center no-underline"
                >
                  TEL
                </a>
              </div>
            </div>
          </SheetContent>
        </Sheet>

      </div>
    </header>
  )
}
