/**
 * キャスト向けモバイルアプリ チャットモックデータ
 * ログインキャスト: あおい (companionId: 101)
 */

/** トーク一覧 */
export const TALK_LIST = [
  {
    id: '1',
    name: '田中さん',
    initial: '田',
    lastMessage: 'ありがとうございます😊お待ちしています！',
    lastTime: '14:10',
    unread: 2,
  },
  {
    id: '2',
    name: '鈴木さん',
    initial: '鈴',
    lastMessage: 'また来週伺いますね！',
    lastTime: '昨日',
    unread: 0,
  },
  {
    id: '3',
    name: '佐藤さん',
    initial: '佐',
    lastMessage: '今夜21時ごろ予約できますか？',
    lastTime: '4/5',
    unread: 1,
  },
  {
    id: '4',
    name: '中村さん',
    initial: '中',
    lastMessage: 'ありがとうございました',
    lastTime: '4/3',
    unread: 0,
  },
  {
    id: '5',
    name: '伊藤さん',
    initial: '伊',
    lastMessage: '先日はありがとう、また来るね',
    lastTime: '4/1',
    unread: 0,
  },
];

/**
 * 個別チャットメッセージ
 * sender: 'me' | 'partner'
 */
export const MESSAGES = {
  '1': [
    { date: '2026-04-06', messages: [
      { id: 'm1', sender: 'partner', text: 'こんばんは！今日もよろしくお願いします😊', time: '20:15', read: false },
      { id: 'm2', sender: 'me',      text: 'こちらこそ、お待ちしています！',           time: '20:17', read: true },
      { id: 'm3', sender: 'partner', text: '20時半ごろ伺いますね。シャンパン1本お願いしてもいいですか？', time: '20:19', read: false },
      { id: 'm4', sender: 'me',      text: 'もちろんです！ご用意してお待ちしますね🥂', time: '20:21', read: true },
    ]},
    { date: '2026-04-07', messages: [
      { id: 'm5', sender: 'partner', text: '昨日はありがとうございました！また来週も伺いますね', time: '14:03', read: false },
      { id: 'm6', sender: 'me',      text: 'ありがとうございます😊お待ちしています！',  time: '14:10', read: true },
    ]},
  ],
  '2': [
    { date: '2026-04-05', messages: [
      { id: 'm1', sender: 'partner', text: '今日もありがとうございました！', time: '23:50', read: false },
      { id: 'm2', sender: 'me',      text: 'こちらこそ楽しかったです😊',    time: '23:52', read: true },
      { id: 'm3', sender: 'partner', text: 'また来週伺いますね！',          time: '23:53', read: false },
    ]},
  ],
  '3': [
    { date: '2026-04-05', messages: [
      { id: 'm1', sender: 'partner', text: '今夜21時ごろ予約できますか？', time: '18:30', read: false },
    ]},
  ],
  '4': [
    { date: '2026-04-03', messages: [
      { id: 'm1', sender: 'me',      text: '本日もありがとうございました！またのご来店お待ちしています🙏', time: '01:10', read: true },
      { id: 'm2', sender: 'partner', text: 'ありがとうございました',                                     time: '01:15', read: false },
    ]},
  ],
  '5': [
    { date: '2026-04-01', messages: [
      { id: 'm1', sender: 'partner', text: '先日はありがとう、また来るね', time: '22:00', read: false },
      { id: 'm2', sender: 'me',      text: 'お待ちしています！😊',        time: '22:05', read: true },
    ]},
  ],
};

/** 日付文字列を表示用にフォーマット (例: "2026-04-06" → "2026年4月6日（月）") */
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
export function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${WEEKDAYS[d.getDay()]}）`;
}
