/**
 * 予約詳細モーダル
 *
 * 使い方:
 *   import { initBookingModal, openBookingModal } from './modal/booking-modal.js';
 *   initBookingModal({ onStart, onEnd });
 *   // クリック時に openBookingModal(booking) を呼ぶ
 */
import { TALK_LIST } from '../mock/chat.js';

const MODAL_HTML = `
<div class="modal-overlay" id="modal-overlay"></div>
<div class="modal-sheet" id="modal-sheet" role="dialog" aria-modal="true">
  <div class="modal-sheet__handle"></div>
  <div class="modal-sheet__header">
    <div style="display:flex;align-items:center;justify-content:space-between;flex:1;gap:12px;">
      <div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:4px;" id="modal-time"></div>
        <div class="modal-sheet__title" id="modal-name"></div>
      </div>
      <div style="display:flex;gap:6px;flex-shrink:0;">
        <a id="modal-btn-driver-chat" href="#" style="display:none;font-size:12px;color:var(--amber);background:transparent;border:1px solid rgba(255,194,107,0.4);border-radius:4px;padding:4px 12px;text-decoration:none;white-space:nowrap;font-family:var(--font);">ドライバー</a>
        <a id="modal-btn-store-chat" href="#" style="display:none;font-size:12px;color:var(--green);background:transparent;border:1px solid rgba(95,226,162,0.4);border-radius:4px;padding:4px 12px;text-decoration:none;white-space:nowrap;font-family:var(--font);">予約チャット</a>
        <a id="modal-btn-chat" href="#" style="display:none;font-size:12px;color:var(--blue);background:transparent;border:1px solid rgba(122,162,255,0.4);border-radius:4px;padding:4px 12px;text-decoration:none;white-space:nowrap;font-family:var(--font);">顧客チャット</a>
      </div>
    </div>
  </div>
  <div class="modal-sheet__body">
    <div id="modal-note" style="display:none;font-size:12px;color:var(--amber);margin-bottom:12px;"></div>
    <div class="modal-detail-grid" id="modal-grid"></div>
  </div>
  <div class="modal-sheet__footer">
    <button class="modal-action-btn modal-action-btn--start" id="modal-btn-start">接客開始</button>
    <button class="modal-action-btn modal-action-btn--end"   id="modal-btn-end">接客終了</button>
    <button class="modal-action-btn modal-action-btn--cancel" id="modal-btn-cancel" style="display:none;">完了取消</button>
  </div>
</div>`;

let _overlay, _sheet, _btnStart, _btnEnd, _btnCancel, _btnChat, _btnStoreChat, _btnDriverChat;
let _initialized = false;

export function closeBookingModal() {
  _overlay?.classList.remove('is-open');
  _sheet?.classList.remove('is-open');
}

/**
 * モーダルを初期化する（1回だけ呼ぶ）
 * @param {{ onStart?: (booking) => void, onEnd?: (booking) => void, onCancel?: (booking) => void }} callbacks
 */
export function initBookingModal({ onStart, onEnd, onCancel } = {}) {
  if (_initialized) return;
  _initialized = true;

  document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

  _overlay   = document.getElementById('modal-overlay');
  _sheet     = document.getElementById('modal-sheet');
  _btnStart  = document.getElementById('modal-btn-start');
  _btnEnd    = document.getElementById('modal-btn-end');
  _btnCancel    = document.getElementById('modal-btn-cancel');
  _btnChat        = document.getElementById('modal-btn-chat');
  _btnStoreChat   = document.getElementById('modal-btn-store-chat');
  _btnDriverChat  = document.getElementById('modal-btn-driver-chat');

  _overlay.addEventListener('click', closeBookingModal);

  let _current = null;

  _btnStart.addEventListener('click', () => {
    onStart?.(_current);
    closeBookingModal();
  });
  _btnEnd.addEventListener('click', () => {
    onEnd?.(_current);
    closeBookingModal();
  });
  _btnCancel.addEventListener('click', () => {
    onCancel?.(_current);
    closeBookingModal();
  });

  // openBookingModal が _current を参照できるよう再代入できる仕組みにする
  _initCurrent = v => { _current = v; };
}

// initBookingModal 内の _current をセットするための内部フック
let _initCurrent = null;

/**
 * 予約詳細モーダルを開く
 * @param {object} booking - TODAY_BOOKINGS の1エントリ
 * @param {{ disableStart?: boolean }} options
 */
export function openBookingModal(booking, { disableStart = false } = {}) {
  _initCurrent?.(booking);

  // ヘッダー
  document.getElementById('modal-time').textContent =
    `${booking.time} 〜 ${booking.outTime}`;
  const nameEl = document.getElementById('modal-name');
  const talk = TALK_LIST.find(t => t.type === 'customer' && t.name === booking.customerName);
  nameEl.textContent = `${booking.customerName} 様`;
  if (talk) {
    const _returnPage = location.pathname.split('/').pop() || 'home.html';
    _btnChat.href = `chat_room.html?id=${talk.id}&returnPage=${_returnPage}&returnModal=${booking.id}`;
    _btnChat.style.display = '';
  } else {
    _btnChat.style.display = 'none';
  }
  if (booking.storeChatId) {
    const returnPage = location.pathname.split('/').pop() || 'home.html';
    _btnStoreChat.href = `chat_room.html?id=${booking.storeChatId}&returnPage=${returnPage}&returnModal=${booking.id}`;
    _btnStoreChat.style.display = '';
  } else {
    _btnStoreChat.style.display = 'none';
  }
  if (booking.driverChatId) {
    const returnPage = location.pathname.split('/').pop() || 'home.html';
    _btnDriverChat.href = `chat_room.html?id=${booking.driverChatId}&returnPage=${returnPage}&returnModal=${booking.id}`;
    _btnDriverChat.style.display = '';
  } else {
    _btnDriverChat.style.display = 'none';
  }

  // ノート
  const noteEl = document.getElementById('modal-note');
  if (booking.note) {
    noteEl.textContent = `📝 ${booking.note}`;
    noteEl.style.display = '';
  } else {
    noteEl.style.display = 'none';
  }

  // 詳細グリッド
  const cells = [
    ['コース',       booking.courseLabel],
    ['延長',         booking.extensionLabel],
    ['デリバリー',   booking.deliveryLabel],
    ['担当スタッフ', booking.staffLabel],
    ['送迎（往）',   booking.carGoingLabel],
    ['送迎（帰）',   booking.carReturnLabel],
  ];
  document.getElementById('modal-grid').innerHTML = cells.map(([label, value]) =>
    `<div class="modal-detail-cell">
      <div class="modal-detail-cell__label">${label}</div>
      <div class="modal-detail-cell__value">${value}</div>
    </div>`
  ).join('');

  // ボタン状態
  // pending   → 接客開始 のみ表示
  // active    → 接客終了 のみ表示
  // completed → 完了取消 のみ表示（全幅）
  const isCompleted = booking.status === 'completed';
  _btnStart.style.display  = isCompleted ? 'none' : '';
  _btnEnd.style.display    = isCompleted ? 'none' : '';
  _btnCancel.style.display = isCompleted ? '' : 'none';
  _btnStart.disabled = booking.status !== 'pending' || disableStart;
  _btnEnd.disabled   = booking.status !== 'active';

  _overlay.classList.add('is-open');
  _sheet.classList.add('is-open');
}
