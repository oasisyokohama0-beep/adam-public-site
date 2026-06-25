# 井口さん連携 / 統合ハンドオフガイド（エージェント必読）

> このファイルを最初に読めば、井口さんとの連携の前提・守るルール・現状の注意点が分かります。
> Claude / Codex など複数ツールで作業するため、**作業前にここと `HANDOVER_NOTES.md` を読むこと**。

---

## 1. 体制（誰が何を担当するか）

- **制作側**（このリポジトリで作業する人 = あなた / Claude / Codex）: デザイン・フロントエンド実装。
- **井口（イグチ）さん**: 既存の予約管理SaaS `reservation-saas`（Next.js 16 + Supabase）への**統合担当**。このHPを `store_code: adam` として組み込み、`lib/data/*.json` を Supabase クエリに置換する。GitHub Collaborator 招待済み。
- 先行店舗 **Lumière**（lumiere-public-site）が同じ体制で統合済み。**ADAM はそれに続く2号店**。
- 正の仕様書: `c:\Users\cooki\OneDrive\ドキュメント\hp_handoff_spec(1).md`（v2.3）。

> ⚠️ **表記ゆれ注意**: 仕様書と `DECISIONS_LOG.md` は統合担当を「**つばさ**」と書いているが、本案件の担当は**井口さん**。`DECISIONS_LOG.md` の 2026-05 の記録は **Lumière 開発時の履歴がクローンで残ったもの**で、ADAM の作業履歴ではない。

---

## 2. 守るルール（接合部規約・変更禁止）

井口さんの統合作業を機械的にするため、以下は**必ず守る**。

1. **データ取得は `app/**/page.tsx` 直下のサーバーコンポーネントで完結**させる。
   - 子コンポーネントで `lib/data/*.json` を import しない（子は props で受け取る）。
   - 例外: 全店舗共通の `store.json` は `SiteHeader` / `FixedCta` 等の共有レイアウトで import 済み（`TODO(handover):` マーカー付き）。**この例外を他のデータに広げないこと**。
2. データ取得箇所に **`TODO(handover):`**、店舗実情報・法務テキストの差し込み箇所に **`LEGAL(handover):`** マーカーを必ず残す。消さない。
3. **`lib/types/` の型定義を勝手に変更しない**。変更が必要なら井口さんに確認（DBスキーマに直結するため）。
4. **URL・ディレクトリ構造を変更しない**（統合時に `app/(public)/[store_code]/` 配下へそのまま移される）。
5. **認証・予約・Supabase 接続を実装しない**。口コミ投稿の Server Action は no-op スタブのまま（`app/reviews/new/actions.ts`）。
6. 技術スタック固定: Next.js 16 App Router / React 19 / TS strict / **Tailwind v4（`@theme`、`tailwind.config.ts` 不使用）** / shadcn(Base UI, `asChild` 不可) / **npm のみ**。
7. **接合部に影響する変更**（ページ追加・データ取得点の増減・Server Action 変更・型変更など）を入れたら、`docs/CHANGE_NOTES_<YYYY-MM-DD>.md` を作成して内容を記録する。
8. 設計判断は `docs/DECISIONS_LOG.md`、データ参照は `docs/DATA_MAPPING.md`、法務/店舗情報の未処理は `docs/LEGAL_CHECKLIST.md` に記録する。

### やってはいけないこと（ダメな部分の典型）
- 子コンポーネントでの直接 `*.json` import を増やす
- `lib/types/` の型を相談なく変更する
- ページURL・ディレクトリの変更、`/{storeCode}/...` への先回り書き換え（統合時に井口さんが行う）
- 法務テキスト・店舗実情報を自己判断で本文に書く（必ず `LEGAL(handover):` で残す）
- Supabase / 認証コードの実装

---

## 3. 現状の注意点（連携で気をつける所＝今ズレている部分）

本番公開を優先して進めた結果、仕様書の「ハンドオフ用＝最終納品はプレースホルダー」前提と一部ズレている。**井口さんと方針をすり合わせる必要がある**項目：

1. **`store.json` が実値になっている**
   `name` / `nameRoman` = 実値「ADAM TOKYO」。仕様の原則（最終納品時はプレースホルダーへ戻す／店舗実情報は井口さんが Supabase `store_info` から差し込む）と相違。
   → 本番運用方針なら意図的。井口さんは統合時に `store_info`（store_code=adam）で上書きする想定。`catchphrase` / `area` / `phone` / `lineUrl` / `businessHours` / `closedDays` / `established` 等は**まだプレースホルダーのまま**。
2. **`therapists.json` に実名ベースのデータ4名**（りん / Rei / しょうへい / ゆうてん、写真・プロフィール未登録）。
   → これは**ダミーデータ枠**。井口さんが `users + player_profiles`（store_code=adam）の Supabase クエリに置換予定。`TODO(handover):` 維持。
3. **ブランディング変更が `DECISIONS_LOG.md` に未記録**（ロゴ反映・配色のダーク/アイボリー+ワインレッド化・ヘッダーやテキストの削除など）。
   → ルール上、井口さん向けに記録が必要。次の作業でまとめて追記する。
4. **ロゴ画像**: `public/images/logo.jpg`（1280×1280）をヒーローで使用。統合後は Supabase Storage へ移す可能性あり（`next.config.ts` の remotePatterns 追加は井口さん担当）。

---

## 4. 複数ツール（Claude / Codex）併用時の注意

- 全員が同じ `main` を見ている。**作業前に必ず `git pull origin main`**。
- 同じ `main` へ同時 push すると衝突する。**同時編集を避ける**か、ツールごとに作業ブランチを分ける。
- 本番は Vercel 自動デプロイ（`main` push で反映）。詳細は `README.md` /「デプロイ / 本番環境」。

---

## 5. まず読むファイルの順番

1. このファイル（`docs/INTEGRATION_HANDOFF.md`）
2. `AGENTS.md` / `README.md`
3. `docs/HANDOVER_NOTES.md`（全体像）
4. `docs/DATA_MAPPING.md`（データ→Supabase 置換マップ）
5. 仕様書 v2.3（上記パス）
