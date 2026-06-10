'use server'

// TODO(handover): Supabase へ INSERT する実装に置換
// 参照実装: reservation-saas/lib/hp/queries.ts:createReview
// テーブル: reviews
// 必要なフィルタ/設定:
//   - store_id: URL の store_code から解決
//   - is_approved: false（owner 承認待ち）
//   - posted_at: now()
// レート制限: 同一 IP から 5 分間 1 件まで（Vercel KV or Upstash で実装）
// 承認制（is_approved=false）が一次防御。honeypot + レート制限は補助。

export type ReviewSubmitResult =
  | { ok: true }
  | { ok: false; errors: Record<string, string> }

type RawInput = {
  authorName: string
  rating: number
  content: string
  playerId: string | null
  // honeypot field — bot が埋めた場合のみ値が入る
  website: string
}

function validate(input: RawInput): Record<string, string> {
  const errors: Record<string, string> = {}

  const name = input.authorName.trim()
  if (!name) errors.authorName = 'お名前（ニックネーム）を入力してください'
  else if (name.length > 30) errors.authorName = 'お名前は30文字以内で入力してください'

  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    errors.rating = '評価を選択してください'
  }

  const content = input.content.trim()
  if (content.length < 10) errors.content = '本文は10文字以上で入力してください'
  else if (content.length > 1000) errors.content = '本文は1000文字以内で入力してください'

  return errors
}

/**
 * 口コミ投稿 Server Action（no-op スタブ）
 *
 * 本実装ではバリデーション後に Supabase へ INSERT する。
 * 現状はバリデーションのみ実施し、永続化はしない。
 * honeypot に値が入っていた場合はバリデーションをスキップして「成功扱い」を返す（黙って破棄）。
 */
export async function submitReview(input: RawInput): Promise<ReviewSubmitResult> {
  // honeypot ヒット → bot 判定。エラーを返さず「成功扱い」で破棄する
  if (input.website && input.website.trim().length > 0) {
    return { ok: true }
  }

  const errors = validate(input)
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  // TODO(handover): ここで Supabase INSERT
  // const supabase = createClient()
  // await supabase.from('reviews').insert({
  //   store_id: storeId,
  //   player_id: input.playerId,
  //   author_name: input.authorName.trim(),
  //   rating: input.rating,
  //   content: input.content.trim(),
  //   is_approved: false,
  //   posted_at: new Date().toISOString(),
  // })

  return { ok: true }
}
