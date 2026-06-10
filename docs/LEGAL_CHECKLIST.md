# 法務・店舗情報 TODO リスト

統合時にイグチが処理する項目を集約。
**本番公開前に全項目を消化すること。**

grep コマンドで全マーカー箇所を確認できる：
```bash
grep -rn "LEGAL(handover)" --include="*.tsx" --include="*.ts" .
```

---

## 法務テキスト

- [ ] `/terms` — 利用規約本文（オーナー or 弁護士監修）
- [ ] `/terms` — キャンセルポリシー本文
- [ ] `/terms` — プライバシーポリシー本文
- [ ] `/terms` — 最終更新日
- [ ] `/system` — オプション料金表（実際の金額・項目）
- [ ] `/system` — ご利用ルール・キャンセル規定
- [ ] `/system` — 特定商取引法の表示要否の確認

## 店舗基本情報（store.json プレースホルダー → 実値）

- [ ] `store.json` — `[STORE_NAME]` 店舗名（日本語）
- [ ] `store.json` — `[STORE_NAME_ROMAN]` 店舗名（英字）
- [ ] `store.json` — `[STORE_CATCHPHRASE]` キャッチコピー
- [ ] `store.json` — `[STORE_AREA]` 営業エリア
- [ ] `store.json` — `[STORE_DESCRIPTION]` 店舗説明文
- [ ] `store.json` — `[STORE_LINE_URL]` LINE 連絡先 URL
- [ ] `store.json` — `[STORE_PHONE]` 電話番号（tel: リンク用）
- [ ] `store.json` — `[STORE_BUSINESS_HOURS]` 営業時間
- [ ] `store.json` — `[STORE_CLOSED_DAYS]` 定休日
- [ ] `store.json` — `[STORE_ESTABLISHED]` 創業年

## アクセスページ追記

- [ ] `/access` — エリア詳細・最寄り駅（`[STORE_ACCESS_DETAIL]`）
- [ ] `/access` — 代表者名・運営会社（任意）

## メニューのデッドアンカー（href が仮のもの）

- [ ] ハンバーガーメニュー「予約フォーム」`href="#reserve"` → 実URLに差し替え
- [ ] ハンバーガーメニュー「セラピスト募集」`href="#recruit"` → 実URLに差し替え
- [ ] ハンバーガーメニュー「お問い合わせ」`href="#contact"` → 実URLに差し替え

## 動作確認

- [ ] 18禁モーダル「いいえ」→ Yahoo! Japan にリダイレクト
- [ ] 18禁モーダル「はい」→ 30日間 localStorage フラグ保持
- [ ] FixedCta LINE ボタンが実際のアカウントにつながること
- [ ] FixedCta TEL ボタンが正しい番号に発信すること
- [ ] 全主要ページ（/players /shifts /reviews /ranking /system /access /terms）にメニューから1〜2クリックで到達できること

---

*`LEGAL(handover):` コメントが差し込み箇所のマーカー。コード内を grep して全て対応すること。*
