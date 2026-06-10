export type DiaryPost = {
  id: string;
  therapistId: string;
  therapistName: string;
  title: string;
  content: string;
  postedAt: string; // ISO 8601
  images: DiaryImage[];
};

export type DiaryImage = {
  id: string;
  diaryPostId: string;
  url: string;
  sortOrder: number;
};
