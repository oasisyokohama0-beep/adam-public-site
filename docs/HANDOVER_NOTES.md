# 引き継ぎノート

## プロジェクト概要
女性向け風俗店「[STORE_NAME]」の公開HP。既存の予約管理SaaS（Next.js 16 + Supabase）と同一 Supabase プロジェクトを参照して統合される予定。

## 環境構築手順
```bash
cd public-site
npm install
npm run dev    # → http://localhost:3000
npm run build  # ビルド確認（事前に .next/ を削除すること）
```

> **注意**: プロジェクトが OneDrive 配下にあるため、ビルド失敗時は EPERM エラーが出ることがある。
> その場合は `.next/` フォルダを削除してから再実行する。

## 技術スタック・主要ライブラリ
| ライブラリ | バージョン | 用途 |
|---|---|---|
| Next.js | 16.2.6 | App Router |
| React | 19.2.4 | UI |
| TypeScript | 5.x (strict) | 型安全 |
| Tailwind CSS | v4 | スタイリング |
| shadcn/ui | v4 (Base UI) | UIコンポーネント |

**注意点**:
- Tailwind v4 のため `tailwind.config.ts` は存在しない。`@theme inline` で定義する
- shadcn/ui は Base UI ベース（Radix UI ではない）。`asChild` プロップは使えない
- Noto Serif/Sans JP は `next/font/google` だと Turbopack ビルドエラー → CDN リンクで読み込む

## ディレクトリ構造
```
public-site/
├── app/                    # App Router ページ（全ページ実装済み）
├── components/
│   ├── ui/                 # shadcn/ui（Button, Sheet）
│   ├── layout/             # SiteHeader, FixedCta, PageWrapper
│   ├── modals/             # AgeGate（18歳確認）
│   ├── common/             # BDivider, EventSlider
│   └── players/            # CastCard
├── lib/
│   ├── data/               # ダミーデータ JSON（Supabase 移行前）
│   ├── types/              # TypeScript 型定義
│   └── utils.ts
├── public/images/          # セラピスト写真（cast-ren.jpg 等）
└── docs/                   # この引き継ぎドキュメント群
```

## 各ページの状態
| ページ | 状態 | 備考 |
|---|---|---|
| / | 完了 | TOP：スライダー・キャスト・お知らせ・口コミ・予約。Events `view all →` が `/events` へリンク、Voice に `POST A REVIEW` CTA（v2.3） |
| /players | 完了 | セラピスト一覧（エディトリアルリスト） |
| /players/[id] | 完了 | 詳細：写真・自己紹介・シフト・口コミ・指名ボタン |
| /shifts | 完了 | 日付タブ・本日出勤・週間一覧 |
| /diary | 完了 | 写メ日記一覧（v2.3 で 2 列カードグリッド + サムネ画像に刷新） |
| /diary/[id] | 完了 | 写メ日記詳細（v2.3 で画像ギャラリー・セラピスト紹介リンク・前後ナビ追加） |
| /events | 完了 | イベント一覧（v2.3 新規）。`store_events` 全件、グラデカード表示 |
| /ranking | 完了 | 月間TOP3 |
| /reviews | 完了 | 全口コミ・平均評価。`POST A REVIEW` CTA を上部に追加（v2.3） |
| /reviews/new | 完了 | 口コミ投稿フォーム（v2.3 新規）。honeypot + クライアント localStorage レート制限。Server Action は no-op スタブ |
| /system | 完了 | 料金表・オプション |
| /access | 完了 | 3エリア・営業時間・予約CTA |
| /terms | 完了 | 利用規約・プライバシーポリシー |

## 環境変数一覧
現時点で環境変数なし。Supabase 接続時にイグチが設定する：
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## ビルド・起動コマンド
```bash
npm run dev    # 開発サーバー
npm run build  # 本番ビルド（.next/ 削除後に実行）
npm run start  # 本番起動
```

## TODO(handover) コメント一覧
イグチが Supabase 統合時に対応が必要な箇所：

| ファイル | 内容 |
|---|---|
| `app/page.tsx` | therapists / events / news / reviews を Supabase クエリに置換 |
| `app/players/page.tsx` | therapists を Supabase クエリに置換 |
| `app/players/[id]/page.tsx` | therapist / shifts / reviews を Supabase クエリに置換 |
| `app/shifts/page.tsx` | shifts / therapists を Supabase クエリに置換。日付ハードコードを修正して dynamic rendering に |
| `app/diary/page.tsx` | diary_posts + diary_images（先頭画像）を Supabase クエリに置換 |
| `app/diary/[id]/page.tsx` | diary_posts + diary_images（sort_order ASC 全件）を Supabase クエリに置換 |
| `app/events/page.tsx` | store_events を Supabase クエリに置換（`getStoreEvents`） |
| `app/ranking/page.tsx` | ranking_monthly を Supabase クエリに置換 |
| `app/reviews/page.tsx` | reviews を Supabase クエリに置換 |
| `app/reviews/new/page.tsx` | therapists（`getPublicPlayers`）を Supabase クエリに置換 |
| `app/reviews/new/actions.ts` | `submitReview` Server Action 内の no-op を Supabase INSERT に置換。サーバ側レート制限（KV/Upstash）も追加必須 |
| `app/system/page.tsx` | courses を Supabase クエリに置換 |
| `next.config.ts` | Supabase Storage の hostname を remotePatterns に追加 |
| `components/layout/SiteHeader.tsx` | LINE / TEL ボタンに実際の URL を設定 |
| `components/layout/FixedCta.tsx` | LINE / TEL の href に実際の URL を設定 |

詳細は `docs/DATA_MAPPING.md` 参照。

## イグチへの引き継ぎポイント
1. `lib/data/*.json` → 各テーブルの Supabase クエリに置換
2. `TODO(handover):` コメントが全置換箇所のマーカー
3. 型定義は `lib/types/` 参照（変更時は必ず事前確認）
4. 写真は `public/images/` のローカルファイル → Supabase Storage に移行後 URL を差し替え
5. `/shifts` は日付依存のため dynamic rendering に変更が必要
