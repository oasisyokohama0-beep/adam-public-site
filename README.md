# ADAM — public site

女性向け風俗店「ADAM」の公開 HP（Next.js 16 App Router）。
Lumière（lumiere-public-site）をテンプレートにスキャフォールド。

## セットアップ

```bash
npm install
npm run dev
```

http://localhost:3000

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

## 現状（スキャフォールド直後）

- `lib/data/*.json` は全て空配列 / `store.json` は `[STORE_NAME]` プレースホルダ
- `app/page.tsx` の `RANK_COPY`、`app/players/[id]/page.tsx` の `PLAYER_SNS` は空 Record
- ブランドカラー（`app/globals.css` の `@theme inline`）は Lumière のシャンパンゴールド系のまま
- 写真は `public/images/` から Lumière 用キャストを削除済み

ブランド・データを順次差し替えてください。
