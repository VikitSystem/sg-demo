/**
 * キャスト向けモバイルアプリ モックデータ
 * ログインキャスト: あおい (companionId: 101, shopId: 01, brand: ごほうび)
 */

export const CAST_PROFILE = {
  companionId: '101',
  name: 'あおい',
  brand: 'ごほうび',
  shopId: '01',
  rank: 'レギュラー',
  joinDate: '2025-06-01',
};

/** 本日(2026-04-06)の予約 */
export const TODAY_BOOKINGS = [
  {
    id: 'b001',
    time: '19:00',
    outTime: '20:40',
    customerName: 'ナカタ',
    courseLabel: '60分コース',
    extensionLabel: '20分延長',
    deliveryLabel: 'ホテル1',
    staffLabel: '田中',
    carGoingLabel: '富安ドライバー',
    carReturnLabel: '富安ドライバー',
    status: 'completed',
    note: '',
  },
  {
    id: 'b002',
    time: '21:30',
    outTime: '23:00',
    customerName: 'ヤマダ',
    courseLabel: '90分コース',
    extensionLabel: 'なし',
    deliveryLabel: 'ホテル2',
    staffLabel: '佐藤',
    carGoingLabel: '鉢呂ドライバー',
    carReturnLabel: '鉢呂ドライバー',
    status: 'active',
    note: '初回のお客様',
  },
  {
    id: 'b003',
    time: '23:30',
    outTime: '01:00',
    customerName: 'サトウ',
    courseLabel: '60分コース',
    extensionLabel: 'なし',
    deliveryLabel: 'ホテル1',
    staffLabel: '田中',
    carGoingLabel: 'なし',
    carReturnLabel: 'なし',
    status: 'pending',
    note: '',
  },
];

/** 当月勤怠サマリー */
export const MONTH_SUMMARY = {
  year: 2026,
  month: 4,
  workDays: 8,
  totalMinutes: 2640,
  scheduledDays: 16,
};

/** 今月の日別勤怠ログ（最近7日分） */
export const ATTENDANCE_LOG = [
  { date: '2026-04-06', clockIn: '18:30', clockOut: null,    breakMinutes: 0,   status: 'working' },
  { date: '2026-04-05', clockIn: '19:00', clockOut: '02:30', breakMinutes: 30,  status: 'done' },
  { date: '2026-04-04', clockIn: '18:45', clockOut: '01:00', breakMinutes: 0,   status: 'done' },
  { date: '2026-04-03', clockIn: null,    clockOut: null,    breakMinutes: 0,   status: 'off' },
  { date: '2026-04-02', clockIn: '19:00', clockOut: '00:30', breakMinutes: 30,  status: 'done' },
  { date: '2026-04-01', clockIn: '19:30', clockOut: '23:00', breakMinutes: 0,   status: 'done' },
];
