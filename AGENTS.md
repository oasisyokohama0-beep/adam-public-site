<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Deployment

- 本番URL: https://adam-public-site.vercel.app/
- リポジトリ: https://github.com/oasisyokohama0-beep/adam-public-site (`origin` / `main`)
- ホスティング: Vercel。`main` への push で自動デプロイ（リポジトリ内に `.vercel` 等の設定ファイルは無いのが正常）。
- 本番ビルド確認: `npm run build`（全ページ SSG）。
- 詳細は `README.md` の「デプロイ / 本番環境」「現状」を参照。
