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
    name: 'タナカ',
    initial: 'タ',
    lastMessage: 'また来週もぜひ伺いますね！',
    lastTime: '14:10',
    lastTimestamp: '2026-04-06T14:10:00',
    unread: 2,
  },
  {
    id: '2',
    name: 'スズキ',
    initial: 'ス',
    lastMessage: 'お待ちしています！',
    lastTime: '昨日',
    lastTimestamp: '2026-04-05T23:55:00',
    unread: 0,
  },
  {
    id: '3',
    name: 'サトウ',
    initial: 'サ',
    lastMessage: '今夜21時ごろ予約できますか？',
    lastTime: '18:30',
    lastTimestamp: '2026-04-06T18:30:00',
    unread: 1,
  },
  {
    id: '4',
    name: 'ナカムラ',
    initial: 'ナ',
    lastMessage: 'またのお越しをお待ちしています😊',
    lastTime: '4/3',
    lastTimestamp: '2026-04-03T01:17:00',
    unread: 0,
  },
  {
    id: '5',
    name: 'イトウ',
    initial: 'イ',
    lastMessage: 'お待ちしています！😊',
    lastTime: '4/1',
    lastTimestamp: '2026-04-01T22:05:00',
    unread: 0,
  },
  {
    id: '6',
    name: 'ヤマモト',
    initial: 'ヤ',
    lastMessage: 'ありがとうございます！楽しみにしています🙌',
    lastTime: '19:55',
    lastTimestamp: '2026-04-06T19:55:00',
    unread: 1,
  },
  {
    id: '7',
    name: 'コバヤシ',
    initial: 'コ',
    lastMessage: 'またのお越しお待ちしています😊',
    lastTime: '3/28',
    lastTimestamp: '2026-03-28T00:38:00',
    unread: 0,
  },
  {
    id: '8',
    name: 'カトウ',
    initial: 'カ',
    lastMessage: 'はい、いつでもどうぞ！',
    lastTime: '3/25',
    lastTimestamp: '2026-03-25T21:05:00',
    unread: 0,
  },
  {
    id: '9',
    name: 'ワタナベ',
    initial: 'ワ',
    lastMessage: 'お待ちしています！',
    lastTime: '3/22',
    lastTimestamp: '2026-03-22T02:12:00',
    unread: 0,
  },
  {
    id: '10',
    name: 'マツモト',
    initial: 'マ',
    lastMessage: 'ありがとうございます、またお待ちしています！',
    lastTime: '3/20',
    lastTimestamp: '2026-03-20T23:05:00',
    unread: 0,
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
};

/** 日付文字列を表示用にフォーマット (例: "2026-04-06" → "2026年4月6日（月）") */
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
export function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${WEEKDAYS[d.getDay()]}）`;
}
