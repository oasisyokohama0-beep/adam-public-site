# データ参照マッピング

イグチがダミーデータ → Supabase に置換する際の必須ドキュメント。
各ページの `TODO(handover):` コメントとあわせて参照すること。

---

## app/page.tsx（TOP）

### 使用データ
- `lib/data/therapists.json` → 先頭4件
- `lib/data/events.json` → 全件（スライダー）
- `lib/data/news.json` → 全件
- `lib/data/reviews.json` → 先頭3件

### イグチが置換する際の注意
- therapists: `users(role='player') JOIN player_profiles WHERE is_active=true AND is_public=true LIMIT 4`
- events: `store_events WHERE end_date >= today OR end_date IS NULL ORDER BY start_date DESC`
- reviews: `reviews WHERE is_published=true ORDER BY posted_at DESC LIMIT 3`

---

## app/players/page.tsx（セラピスト一覧）

### 使用データ
- `lib/data/therapists.json` → 全件

### イグチが置換する際の注意
- `users(role='player') JOIN player_profiles WHERE is_active=true AND is_public=true ORDER BY sort_order`
- TODAYフィルタ: shifts テーブルで date=today の therapistId と JOIN
- NEWフィルタ: `player_profiles.is_new = true`

---

## app/players/[id]/page.tsx（セラピスト詳細）

### 使用データ
- `lib/data/therapists.json` → id で1件
- `lib/data/shifts.json` → therapistId でフィルタ、date >= today、最大7件
- `lib/data/reviews.json` → therapistId でフィルタ、先頭2件

### イグチが置換する際の注意
- therapist が見つからない場合は `notFound()` を呼ぶ（実装済み）
- シフトは date 昇順ソート済み
- dynamic rendering に変更が必要（日付が変わるため）

---

## app/system/page.tsx（料金）

### 使用データ
- `lib/data/courses.json` → 全件
- 現在は ADAM 東京の実料金 8 コースを JSON に格納済み（本番表示優先）。
- `Course` 型は変更しない。表示用の特殊ラベル（例: `施術120分 + お昼寝120分`, `22:00〜翌05:00`）は `app/system/page.tsx` 側で `durationMin` / `id` から生成。

### イグチが置換する際の注意
- `courses WHERE is_active=true ORDER BY duration_min`
- `TODO(handover):` マーカーは維持。Supabase 置換時に `lib/data/courses.json` import をクエリへ置換する。
- 特殊コースの表示ラベルを DB 側で持つか、フロント側で生成するかは井口さん確認。

---

## app/shifts/page.tsx（出勤スケジュール）

### 使用データ
- `lib/data/shifts.json` → 直近7日
- `lib/data/therapists.json` → 全件

### イグチが置換する際の注意
- 現在は `2026-05-12` をハードコード → `new Date()` に変更し dynamic rendering にする
- `shifts WHERE date BETWEEN today AND today+6 ORDER BY date, start_time`

---

## app/diary/page.tsx（写メ日記一覧）★ v2.3 で UI 刷新

### 使用データ
- `lib/data/diary.json` → 全件、postedAt 降順
- 各 post の `images[]` から sortOrder ASC の先頭1枚をサムネ表示

### イグチが置換する際の注意
- 参照実装: `reservation-saas/lib/hp/queries.ts:getDiaryPosts`
- `diary_posts WHERE is_published=true ORDER BY posted_at DESC`
- + `diary_images WHERE diary_post_id IN (...) ORDER BY sort_order ASC` を LEFT JOIN
  またはサブクエリで先頭1枚のみ取得
- 2 列カードグリッド表示、サムネ画像必須（`/images/placeholder.jpg` フォールバックも可）

---

## app/diary/[id]/page.tsx（写メ日記詳細）★ v2.3 で UI 刷新

### 使用データ
- `lib/data/diary.json` → id で1件
- 当該 post の `images[]` 全件、sortOrder ASC でギャラリー表示

### イグチが置換する際の注意
- 参照実装: `reservation-saas/lib/hp/queries.ts:getDiaryPosts`
- `diary_posts WHERE id = params.id AND is_published=true`
- + `diary_images WHERE diary_post_id = :id ORDER BY sort_order ASC`
- セラピスト紹介ページへのリンクあり（`/players/[therapistId]`）— store_code 配下では URL 調整必要
- 前後の投稿リンクは postedAt DESC 配列の前後を参照

---

## app/events/page.tsx（イベント一覧）★ v2.3 新規

### 使用データ
- `lib/data/events.json` → 全件、startDate 降順

### イグチが置換する際の注意
- 参照実装: `reservation-saas/lib/hp/queries.ts:getStoreEvents`
- `store_events WHERE is_active=true ORDER BY start_date DESC, sort_order ASC`
- 空配列フォールバックを保持すること（空状態 UI が用意済み）
- TOP の `<Link href="/events">` は store_code 配下では `/{storeCode}/events` に書き換え

---

## app/ranking/page.tsx（ランキング）

### 使用データ
- `lib/data/ranking.json` → 全件
- `lib/data/therapists.json` → 写真取得用

### イグチが置換する際の注意
- `ranking_monthly WHERE month = current_month ORDER BY rank`
- 写真は therapist JOIN で取得

---

## app/reviews/page.tsx（口コミ）

### 使用データ
- `lib/data/reviews.json` → 全件、postedAt 降順
- 2026-06-26 時点ではデザイン確認用の掲載サンプルを格納。`Review` 型の追加変更はなし。

### イグチが置換する際の注意
- `reviews WHERE is_approved=true ORDER BY posted_at DESC`
  （v2.3 で投稿フォームが `is_approved=false` で INSERT するようになったため、
   一覧側のフィルタは `is_approved=true` を必須にすること。`is_published` 廃止）

---

## app/reviews/new/page.tsx（口コミ投稿フォーム）★ v2.3 新規

### 使用データ
- `lib/data/therapists.json` → 全件（player_id 選択 UI 用）

### Server Action
- `app/reviews/new/actions.ts` の `submitReview`
- 現状は no-op スタブ（バリデーションのみ実施、永続化なし）
- honeypot ヒット時はバリデーションをスキップして「成功扱い」で破棄
- クライアント側 localStorage で同一ブラウザ 5 分間 1 件のレート制限を実装済み

### イグチが置換する際の注意
- 参照実装: `reservation-saas/lib/hp/queries.ts:createReview` および `getPublicPlayers`
- INSERT 対象: `reviews(store_id, player_id, author_name, rating, content, is_approved, posted_at)`
  - `store_id`: URL の store_code から解決
  - `is_approved`: false（owner 承認待ち）
  - `posted_at`: `now()`
- **サーバ側レート制限を必ず追加**：同一 IP から 5 分間 1 件まで（Vercel KV / Upstash 推奨）
  - クライアント側の localStorage は最低限の二重防御の片側のみ。サーバ側が本丸。
- honeypot ヒット時は INSERT せず「成功扱い」を返す挙動を維持
- player_id は任意（null 許容）

---

## app/access/page.tsx（アクセス）

### 使用データ
- ハードコード（店舗情報は store.json から取得に変更可能）

### イグチが置換する際の注意
- `store_info` テーブルから住所・営業時間を取得する形に変更

---

## app/terms/page.tsx（規約）

### 使用データ
- ハードコード（変更頻度が低いため）
