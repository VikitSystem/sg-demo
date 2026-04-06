/**
 * キャスト向けモバイルアプリ モックデータ
 * ログインキャスト: あおい (companionId: 101, shopId: 01, brand: ごほうび)
 */

import {
  STAFF_OPTIONS,
  COURSE_OPTIONS,
  EXTENSION_OPTIONS,
  DELIVERY_TYPE_OPTIONS,
  CAR_OPTIONS,
} from '../../../mock/bookingselect.js';

export const CAST_PROFILE = {
  companionId: '101',
  name: 'あおい',
  brand: 'ごほうび',
  shopId: '01',
  rank: 'レギュラー',
  joinDate: '2025-06-01',
};

/**
 * 本日(2026-04-06)の予約 — bookingselect.js のIDで管理
 *
 * courseId      → COURSE_OPTIONS[shopId][].id
 * extensionId   → EXTENSION_OPTIONS[shopId][].id
 * deliveryTypeId→ DELIVERY_TYPE_OPTIONS[].id
 * staffId       → STAFF_OPTIONS[].id
 * carGoingId    → CAR_OPTIONS[].id
 * carReturnId   → CAR_OPTIONS[].id
 */
const RAW_BOOKINGS = [
  {
    id: 'b001',
    time: '19:00',
    outTime: '20:40',
    customerName: 'ナカタ',
    shopId: '01',
    courseId: 'course_01_00',     // 60分
    extensionId: 'ext_01_01',     // 30分
    deliveryTypeId: 'delivery_01', // ホテル1
    staffId: 'staff_00',           // 田中
    carGoingId: 'car_01',          // 富安ドライバー
    carReturnId: 'car_01',
    status: 'completed',
    note: '',
  },
  {
    id: 'b002',
    time: '21:30',
    outTime: '23:00',
    customerName: 'ナカムラ',
    shopId: '01',
    courseId: 'course_01_01',     // 90分
    extensionId: 'ext_01_00',     // なし
    deliveryTypeId: 'delivery_02', // ホテル2
    staffId: 'staff_01',           // 佐藤
    carGoingId: 'car_02',          // 鉢呂ドライバー
    carReturnId: 'car_02',
    status: 'active',
    note: '初回のお客様',
  },
  {
    id: 'b003',
    time: '23:30',
    outTime: '01:00',
    customerName: 'サトウ',
    shopId: '01',
    courseId: 'course_01_00',     // 60分
    extensionId: 'ext_01_00',     // なし
    deliveryTypeId: 'delivery_01', // ホテル1
    staffId: 'staff_00',           // 田中
    carGoingId: 'car_00',          // なし
    carReturnId: 'car_00',
    status: 'pending',
    note: '',
  },
];

function labelById(arr, id) {
  return arr.find(x => x.id === id)?.label ?? '—';
}

/** IDからラベルを解決した予約データ */
export const TODAY_BOOKINGS = RAW_BOOKINGS.map(b => ({
  ...b,
  courseLabel:    labelById(COURSE_OPTIONS[b.shopId] ?? [], b.courseId),
  extensionLabel: labelById(EXTENSION_OPTIONS[b.shopId] ?? [], b.extensionId),
  deliveryLabel:  labelById(DELIVERY_TYPE_OPTIONS, b.deliveryTypeId),
  staffLabel:     labelById(STAFF_OPTIONS, b.staffId),
  carGoingLabel:  labelById(CAR_OPTIONS, b.carGoingId),
  carReturnLabel: labelById(CAR_OPTIONS, b.carReturnId),
}));

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
