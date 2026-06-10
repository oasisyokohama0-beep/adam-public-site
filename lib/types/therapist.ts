export type Therapist = {
  id: string;
  name: string;
  romanName: string;
  age?: number;
  height?: number;
  bust?: number;
  waist?: number;
  hip?: number;
  bloodType?: 'A' | 'B' | 'O' | 'AB';
  hometown?: string;
  hobby?: string;
  introduction?: string;
  tags: string[];
  mainPhotoUrl?: string;
  photoPosition?: string; // CSS background-position e.g. '50% 28%'
  isNew?: boolean;
};

export type TherapistPhoto = {
  id: string;
  therapistId: string;
  url: string;
  isMain: boolean;
  sortOrder: number;
};
