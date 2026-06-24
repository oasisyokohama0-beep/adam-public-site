'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { submitReview } from './actions'

type PlayerOption = {
  id: string
  name: string
  romanName: string
}

interface Props {
  playerOptions: PlayerOption[]
}

// クライアント側レート制限: 同一ブラウザから 5 分間 1 件まで（最終防御はサーバ側）
const RATE_LIMIT_KEY = 'adam:review:lastSubmitAt'
const RATE_LIMIT_MS = 5 * 60 * 1000

function isRateLimited(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = window.localStorage.getItem(RATE_LIMIT_KEY)
    if (!raw) return false
    const last = parseInt(raw, 10)
    if (Number.isNaN(last)) return false
    return Date.now() - last < RATE_LIMIT_MS
  } catch {
    return false
  }
}

function markSubmitted() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()))
  } catch {
    // ignore
  }
}

export function ReviewForm({ playerOptions }: Props) {
  const [authorName, setAuthorName] = useState('')
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [content, setContent] = useState('')
  const [playerId, setPlayerId] = useState<string>('')
  const [website, setWebsite] = useState('') // honeypot
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [topError, setTopError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setTopError(null)

    // honeypot にヒット → ダミー成功扱いで黙って破棄
    if (website.trim().length > 0) {
      setSubmitted(true)
      return
    }

    if (isRateLimited()) {
      setTopError('短時間に複数回の投稿はできません。しばらく時間をおいてから再度お試しください。')
      return
    }

    startTransition(async () => {
      const result = await submitReview({
        authorName,
        rating,
        content,
        playerId: playerId || null,
        website,
      })
      if (result.ok) {
        markSubmitted()
        setSubmitted(true)
      } else {
        setErrors(result.errors)
      }
    })
  }

  if (submitted) {
    return (
      <div className="px-[22px] pb-16">
        <div className="bg-surface border border-rule-gold p-[26px] text-center">
          <div className="font-serif text-[22px] italic text-gold leading-none">&ldquo;</div>
          <p className="font-jp text-[14px] leading-loose mt-3">
            投稿ありがとうございました。<br />
            掲載までお時間をいただきます。
          </p>
          <div className="mt-6">
            <Link
              href="/reviews"
              className="inline-block px-8 py-3 bg-gold text-bg font-serif tracking-[2px] text-[11px] no-underline"
            >
              VIEW REVIEWS
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="px-[22px] pb-16 flex flex-col gap-6">
      {topError && (
        <div
          role="alert"
          className="border border-rule-gold bg-cream px-4 py-3 font-jp text-[12px] text-ink"
        >
          {topError}
        </div>
      )}

      {/* honeypot field — 視覚的・支援技術的にも隠す */}
      <div aria-hidden="true" style={{ position: 'absolute', left: -9999, top: -9999, width: 1, height: 1, overflow: 'hidden' }}>
        <label>
          Website (do not fill)
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={e => setWebsite(e.target.value)}
          />
        </label>
      </div>

      {/* お名前 */}
      <div>
        <label htmlFor="authorName" className="font-serif text-[10px] tracking-[2px] uppercase italic text-gold">
          Your Name <span className="text-ink-sub not-italic">（ニックネーム可・必須）</span>
        </label>
        <input
          id="authorName"
          name="authorName"
          type="text"
          required
          maxLength={30}
          value={authorName}
          onChange={e => setAuthorName(e.target.value)}
          className="w-full mt-2 px-3 py-2.5 bg-surface border border-rule-gold font-jp text-[14px] text-ink focus:outline-none focus:border-gold"
        />
        {errors.authorName && (
          <p className="mt-1 font-jp text-[11px] text-red-700">{errors.authorName}</p>
        )}
      </div>

      {/* 評価 */}
      <div>
        <label className="font-serif text-[10px] tracking-[2px] uppercase italic text-gold">
          Rating <span className="text-ink-sub not-italic">（5段階・必須）</span>
        </label>
        <div className="flex items-center gap-2 mt-2" role="radiogroup" aria-label="評価">
          {[1, 2, 3, 4, 5].map(n => {
            const active = n <= (hoverRating || rating)
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`星 ${n} つ`}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-[28px] leading-none cursor-pointer bg-transparent border-none p-0"
                style={{ color: active ? 'var(--color-gold)' : 'var(--color-ink-mute)' }}
              >
                ★
              </button>
            )
          })}
          <span className="font-serif text-[11px] italic text-ink-sub ml-2">
            {rating > 0 ? `${rating}.0` : '未選択'}
          </span>
        </div>
        {errors.rating && (
          <p className="mt-1 font-jp text-[11px] text-red-700">{errors.rating}</p>
        )}
      </div>

      {/* セラピスト指定 */}
      <div>
        <label htmlFor="playerId" className="font-serif text-[10px] tracking-[2px] uppercase italic text-gold">
          Therapist <span className="text-ink-sub not-italic">（指名がある場合・任意）</span>
        </label>
        <select
          id="playerId"
          name="playerId"
          value={playerId}
          onChange={e => setPlayerId(e.target.value)}
          className="w-full mt-2 px-3 py-2.5 bg-surface border border-rule-gold font-jp text-[14px] text-ink focus:outline-none focus:border-gold"
        >
          <option value="">指定なし（店舗全体）</option>
          {playerOptions.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}（{p.romanName}）
            </option>
          ))}
        </select>
      </div>

      {/* 本文 */}
      <div>
        <label htmlFor="content" className="font-serif text-[10px] tracking-[2px] uppercase italic text-gold">
          Your Voice <span className="text-ink-sub not-italic">（10〜1000文字・必須）</span>
        </label>
        <textarea
          id="content"
          name="content"
          required
          minLength={10}
          maxLength={1000}
          rows={6}
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full mt-2 px-3 py-2.5 bg-surface border border-rule-gold font-jp text-[14px] text-ink leading-relaxed focus:outline-none focus:border-gold resize-y"
        />
        <div className="mt-1 flex justify-between font-serif text-[10px] italic text-ink-sub">
          <span>{errors.content ? <span className="text-red-700 font-jp">{errors.content}</span> : '　'}</span>
          <span>{content.length} / 1000</span>
        </div>
      </div>

      {/* 注意書き */}
      <div className="font-jp text-[11px] text-ink-sub leading-loose">
        <p>※ いただいた内容は、店舗の確認後に掲載されます。</p>
        <p>※ 反映までにお時間をいただく場合がございます。</p>
      </div>

      {/* 送信 */}
      <div className="text-center">
        <button
          type="submit"
          disabled={pending}
          className="w-full py-3.5 bg-gold text-bg font-serif tracking-[3px] text-[12px] disabled:opacity-50"
        >
          {pending ? 'SUBMITTING…' : 'SUBMIT'}
        </button>
        <Link
          href="/reviews"
          className="inline-block mt-4 font-serif text-[11px] tracking-[2px] text-gold italic no-underline"
        >
          ← 口コミ一覧に戻る
        </Link>
      </div>
    </form>
  )
}
