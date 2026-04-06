/**
 * 予約詳細モーダル
 *
 * 使い方:
 *   import { initBookingModal, openBookingModal } from './modal/booking-modal.js';
 *   initBookingModal({ onStart, onEnd });
 *   // クリック時に openBookingModal(booking) を呼ぶ
 */

const MODAL_HTML = `
<div class="modal-overlay" id="modal-overlay"></div>
<div class="modal-sheet" id="modal-sheet" role="dialog" aria-modal="true">
  <div class="modal-sheet__handle"></div>
  <div class="modal-sheet__header">
    <div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:4px;" id="modal-time"></div>
      <div class="modal-sheet__title" id="modal-name"></div>
    </div>
    <button class="modal-sheet__close" id="modal-close" aria-label="閉じる">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>
  <div class="modal-sheet__body">
    <div id="modal-note" style="display:none;font-size:12px;color:var(--amber);margin-bottom:12px;"></div>
    <div class="modal-detail-grid" id="modal-grid"></div>
  </div>
  <div class="modal-sheet__footer">
    <button class="modal-action-btn modal-action-btn--start" id="modal-btn-start">接客開始</button>
    <button class="modal-action-btn modal-action-btn--end"   id="modal-btn-end">接客終了</button>
  </div>
</div>`;

let _overlay, _sheet, _btnStart, _btnEnd;
let _initialized = false;

export function closeBookingModal() {
  _overlay?.classList.remove('is-open');
  _sheet?.classList.remove('is-open');
}

/**
 * モーダルを初期化する（1回だけ呼ぶ）
 * @param {{ onStart?: (booking) => void, onEnd?: (booking) => void }} callbacks
 */
export function initBookingModal({ onStart, onEnd } = {}) {
  if (_initialized) return;
  _initialized = true;

  document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

  _overlay  = document.getElementById('modal-overlay');
  _sheet    = document.getElementById('modal-sheet');
  _btnStart = document.getElementById('modal-btn-start');
  _btnEnd   = document.getElementById('modal-btn-end');

  _overlay.addEventListener('click', closeBookingModal);
  document.getElementById('modal-close').addEventListener('click', closeBookingModal);

  let _current = null;

  _btnStart.addEventListener('click', () => {
    onStart?.(_current);
    closeBookingModal();
  });
  _btnEnd.addEventListener('click', () => {
    onEnd?.(_current);
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
 */
export function openBookingModal(booking) {
  _initCurrent?.(booking);

  // ヘッダー
  document.getElementById('modal-time').textContent =
    `${booking.time} 〜 ${booking.outTime}`;
  document.getElementById('modal-name').textContent =
    `${booking.customerName} 様`;

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
  // pending  → 接客開始 のみ有効
  // active   → 接客終了 のみ有効
  // completed→ 両方無効
  _btnStart.disabled = booking.status !== 'pending';
  _btnEnd.disabled   = booking.status !== 'active';

  _overlay.classList.add('is-open');
  _sheet.classList.add('is-open');
}
