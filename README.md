# ADAM — public site

女性向け風俗店「ADAM」の公開 HP（Next.js 16 App Router）。
Lumière（lumiere-public-site）をテンプレートにスキャフォールド。

## セットアップ

```bash
npm install
npm run dev
```

http://localhost:3000

## デプロイ / 本番環境

- **本番URL**: https://adam-public-site.vercel.app/
- **リポジトリ**: https://github.com/oasisyokohama0-beep/adam-public-site （`origin` / `main`）
- **ホスティング**: Vercel。`main` への push で**自動デプロイ**（CI設定ファイルは不要）。
- 全ページ静的生成（SSG）。本番ビルド確認は `npm run build`。
- 業種がアダルト関連のため Vercel 利用規約上は停止リスクあり（承知の上で利用中）。移行先候補は Cloudflare Pages / 静的書き出し。

## プロジェクト構成

仕様書: `c:\Users\cooki\OneDrive\ドキュメント\hp_handoff_spec(1).md`（v2.3）

主なディレクトリ：

```
app/                Next.js App Router ページ
components/         UI コンポーネント
lib/data/           ダミーデータ JSON（Supabase 統合時に置換）
lib/types/          型定義
public/images/      静的画像
docs/               引き継ぎドキュメント
```

## 引き継ぎ

- `docs/HANDOVER_NOTES.md` — 全体像と起点
- `docs/DATA_MAPPING.md` — Supabase 統合時のデータマッピング
- `docs/DECISIONS_LOG.md` — 実装上の判断ログ
- `docs/LEGAL_CHECKLIST.md` — 法務・店舗情報の差し込みチェックリスト

ハンドオフタグ：

- `TODO(handover):` — Supabase 置換が必要な箇所
- `LEGAL(handover):` — 法務・店舗情報の差し込み箇所

## 現状

- **ブランディング反映済み**: 店舗名 ADAM TOKYO、ロゴ（`public/images/logo.jpg`）をヒーローに配置
- **配色**: ロゴ準拠の黒地×アイボリー、差し色ワインレッド（`app/globals.css` の `@theme inline`。`--color-wine` 追加、`--color-gold` はアイボリー系）
- **データ**: `therapists.json` に4名（りん/Rei/しょうへい/ゆうてん、写真未登録）。`store.json` の店舗名は反映済み、その他項目（電話/LINE/営業時間/エリア等）は未投入の項目あり
- `events.json` / `news.json` / `ranking.json` / `reviews.json` / `diary.json` / `shifts.json` / `courses.json` は空配列
- `app/page.tsx` の `RANK_COPY`、`app/players/[id]/page.tsx` の `PLAYER_SNS` は空 Record

### 参考：実店舗サイト（adamtokyo.com）からの既知情報
- エリア: 新宿（出張全国対応） / 営業: 12:00〜翌2:00
- 電話: 070-9181-5425 / LINE: https://lin.ee/VKjin2Le
- コンセプト: 「超性感特化型」

ブランド・データを順次差し替えてください。
