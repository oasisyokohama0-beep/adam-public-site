export type BookedSlot = {
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
};

export type Shift = {
  id: string;
  therapistId: string;
  date: string;           // YYYY-MM-DD
  startTime: string;      // HH:mm 出勤開始
  endTime: string;        // HH:mm 出勤終了
  bookedSlots: BookedSlot[]; // 予約済み時間帯（0件以上）
};
