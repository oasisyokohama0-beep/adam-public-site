# 判断記録

## 2026-05-12｜Phase 1 環境構築

### 技術スタック選定
- 仕様書通り Next.js 16 / React 19 / TypeScript 5 (strict) / Tailwind v4 / shadcn/ui v4 で構築
- shadcn/ui は `-d`（デフォルト）で初期化 → Base スタイル（Radix）が選択された
- `base-nova` の `--style` フラグは v4.7.0 で廃止されていたため `-d` フラグで代替。デザイントークンは globals.css の `@theme` ブロックで上書き済みのため実質問題なし

### デザイントークン
- Reverence（案B）のカラーパレットを `@theme inline` ブロックに定義
- shadcn のセマンティックカラーも Reverence トークンにマッピング済み
- `--radius: 0rem`（角丸なし）でホテル的なシャープなデザインを維持

### フォント
- Cormorant Garamond / Noto Serif JP / Noto Sans JP を `next/font/google` で読み込み
- CSS 変数 `--font-cormorant` / `--font-noto-serif` / `--font-noto-sans` として `@theme` に登録

### ダミーデータ
- デザインファイル（hp-remix/project/data.js）のデータをベースに JSON 化
- セラピスト6名、コース4種、口コミ5件、日記5件、シフト2週間分を用意

## 2026-05-12｜Phase 2〜3 ページ実装

### 共通レイアウト
- AgeGate / SiteHeader / FixedCta を `app/layout.tsx` に移動し、全ページで自動適用
- `PageWrapper` コンポーネントで max-width 430px・padding-bottom 60px を統一

### ハンバーガーメニュー
- shadcn/ui Sheet（Base UI ベース）を使用。Radix UI の `asChild` は使えないため `SheetClose` の `render` プロップで Link を渡す方式を採用
- メニュー項目にページリンクを設定済み（LINE予約・採用・お問い合わせは href="#" のまま）

### /shifts ページ
- 日付を `2026-05-12` にハードコード（ダミーデータ期間のため）
- イグチが Supabase 統合時に `new Date()` に変更し dynamic rendering にする

## 2026-05-12｜Phase 4 仕上げ

### next.config.ts
- `images.formats: ['image/webp']` で WebP 変換を有効化
- セキュリティヘッダ（X-Content-Type-Options / X-Frame-Options / Referrer-Policy）を追加
- Supabase Storage の remotePatterns は統合時にイグチが追加

### SEO
- 全ページに `title` + `description` を設定
- ルートレイアウトに OGP（og:title / og:description / og:type）を設定

## 2026-05-12｜仕様書 v2 への対応

### 主な変更点（v1 → v2）
- デザイン縛り撤廃（Reverence はそのまま継続・今回の選択として記録）
- 型定義・ダミーデータ・画像は相手側提供に変更 → 既作成のものを維持、store.json をプレースホルダー値に差し替え
- 法務ページ（/terms /system /access）を骨組みのみに変更し `LEGAL(handover):` マーカーを設置
- 必須ドキュメントに `docs/LEGAL_CHECKLIST.md` を追加
- Vercel は新規プロジェクト・環境変数なしで OK

### 対応内容
- `app/terms/page.tsx` / `app/system/page.tsx` / `app/access/page.tsx` を LEGAL マーカー方式に変更
- `lib/data/store.json` を全プレースホルダー値（`[STORE_NAME]` 等）に差し替え
- `docs/LEGAL_CHECKLIST.md` 作成

## 2026-05-13｜仕様書 v2.1 への対応

### 変更点
- `Shift` 型に `BookedSlot` 型と `bookedSlots: BookedSlot[]` フィールドを追加
- `shifts.json` に `bookedSlots` フィールドを追加（0〜2件のダミーデータ入り）
- `/shifts` ページにタイムラインバー（予約済み時間帯を灰色で塗り潰し）を追加
- `/diary` は低優先度のため現状維持（骨組み＋ダミーデータのまま）
- `/reviews` は既実装済みのため変更なし

## 2026-05-13｜仕様書 v2.2 への対応

### 変更点
- shifts.json を14日分（2026-05-12〜2026-05-25）に拡張
- photos.json を新規作成（TherapistPhoto[]、セラピスト1名あたり3件）
- lib/types/news.ts を新規作成・index.ts に追加
- store.json に `closedDays` キーを追加（10キー完備）
- /access ページのハードコード配列を store.json 経由に変更（v2.2接合部規約1.5準拠）
- FixedCta・SiteHeader の LINE/TEL ボタンを store.json 経由に変更 + LEGAL マーカー追加
- SiteHeader ナビゲーション修正：/players・/reviews・/access を追加、重複の /system 2リンクを解消、デッドアンカーに LEGAL マーカー付与

### news.json（独自追加の経緯）
v2.2 で任意機能として正式採用。v1〜v2 の段階で TOP ページの Information セクション用に先行実装したもので、仕様書には未記載だったが追加判断した。今回 v2.2 で公式化されたため DECISIONS_LOG に経緯を記録。

## イグチへの確認
- 確認内容：なし（仕様書 v2.2 通りに対応）

## 2026-05-23｜仕様書 v2.3 への対応（M / N / O / P 4 セクション）

### 変更点

- **M. `/events` 一覧ページ新規追加**
  - Server Component。`store_events` 全件、startDate DESC で並べ替え
  - EventSlider と同系統のグラデーション 4 パターンをローテーション
  - 空状態 UI（「現在開催中・予定のイベントはありません」）
  - TOP の `view all →` を `<span>` から `<Link href="/events">` に変更
  - TOP の EventSlider は先頭 3 件に絞り、全件は `/events` で参照させる切り分け
  - events.json は 3 件 → 7 件に拡充（仕様書 v2.3「6 件以上」基準）

- **N. `/reviews/new` 口コミ投稿フォーム新規追加**
  - Client Component（`ReviewForm`）+ Server Action（`actions.ts`）の二層構成
  - **バリデーション**：zod は導入せず手書きで実装（依存追加を避けるため、つばさと合意済み）
  - **honeypot**：`<input name="website">` を視覚的・支援技術的に隠す（`position:absolute; left:-9999px` + `aria-hidden=true`）。値が入っていたら「成功扱い」で破棄
  - **レート制限**：クライアント側 localStorage で同一ブラウザ 5 分間 1 件まで
  - **Server Action**：no-op スタブ。バリデーションのみ実施し、INSERT 部分は `TODO(handover):` で記述
  - **サーバ側レート制限**は本リポジトリでは未実装（つばさが Vercel KV / Upstash で追加する前提、CHANGE_NOTES と DATA_MAPPING に明記）
  - 動線：TOP Voice セクションと `/reviews` 上部に `POST A REVIEW` CTA ボタンを追加

- **O. 修正納品時のドキュメント要件**
  - `docs/CHANGE_NOTES_2026-05-23.md` を新規作成。これが運用ルール初回の成果物
  - v2.3 改訂で 接合部影響あり（新規ページ 2 / 新規データ取得 2 / Server Action 1）に該当

- **P. 写メ日記 表示 UI 完成**
  - `/diary` 一覧：2 列カードグリッド + サムネ画像 + 投稿日 / セラピスト名 / タイトル / 本文抜粋（80文字）
  - `/diary/[id]` 詳細：画像 1 枚なら単体表示、2 枚以上は横スクロール snap ギャラリー、`/players/[therapistId]` リンク、前後ナビ
  - diary.json は 5 件 → 7 件に拡充、全件に画像を付与（既存 `/public/images/cast-*.{jpg,png}` を流用）

### 判断記録

#### 1. ダミー画像の方針
- 仕様書 P のダミーデータ件数は「6 件以上、画像 1〜3 枚/件」
- 既存 `public/images/` には `cast-ren.jpg` / `cast-sora.png` / `cast-haru.png` の 3 ファイルのみ
- 新規プレースホルダー画像を生成するより、既存キャスト画像を 7 件 × 1〜3 枚で再利用する方が
  「実データに近い見え方」になるため、流用方針を採用（つばさと事前合意済み）

#### 2. 仕様書内の DiaryPost 型と P セクション ダミーデータ例の不整合
- 仕様書「型定義」セクション：`{ therapistId, therapistName, images: DiaryImage[] }`
- 仕様書「P. ダミーデータ」セクション：`{ playerId, playerName, imageUrls: string[] }`
- 両者が矛盾するが、「型定義の勝手な変更禁止」「やってはいけないこと」より **型定義を正** と判断
- 既存 `lib/types/diary.ts` の型を維持し、diary.json は型定義に従って書く
- 次回の仕様書改訂時にこの不整合の解消を依頼予定（つばさへ連絡事項）

#### 3. zod を導入しなかった理由
- 仕様書では「validation は zod 等で型安全に」と例示
- 投稿フォーム 1 つのために依存追加するのは依存比でメリット薄
- 既存プロジェクトに zod 未使用、TypeScript strict + 手書きバリデーションで十分カバー可能
- バリデーション関数はテストしやすい純関数として `actions.ts` 内に分離済み

#### 4. Server Action no-op の境界
- 本リポジトリでは：バリデーション実施 + honeypot 判定のみ
- つばさ統合時に：Supabase INSERT + サーバ側レート制限を追加
- 「honeypot ヒット → 成功扱い」の挙動は **本リポジトリ側でも維持** している（バリデーション前にショートサーキット）
- これは bot にエラーを返さず「成功した」と思わせるためのスパム対策パターンで、統合後も同じ挙動を維持する想定

### イグチへの確認
- 確認内容：本件依頼書（仕様書 v2.3）に沿って実装、追加質問なし
- 上記「2.（DiaryPost 型と P 仕様データ例の不整合）」は次回改訂時の解消を依頼

## 2026-06-26｜ADAM 本番向けビジュアル調整・料金反映・接合部修正

### ビジュアル調整
- TOP ヒーローにブランドコピー（`Private Men's Therapy` / `超性感特化型プライベートサロン`）を追加し、ロゴのみのファーストビューから世界観が伝わる構成に変更。
- セラピスト写真未登録時のカードを単色グラデーションからシルエット風プレースホルダーに変更し、未完成に見えにくい表示にした。
- FixedCta の LINE 緑を抑え、黒・ワイン・ゴールドのブランドトーンに寄せた。

### 料金 / courses
- `lib/data/courses.json` を空配列から ADAM 東京の実料金 8 コースに更新。
  - 顔合わせ60分 / 90分 / 120分 / 150分 / お昼寝 / 朝まで / まったりお泊まり / 24時間貸切。
- `app/system/page.tsx` は引き続き `TODO(handover):` マーカーを維持し、井口さんが Supabase `courses` クエリに置換する前提を保持。
- 参照元ページで「指名料」「出張エリア / 交通費」「延長」「注意事項」は見出しのみ確認できたため、金額本文は追加せず見出しカードとして残した。

### 可読性・フォント
- 小さな補助文字が暗く見えすぎないよう、`--color-ink-sub` / `--color-ink-mute` / `--color-gold` / `--color-gold-dk` を黒背景上で読みやすい明度へ調整。
- 全体の `.italic` を通常表示へ上書きし、小文字・数字・注釈が斜めに見えないようにした。
- 金額やランキング数字が Cormorant Garamond で浮いて見えたため、`font-serif` を `Noto Serif JP` に統一し、`next/font/google` の Cormorant 読み込みを削除した。

### 接合部ルール違反の修正
- 2026-06-25 の `0c4191d add system pricing courses` で `lib/types/store.ts` の `Course` 型に `durationLabel?` を追加していたが、`docs/INTEGRATION_HANDOFF.md` の「型定義の勝手な変更禁止」に反するため削除。
- `courses.json` からも `durationLabel` を削除し、表示上必要なラベルは `app/system/page.tsx` 内の `courseDurationLabel(course)` で `durationMin` / `id` から生成する方式に変更。
- 型定義は既存の `Course` 形状（`id`, `name`, `durationMin`, `price`, `description?`, `isFirstOnly?`）へ戻した。

### 井口さんへの確認
- `courses.json` は本番表示用の実料金を一時的に保持しているが、統合時は Supabase `courses` へ置換予定。
- 特殊コース（お昼寝 / 朝まで / お泊まり）の表示ラベルは現在 `course.id` に依存している。Supabase 側の `courses` レコード ID または別カラム運用にするかは井口さん確認事項。
