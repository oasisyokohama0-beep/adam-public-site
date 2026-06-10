export type Course = {
  id: string;
  name: string;
  durationMin: number;
  price: number;
  description?: string;
  isFirstOnly?: boolean;
};

export type StoreInfo = {
  name: string;
  nameRoman: string;
  catchphrase?: string;
  area?: string;
  description?: string;
  heroImageUrl?: string;
  lineUrl?: string;
  phone?: string;
  businessHours?: string;
  established?: string;
};

export type StoreEvent = {
  id: string;
  tag: string;
  title: string;
  subtitle?: string;
  startDate: string;
  endDate?: string;
};

export type RankingEntry = {
  rank: number;
  therapistId: string;
  therapistName: string;
  romanName: string;
  label: string;
  value: string;
};
