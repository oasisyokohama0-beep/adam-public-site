'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'adam_age_ok'
const DURATION_MS = 30 * 24 * 60 * 60 * 1000 // 30日

export function AgeGate() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const ts = localStorage.getItem(STORAGE_KEY)
      if (!ts || Date.now() - Number(ts) >= DURATION_MS) {
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  function confirm() {
    try { localStorage.setItem(STORAGE_KEY, String(Date.now())) } catch {}
    setVisible(false)
  }

  function deny() {
    window.location.href = 'https://www.yahoo.co.jp/'
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/85 backdrop-blur-sm">
      <div className="relative bg-bg max-w-[340px] w-full px-7 py-10 text-center border border-rule-gold">
        {/* 内枠 */}
        <div className="absolute inset-2 border border-rule-gold pointer-events-none" />

        <div className="font-serif text-[10px] tracking-[3px] text-gold italic">Age Verification</div>
        <div className="font-jp text-xl tracking-[4px] text-ink mt-3">18歳以上の方へ</div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2.5 my-5">
          <div className="flex-1 h-px bg-rule-gold max-w-[40px]" />
          <div className="w-[5px] h-[5px] rounded-full border border-gold rotate-45" />
          <div className="flex-1 h-px bg-rule-gold max-w-[40px]" />
        </div>

        <p className="font-jp text-[13px] leading-loose text-ink-sub">
          当サイトは成人向けのコンテンツを含みます。<br />
          18歳以上の方のみご覧いただけます。
        </p>

        <div className="flex gap-2.5 mt-7">
          <button
            onClick={confirm}
            className="flex-1 py-[14px] bg-wine text-ink font-serif text-xs tracking-[2px] cursor-pointer"
          >
            18歳以上です
          </button>
          <button
            onClick={deny}
            className="flex-1 py-[14px] border border-rule-gold text-ink font-serif text-xs tracking-[2px] cursor-pointer"
          >
            いいえ
          </button>
        </div>

        <div className="font-serif text-[10px] tracking-[1.5px] text-ink-mute italic mt-[18px]">
          確認済みの情報は30日間保持されます
        </div>
      </div>
    </div>
  )
}
