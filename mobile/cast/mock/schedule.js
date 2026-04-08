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
  NOMINATIONS,
} from '../../../mock/bookingselect.js';

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
    storeChatId: 'store-1',
    driverChatId: 'sg-4',   // 富安ドライバー
    shopId: '01',
    courseId: 'course_01_00',     // 60分
    extensionId: 'ext_01_01',     // 30分
    deliveryTypeId: 'delivery_01', // ホテル1
    staffId: 'staff_00',           // 田中
    carGoingId: 'car_01',          // 富安ドライバー
    carReturnId: 'car_01',
    nominationLabel: 'F指名',
    status: 'completed',
    note: '',
  },
  {
    id: 'b002',
    time: '21:30',
    outTime: '23:00',
    customerName: 'ナカムラ',
    storeChatId: 'store-2',
    driverChatId: 'sg-2',   // 鉢呂ドライバー
    shopId: '01',
    courseId: 'course_01_01',     // 90分
    extensionId: 'ext_01_00',     // なし
    deliveryTypeId: 'delivery_02', // ホテル2
    staffId: 'staff_01',           // 佐藤
    carGoingId: 'car_02',          // 鉢呂ドライバー
    carReturnId: 'car_02',
    nominationLabel: 'Fフリー',
    status: 'active',
    note: '初回のお客様',
  },
  {
    id: 'b003',
    time: '23:30',
    outTime: '01:00',
    customerName: 'サトウ',
    storeChatId: 'store-3',
    shopId: '01',
    courseId: 'course_01_00',     // 60分
    extensionId: 'ext_01_00',     // なし
    deliveryTypeId: 'delivery_01', // ホテル1
    staffId: 'staff_00',           // 田中
    carGoingId: 'car_00',          // なし
    carReturnId: 'car_00',
    nominationLabel: 'J指名',
    status: 'pending',
    note: '',
  },
];

function labelById(arr, id) {
  return arr.find(x => x.id === id)?.label ?? '—';
}

/** IDからラベルを解決した予約データ */
export const TODAY_BOOKINGS = RAW_BOOKINGS.map(b => {
  const coursePrice = (COURSE_OPTIONS[b.shopId] ?? []).find(c => c.id === b.courseId)?.price ?? 0;
  const extPrice    = (EXTENSION_OPTIONS[b.shopId] ?? []).find(e => e.id === b.extensionId)?.price ?? 0;
  const nom         = NOMINATIONS[b.nominationLabel] ?? {};
  const nomPrice    = (nom.membershipFee ?? 0) + (nom.nominationFee ?? 0);
  const totalPrice  = coursePrice + extPrice + nomPrice;
  return {
    ...b,
    courseLabel:    labelById(COURSE_OPTIONS[b.shopId] ?? [], b.courseId),
    extensionLabel: labelById(EXTENSION_OPTIONS[b.shopId] ?? [], b.extensionId),
    deliveryLabel:  labelById(DELIVERY_TYPE_OPTIONS, b.deliveryTypeId),
    staffLabel:     labelById(STAFF_OPTIONS, b.staffId),
    carGoingLabel:  labelById(CAR_OPTIONS, b.carGoingId),
    carReturnLabel: labelById(CAR_OPTIONS, b.carReturnId),
    totalPrice,
    castSalary: Math.floor(totalPrice / 2),
  };
});

