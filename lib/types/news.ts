export type NewsItem = {
  id: string;
  date: string;               // YYYY.MM.DD 形式
  tag: 'NEW' | 'EVENT' | 'NOTICE';
  text: string;               // 短文（80文字以内推奨）
};
