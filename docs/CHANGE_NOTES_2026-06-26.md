# 変更ノート 2026-06-26

## 概要
- ADAM TOKYO 本番向けのデザイン調整、料金表反映、可読性改善を記録。
- `docs/INTEGRATION_HANDOFF.md` の接合部ルールに合わせ、`Course` 型へ追加していた `durationLabel?` を削除。

## 接合部への影響
- `app/system/page.tsx`
  - `TODO(handover):` マーカーは維持。
  - `lib/data/courses.json` は引き続きページ直下の Server Component で import。
  - 特殊コースの表示ラベルは型や JSON へ足さず、ページ内関数 `courseDurationLabel(course)` で生成。
- `lib/data/courses.json`
  - 空配列から ADAM 東京の実料金 8 コースへ更新。
  - `durationLabel` のような未合意フィールドは置かない。
- `lib/types/store.ts`
  - `Course` 型は既存形状へ戻した。

## デザイン / 可読性
- TOP ヒーロー、セラピストカード、FixedCta をブランドトーンに合わせて調整。
- 小さな文字の色を黒背景で読みやすい明度へ変更。
- 斜体表示を通常表示へ統一。
- 金額・数字のフォントを `Noto Serif JP` に統一し、Cormorant Garamond 読み込みを削除。

## 井口さんへの確認事項
- Supabase `courses` 側で特殊コースの表示ラベルを持つか、フロント側で `durationMin` / `id` から生成するか。
- 本番表示用に入れた実料金データを統合時に `courses` テーブルへどう移すか。
