/**
 * キャスト向けモバイルアプリ チャットモックデータ
 * ログインキャスト: あおい (companionId: 101)
 * 今日: 2026-04-06 / 現在時刻: 21:30 (固定)
 *
 * 今日  = 2026-04-06 → lastTime に時刻表示
 * 昨日  = 2026-04-05 → lastTime に '昨日'
 * それ以前 → lastTime に '月/日'
 *
 * unread > 0 → スレッドの末尾は partner の未読メッセージ (read:false)
 * unread = 0 → 末尾は me のメッセージ (read:false = 未読) または partner 全件 read:true
 * me メッセージの read: true = 相手が既読、false = 未読
 */

/** トーク一覧 */
export const TALK_LIST = [
  {
    id: '1',
    type: 'customer',
    name: 'ナカタ',
    initial: 'ナ',
    lastMessage: 'また来週もぜひ伺いますね！',
    lastTime: '14:10',
    lastTimestamp: '2026-04-06T14:10:00',
    unread: 2,
  },
  {
    id: '2',
    type: 'customer',
    name: 'スズキ',
    initial: 'ス',
    lastMessage: 'お待ちしています！',
    lastTime: '昨日',
    lastTimestamp: '2026-04-05T23:55:00',
    unread: 0,
  },
  {
    id: '3',
    type: 'customer',
    name: 'サトウ',
    initial: 'サ',
    lastMessage: '今夜21時ごろ予約できますか？',
    lastTime: '18:30',
    lastTimestamp: '2026-04-06T18:30:00',
    unread: 1,
  },
  {
    id: '4',
    type: 'customer',
    name: 'ナカムラ',
    initial: 'ナ',
    lastMessage: 'またのお越しをお待ちしています😊',
    lastTime: '4/3',
    lastTimestamp: '2026-04-03T01:17:00',
    unread: 0,
  },
  {
    id: '5',
    type: 'customer',
    name: 'イトウ',
    initial: 'イ',
    lastMessage: 'お待ちしています！😊',
    lastTime: '4/1',
    lastTimestamp: '2026-04-01T22:05:00',
    unread: 0,
  },
  {
    id: '6',
    type: 'customer',
    name: 'ヤマモト',
    initial: 'ヤ',
    lastMessage: 'ありがとうございます！楽しみにしています🙌',
    lastTime: '19:55',
    lastTimestamp: '2026-04-06T19:55:00',
    unread: 1,
  },
  {
    id: '7',
    type: 'customer',
    name: 'コバヤシ',
    initial: 'コ',
    lastMessage: 'またのお越しお待ちしています😊',
    lastTime: '3/28',
    lastTimestamp: '2026-03-28T00:38:00',
    unread: 0,
  },
  {
    id: '8',
    type: 'customer',
    name: 'カトウ',
    initial: 'カ',
    lastMessage: 'はい、いつでもどうぞ！',
    lastTime: '3/25',
    lastTimestamp: '2026-03-25T21:05:00',
    unread: 0,
  },
  {
    id: '9',
    type: 'customer',
    name: 'ワタナベ',
    initial: 'ワ',
    lastMessage: 'お待ちしています！',
    lastTime: '3/22',
    lastTimestamp: '2026-03-22T02:12:00',
    unread: 0,
  },
  {
    id: '10',
    type: 'customer',
    name: 'マツモト',
    initial: 'マ',
    lastMessage: 'ありがとうございます、またお待ちしています！',
    lastTime: '3/20',
    lastTimestamp: '2026-03-20T23:05:00',
    unread: 0,
  },
  // 予約チャット
  {
    id: 'store-1',
    type: 'booking',
    name: '管理部（本店）',
    initial: '管',
    lastMessage: '今日のシフトに変更があります。確認お願いします',
    lastTime: '16:42',
    lastTimestamp: '2026-04-06T16:42:00',
    unread: 1,
  },
  {
    id: 'store-2',
    type: 'booking',
    name: 'サカエスタッフ',
    initial: 'ス',
    lastMessage: '明日の指名予約入りました。よろしくお願いします',
    lastTime: '昨日',
    lastTimestamp: '2026-04-05T21:15:00',
    unread: 0,
  },
  {
    id: 'store-3',
    type: 'booking',
    name: 'ナゴヤ店スタッフ',
    initial: 'ナ',
    lastMessage: 'お疲れ様でした！今日もありがとうございました',
    lastTime: '4/5',
    lastTimestamp: '2026-04-05T02:30:00',
    unread: 0,
  },
  // 店舗チャット
  {
    id: 'sg-1',
    type: 'store',
    name: 'SG 全体連絡',
    initial: 'SG',
    lastMessage: '来月のキャンペーンについてお知らせします',
    lastTime: '20:10',
    lastTimestamp: '2026-04-06T20:10:00',
    unread: 2,
  },
  {
    id: 'sg-2',
    type: 'store',
    name: '内勤スタッフ',
    initial: '内',
    lastMessage: '給与明細を送付しました。ご確認ください',
    lastTime: '昨日',
    lastTimestamp: '2026-04-05T17:30:00',
    unread: 0,
  },
  {
    id: 'sg-3',
    type: 'store',
    name: 'イベント連絡',
    initial: 'イ',
    lastMessage: '来週のイベント詳細です。参加可能かご確認ください',
    lastTime: '4/5',
    lastTimestamp: '2026-04-05T11:00:00',
    unread: 2,
  },
];

/**
 * 個別チャットメッセージ
 * sender: 'me' | 'partner'
 * read (partner): cast が既読にしたか
 * read (me): partner が既読にしたか
 */
export const MESSAGES = {
  // unread:2 → 末尾に partner の未読2件
  '1': [
    { date: '2026-04-05', messages: [
      { id: 'm1', sender: 'partner', text: 'こんばんは！今日もよろしくお願いします😊', time: '20:15', read: true },
      { id: 'm2', sender: 'me',      text: 'こちらこそ、お待ちしています！',           time: '20:17', read: true },
      { id: 'm3', sender: 'partner', text: '20時半ごろ伺いますね。いつものコスプレをお願いしてもいいですか？', time: '20:19', read: true },
      { id: 'm4', sender: 'me',      text: 'もちろんです！ご用意してお待ちしますね',   time: '20:21', read: true },
    ]},
    { date: '2026-04-06', messages: [
      { id: 'm5', sender: 'me',      text: '昨日はありがとうございました！',  time: '13:00', read: true },
      { id: 'm6', sender: 'partner', text: 'こちらこそ楽しかったです😊',      time: '14:03', read: false },
      { id: 'm7', sender: 'partner', text: 'また来週もぜひ伺いますね！',      time: '14:10', read: false },
    ]},
  ],
  // unread:0 → 末尾は me のメッセージ (昨日)
  '2': [
    { date: '2026-04-05', messages: [
      { id: 'm1', sender: 'partner', text: '今日もありがとうございました！', time: '23:50', read: true },
      { id: 'm2', sender: 'me',      text: 'こちらこそ楽しかったです😊',    time: '23:52', read: true },
      { id: 'm3', sender: 'partner', text: 'また来週伺いますね！',          time: '23:53', read: true },
      { id: 'm4', sender: 'me',      text: 'お待ちしています！',            time: '23:55', read: false },
    ]},
  ],
  // unread:1 → 末尾に partner の未読1件 (今日)
  '3': [
    { date: '2026-04-06', messages: [
      { id: 'm1', sender: 'partner', text: '今夜21時ごろ予約できますか？', time: '18:30', read: false },
    ]},
  ],
  // unread:0 → 末尾は me のメッセージ
  '4': [
    { date: '2026-04-03', messages: [
      { id: 'm1', sender: 'me',      text: '本日もありがとうございました！またのご来店お待ちしています🙏', time: '01:10', read: true },
      { id: 'm2', sender: 'partner', text: 'ありがとうございました',                                     time: '01:15', read: true },
      { id: 'm3', sender: 'me',      text: 'またのお越しをお待ちしています😊',                           time: '01:17', read: false },
    ]},
  ],
  // unread:0 → 末尾は me のメッセージ
  '5': [
    { date: '2026-04-01', messages: [
      { id: 'm1', sender: 'partner', text: '先日はありがとう、また来るね', time: '22:00', read: true },
      { id: 'm2', sender: 'me',      text: 'お待ちしています！😊',        time: '22:05', read: false },
    ]},
  ],
  // unread:1 → 末尾に partner の未読1件 (今日)
  '6': [
    { date: '2026-04-06', messages: [
      { id: 'm1', sender: 'partner', text: '今週末も行っていいですか？',               time: '19:45', read: true },
      { id: 'm2', sender: 'me',      text: 'もちろんです！お待ちしています😊',         time: '19:50', read: true },
      { id: 'm3', sender: 'partner', text: 'ありがとうございます！楽しみにしています🙌', time: '19:55', read: false },
    ]},
  ],
  // unread:0 → 末尾は me のメッセージ
  '7': [
    { date: '2026-03-28', messages: [
      { id: 'm1', sender: 'me',      text: '本日はありがとうございました！', time: '00:30', read: true },
      { id: 'm2', sender: 'partner', text: 'いつもありがとうございます！',   time: '00:35', read: true },
      { id: 'm3', sender: 'me',      text: 'またのお越しお待ちしています😊', time: '00:38', read: false },
    ]},
  ],
  // unread:0 → 末尾は me のメッセージ
  '8': [
    { date: '2026-03-25', messages: [
      { id: 'm1', sender: 'partner', text: '次回の予約を入れてもいいですか', time: '21:00', read: true },
      { id: 'm2', sender: 'me',      text: 'はい、いつでもどうぞ！',        time: '21:05', read: false },
    ]},
  ],
  // unread:0 → 末尾は me のメッセージ
  '9': [
    { date: '2026-03-22', messages: [
      { id: 'm1', sender: 'me',      text: '本日もありがとうございました🙏', time: '02:00', read: true },
      { id: 'm2', sender: 'partner', text: '楽しかったです、また行きます',   time: '02:10', read: true },
      { id: 'm3', sender: 'me',      text: 'お待ちしています！',            time: '02:12', read: false },
    ]},
  ],
  // unread:0 → 末尾は me のメッセージ
  '10': [
    { date: '2026-03-20', messages: [
      { id: 'm1', sender: 'partner', text: 'お疲れ様でした！',                           time: '23:00', read: true },
      { id: 'm2', sender: 'me',      text: 'ありがとうございます、またお待ちしています！', time: '23:05', read: false },
    ]},
  ],
  // 店舗チャット: unread:1 → 末尾に partner の未読1件 (今日)
  'store-1': [
    { date: '2026-04-05', messages: [
      { id: 'm1', sender: 'partner', text: '明日のシフトですが、21時スタートでお願いします', time: '18:00', read: true },
      { id: 'm2', sender: 'me',      text: 'わかりました、よろしくお願いします！',         time: '18:05', read: true },
    ]},
    { date: '2026-04-06', messages: [
      { id: 'm3', sender: 'me',      text: 'おはようございます、本日もよろしくお願いします', time: '14:20', read: true },
      { id: 'm4', sender: 'partner', text: 'こちらこそよろしくお願いします',               time: '14:35', read: true },
      { id: 'm5', sender: 'partner', text: '今日のシフトに変更があります。確認お願いします', time: '16:42', read: false },
    ]},
  ],
  // 店舗チャット: unread:0 → 末尾は me のメッセージ (昨日)
  'store-2': [
    { date: '2026-04-04', messages: [
      { id: 'm1', sender: 'partner', text: '今週の出勤日を教えてもらえますか？',  time: '15:00', read: true },
      { id: 'm2', sender: 'me',      text: '月・水・金の予定です',               time: '15:12', read: true },
      { id: 'm3', sender: 'partner', text: 'ありがとうございます、了解しました', time: '15:15', read: true },
    ]},
    { date: '2026-04-05', messages: [
      { id: 'm4', sender: 'partner', text: '明日の指名予約入りました。よろしくお願いします', time: '21:15', read: true },
      { id: 'm5', sender: 'me',      text: 'ありがとうございます！しっかり対応します',     time: '21:20', read: false },
    ]},
  ],
  // 予約チャット: unread:0 → 末尾は partner のメッセージ (4/5)
  'store-3': [
    { date: '2026-04-04', messages: [
      { id: 'm1', sender: 'partner', text: '本日はお疲れ様でした。指名も好調でしたよ！', time: '02:00', read: true },
      { id: 'm2', sender: 'me',      text: 'ありがとうございます！励みになります😊',    time: '02:10', read: true },
    ]},
    { date: '2026-04-05', messages: [
      { id: 'm3', sender: 'me',      text: '本日もよろしくお願いします！',             time: '19:00', read: true },
      { id: 'm4', sender: 'partner', text: 'お疲れ様でした！今日もありがとうございました', time: '02:30', read: true },
    ]},
  ],
  'sg-1': [
    { date: '2026-04-06', messages: [
      { id: 'm1', sender: 'partner', text: '来月のキャンペーンについてお知らせします。詳細は別途資料を共有します', time: '20:10', read: false },
      { id: 'm2', sender: 'partner', text: '期間：5月1日〜5月31日、対象：全キャスト', time: '20:11', read: false },
    ]},
  ],
  'sg-2': [
    { date: '2026-04-05', messages: [
      { id: 'm1', sender: 'partner', text: '4月分の給与明細を送付しました。ご確認ください', time: '17:30', read: true },
      { id: 'm2', sender: 'me',      text: '確認しました。ありがとうございます',             time: '17:45', read: true },
    ]},
  ],
  'sg-3': [
    { date: '2026-04-05', messages: [
      { id: 'm1', sender: 'partner', text: '来週のイベント詳細です。参加可能かご確認ください', time: '11:00', read: false },
      { id: 'm2', sender: 'partner', text: '日時：4月13日(日) 20:00〜 / 場所：本店VIPルーム',  time: '11:01', read: false },
    ]},
  ],
};

/** 日付文字列を表示用にフォーマット (例: "2026-04-06" → "2026年4月6日（月）") */
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
export function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${WEEKDAYS[d.getDay()]}）`;
}
