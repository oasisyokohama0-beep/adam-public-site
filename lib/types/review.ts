export type Review = {
  id: string;
  therapistId?: string;   // undefined = 店舗全体の口コミ
  therapistName?: string;
  authorName: string;
  rating: number;         // 1〜5
  content: string;
  postedAt: string;
};
