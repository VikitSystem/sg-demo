/**
 * 予約フォーム セレクトボックス用オプション定義
 */

export const CAR_OPTIONS = [
  { id: 'car_00', label: 'なし' },
  { id: 'car_01', label: '富安ドライバー' },
  { id: 'car_02', label: '鉢呂ドライバー' },
  { id: 'car_03', label: '田中ドライバー' },
  { id: 'car_04', label: '大野ドライバー' },
  { id: 'car_05', label: '室崎ドライバー' },
  { id: 'car_06', label: '高橋ドライバー' },
  { id: 'car_07', label: '入江ドライバー' },
];

export const STAFF_OPTIONS = [
  { id: 'staff_00', label: '田中' },
  { id: 'staff_01', label: '佐藤' },
  { id: 'staff_02', label: '高橋' },
  { id: 'staff_03', label: '中村' },
  { id: 'staff_04', label: '渡辺' },
];

export const MEDIA_OPTIONS = [
  { id: 'media_00', label: 'ヘブンネット' },
  { id: 'media_01', label: 'kaku-butsu' },
  { id: 'media_02', label: 'ネット予約' },
  { id: 'media_03', label: '電話' },
  { id: 'media_04', label: 'その他' },
];

export const DELIVERY_TYPE_OPTIONS = [
  { id: 'delivery_00', label: '歩き' },
  { id: 'delivery_01', label: 'ホテル1' },
  { id: 'delivery_02', label: 'ホテル2' },
];

/** ブランド { label, shopId } */
export const BRANDS = [
  { label: 'ごほうび', shopId: '01' },
  { label: 'ぐっすり', shopId: '02' },
  { label: '回春', shopId: '03' },
];

/** 女性（キャスト）{ label, shopId, companionId } */
export const CAST_OPTIONS = [
  { label: 'あおい',  shopId: '01', companionId: '101' },
  { label: 'みく',    shopId: '01', companionId: '103' },
  { label: 'なな',    shopId: '01', companionId: '107' },
  { label: 'ゆうか',  shopId: '01', companionId: '110' },
  { label: 'しおり',  shopId: '01', companionId: '114' },
  { label: 'りな',    shopId: '02', companionId: '102' },
  { label: 'ゆき',    shopId: '02', companionId: '105' },
  { label: 'まい',    shopId: '02', companionId: '109' },
  { label: 'こはる',  shopId: '02', companionId: '113' },
  { label: 'さくら',  shopId: '03', companionId: '104' },
  { label: 'れい',    shopId: '03', companionId: '108' },
  { label: 'つきの',  shopId: '03', companionId: '112' },
  { label: 'ひなた',  shopId: '03', companionId: '106' },
  { label: 'あやか',  shopId: '03', companionId: '111' },
];

/** 指名区分 { brands, membershipFee, nominationFee, specialNominationFee }
 *  brands は shopId の配列 */
export const NOMINATIONS = {
  'Fフリー': {
    brands: ['01', '02', '03'],
    membershipFee: 1000, nominationFee: 3000, specialNominationFee: 0,
    first_flg: true, second_flg: false,
  },
  'Jフリー': {
    brands: ['01', '02', '03'],
    membershipFee: 0, nominationFee: 3000, specialNominationFee: 0,
    first_flg: false, second_flg: true,
  },
  'F指名': {
    brands: ['01', '02', '03'],
    membershipFee: 1000, nominationFee: 5000, specialNominationFee: 0,
    first_flg: true, second_flg: false,
  },
  'J指名': {
    brands: ['01', '02', '03'],
    membershipFee: 0, nominationFee: 5000, specialNominationFee: 0,
    first_flg: false, second_flg: true,
  },
  'S本指名': {
    brands: ['01', '02', '03'],
    membershipFee: 0, nominationFee: 8000, specialNominationFee: 0,
    first_flg: true, second_flg: true,
  },
  'JG×': {
    brands: ['01', '02', '03'],
    membershipFee: 0, nominationFee: 0, specialNominationFee: 0,
    first_flg: false, second_flg: true,
  },
  'JT×': {
    brands: ['01', '02', '03'],
    membershipFee: 0, nominationFee: 0, specialNominationFee: 0,
    first_flg: false, second_flg: true,
  },
  'JS×': {
    brands: ['01', '02', '03'],
    membershipFee: 0, nominationFee: 0, specialNominationFee: 0,
    first_flg: false, second_flg: true,
  },
  'FG×': {
    brands: ['01', '02', '03'],
    membershipFee: 0, nominationFee: 0, specialNominationFee: 0,
    first_flg: true, second_flg: false,
  },
  'FT×': {
    brands: ['01', '02', '03'],
    membershipFee: 0, nominationFee: 0, specialNominationFee: 0,
    first_flg: true, second_flg: false,
  },
  'FS×': {
    brands: ['01', '02', '03'],
    membershipFee: 0, nominationFee: 0, specialNominationFee: 0,
    first_flg: true, second_flg: false,
  },
};

/** ブランド(shopId)ごとのコース { id, label, duration(分), price(円) } */
export const COURSE_OPTIONS = {
  '01': [
    { id: 'course_01_00', label: '60分',  duration: 60,  price: 12000 },
    { id: 'course_01_01', label: '90分',  duration: 90,  price: 18000 },
    { id: 'course_01_02', label: '120分', duration: 120, price: 24000 },
  ],
  '02': [
    { id: 'course_02_00', label: '90分',  duration: 90,  price: 19000 },
    { id: 'course_02_01', label: '120分', duration: 120, price: 25000 },
    { id: 'course_02_02', label: '150分', duration: 150, price: 33000 },
    { id: 'course_02_03', label: '180分', duration: 180, price: 38000 },
  ],
  '03': [
    { id: 'course_03_00', label: '60分',  duration: 60,  price: 15000 },
    { id: 'course_03_01', label: '90分',  duration: 90,  price: 20000 },
    { id: 'course_03_02', label: '120分', duration: 120, price: 26000 },
    { id: 'course_03_03', label: '180分', duration: 180, price: 40000 },
  ],
};

/** ブランド(shopId)ごとの延長 { id, label, duration(分), price(円) } */
export const EXTENSION_OPTIONS = {
  '01': [
    { id: 'ext_01_00', label: 'なし', duration: 0,  price: 0 },
    { id: 'ext_01_01', label: '30分', duration: 30, price: 6000 },
    { id: 'ext_01_02', label: '60分', duration: 60, price: 10000 },
  ],
  '02': [
    { id: 'ext_02_00', label: 'なし', duration: 0,  price: 0 },
    { id: 'ext_02_01', label: '30分', duration: 30, price: 6000 },
    { id: 'ext_02_02', label: '60分', duration: 60, price: 10000 },
    { id: 'ext_02_03', label: '90分', duration: 90, price: 14000 },
  ],
  '03': [
    { id: 'ext_03_00', label: 'なし', duration: 0,  price: 0 },
    { id: 'ext_03_01', label: '30分', duration: 30, price: 7000 },
    { id: 'ext_03_02', label: '60分', duration: 60, price: 12000 },
    { id: 'ext_03_03', label: '90分', duration: 90, price: 17000 },
  ],
};

/** ブランド(shopId)ごとのOP { id, label, price(円) } */
export const OP_OPTIONS = {
  '01': [
    { id: 'op_01_00', label: 'スマートワンド',    price: 3300 },
    { id: 'op_01_01', label: 'トリップスキン',    price: 3300 },
    { id: 'op_01_02', label: 'ノーパンパンスト',  price: 2200 },
    { id: 'op_01_03', label: 'オナニー鑑賞', price: 2200 },
    { id: 'op_01_03', label: '破廉恥', price: 5500 },
    { id: 'op_01_03', label: '個人コス1', price: 1100 },
    { id: 'op_01_03', label: '個人コス2', price: 2200 },
    { id: 'op_01_03', label: '個人コス3', price: 3300 },
    { id: 'op_01_03', label: '先行予約', price: 3300 },
  ],
  '02': [
    { id: 'op_02_00', label: '初級',   price: 3300 },
    { id: 'op_02_01', label: '中級',   price: 5500 },
    { id: 'op_02_02', label: '上級', price: 11000 },
    { id: 'op_02_02', label: '先行予約', price: 3300 },
  ],
  '03': [
    { id: 'op_03_00', label: '個人コス',    price: 5000 },
    { id: 'op_03_01', label: '回春オプション1',    price: 8000 },
    { id: 'op_03_02', label: '回春オプション2',  price: 3000 },
    { id: 'op_03_03', label: '回春オプション3', price: 2000 },
  ],
};

/** 交通費 { id, label, value(円) } */
export const TRANSPORT_FEE_OPTIONS = [
  { id: 'transport_00', label: 'なし',      value: 0 },
  { id: 'transport_01', label: '500円',    value: 500 },
  { id: 'transport_02', label: '2000円',    value: 2000 },
  { id: 'transport_03', label: '3000円',    value: 3000 },
  { id: 'transport_04', label: '4000円',    value: 4000 },
  { id: 'transport_05', label: '5000円',    value: 5000 },
];

/** 割引 { id, label, value(円, 正数), shopIds } — ブランドごとに適用できる割引が異なる */
export const DISCOUNT_OPTIONS = [
  { id: 'discount_00', label: 'なし',      value: 0,    shopIds: ['01', '02', '03'] },
  { id: 'discount_01', label: '-500円',   value: 500,  shopIds: ['01', '02', '03'] },
  { id: 'discount_02', label: '-1,000円', value: 1000, shopIds: ['01', '02', '03'] },
  { id: 'discount_03', label: '-2,000円', value: 2000, shopIds: ['02', '03'] },
  { id: 'discount_04', label: '-3,000円', value: 3000, shopIds: ['03'] },
];
