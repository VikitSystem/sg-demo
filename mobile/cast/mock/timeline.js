/**
 * 直近の打刻履歴
 * type: 'working'=出勤中, 'completed'=退勤済, 'absent'=欠勤
 * isToday: true のエントリは退勤打刻で動的更新される
 */
export const RECENT_LOGS = [
  { date: '4/6', day: '月', type: 'working',   start: '18:30',                isToday: true },
  { date: '4/5', day: '日', type: 'completed',  start: '19:00', end: '03:00', hours: 8     },
  { date: '4/4', day: '土', type: 'completed',  start: '18:30', end: '01:00', hours: 6.5,  late: true },
  { date: '4/3', day: '金', type: 'off'                                                      },
  { date: '4/2', day: '木', type: 'completed',  start: '19:00', end: '01:00', hours: 6     },
  { date: '4/1', day: '水', type: 'completed',  start: '19:00', end: '23:00', hours: 4     },
];

/**
 * 今月のシフトデータ
 * type: 'shift' | 'off' | 'unsubmitted'
 * isToday: true のエントリが今日として強調表示される
 */
export const MONTHLY_SHIFTS = [
  { date: '4/1',  day: '水', type: 'shift',       start: '19:00', end: '23:00' },
  { date: '4/2',  day: '木', type: 'shift',       start: '19:00', end: '01:00' },
  { date: '4/3',  day: '金', type: 'off' },
  { date: '4/4',  day: '土', type: 'shift',       start: '18:00', end: '01:00' },
  { date: '4/5',  day: '日', type: 'shift',       start: '19:00', end: '03:00' },
  { date: '4/6',  day: '月', type: 'shift',       start: '18:30', end: '01:00', isToday: true },
  { date: '4/7',  day: '火', type: 'shift',       start: '19:00', end: '01:00' },
  { date: '4/8',  day: '水', type: 'off' },
  { date: '4/9',  day: '木', type: 'shift',       start: '19:00', end: '01:00' },
  { date: '4/10', day: '金', type: 'unsubmitted' },
  { date: '4/11', day: '土', type: 'unsubmitted' },
  { date: '4/12', day: '日', type: 'unsubmitted' },
  { date: '4/13', day: '月', type: 'unsubmitted' },
  { date: '4/14', day: '火', type: 'unsubmitted' },
  { date: '4/15', day: '水', type: 'unsubmitted' },
  { date: '4/16', day: '木', type: 'unsubmitted' },
  { date: '4/17', day: '金', type: 'unsubmitted' },
  { date: '4/18', day: '土', type: 'unsubmitted' },
  { date: '4/19', day: '日', type: 'unsubmitted' },
  { date: '4/20', day: '月', type: 'unsubmitted' },
  { date: '4/21', day: '火', type: 'unsubmitted' },
  { date: '4/22', day: '水', type: 'unsubmitted' },
  { date: '4/23', day: '木', type: 'unsubmitted' },
  { date: '4/24', day: '金', type: 'unsubmitted' },
  { date: '4/25', day: '土', type: 'unsubmitted' },
  { date: '4/26', day: '日', type: 'unsubmitted' },
  { date: '4/27', day: '月', type: 'unsubmitted' },
  { date: '4/28', day: '火', type: 'unsubmitted' },
  { date: '4/29', day: '水', type: 'unsubmitted' },
  { date: '4/30', day: '木', type: 'unsubmitted' },
];
