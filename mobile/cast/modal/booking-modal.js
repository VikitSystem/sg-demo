/**
 * 予約詳細モーダル
 *
 * 使い方:
 *   import { initBookingModal, openBookingModal } from './modal/booking-modal.js';
 *   initBookingModal({ onStart, onEnd });
 *   // クリック時に openBookingModal(booking) を呼ぶ
 */
import { TALK_LIST } from '../mock/chat.js';
import { OP_OPTIONS } from '../../../mock/bookingselect.js';

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
        <a id="modal-btn-store-chat" href="#" style="display:none;font-size:12px;color:var(--green);background:transparent;border:1px solid rgba(95,226,162,0.4);border-radius:4px;padding:4px 12px;text-decoration:none;white-space:nowrap;font-family:var(--font);">予約</a>
        <a id="modal-btn-chat" href="#" style="display:none;font-size:12px;color:var(--blue);background:transparent;border:1px solid rgba(122,162,255,0.4);border-radius:4px;padding:4px 12px;text-decoration:none;white-space:nowrap;font-family:var(--font);">顧客</a>
      </div>
    </div>
  </div>
  <div class="modal-sheet__body">
    <div id="modal-note" style="display:none;font-size:12px;color:var(--amber);margin-bottom:12px;"></div>
    <div class="modal-detail-grid" id="modal-grid"></div>
    <!-- オプション追加モード時に表示 -->
    <div id="modal-add-area" style="display:none;margin-top:12px;border-top:1px solid var(--line-2);padding-top:12px;">
      <div style="font-size:11px;color:var(--dim);margin-bottom:6px;">延長</div>
      <div id="modal-ext-btns" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;"></div>
      <div style="font-size:11px;color:var(--dim);margin-bottom:6px;">オプション</div>
      <div id="modal-op-btns" style="display:flex;flex-wrap:wrap;gap:6px;"></div>
    </div>
  </div>
  <div class="modal-sheet__footer">
    <button class="modal-action-btn modal-action-btn--cancel" id="modal-btn-add-op">オプション追加</button>
    <button class="modal-action-btn modal-action-btn--cancel" id="modal-btn-add-cancel" style="display:none;">キャンセル</button>
    <button class="modal-action-btn modal-action-btn--end"    id="modal-btn-add-confirm" style="display:none;">追加</button>
    <button class="modal-action-btn modal-action-btn--start" id="modal-btn-start">接客開始</button>
    <button class="modal-action-btn modal-action-btn--end"   id="modal-btn-end">接客終了</button>
    <button class="modal-action-btn modal-action-btn--cancel" id="modal-btn-cancel" style="display:none;">完了取消</button>
  </div>
</div>`;

let _overlay, _sheet, _btnStart, _btnEnd, _btnCancel, _btnChat, _btnStoreChat, _btnDriverChat, _btnAddOp, _btnAddConfirm, _btnAddCancel;
let _initialized = false;
let _lastBooking = null;
let _lastDisableStart = false;
let _addMode = false;
let _selectedItems = null;

export function closeBookingModal() {
  _overlay?.classList.remove('is-open');
  _sheet?.classList.remove('is-open');
}

function _applyActionBtns() {
  const b = _lastBooking;
  if (!b) return;
  const s = b.status;
  // pending  : オプション追加 + 接客開始
  // active   : オプション追加 + 接客終了
  // completed: 完了取消 のみ
  _btnAddOp.style.display  = s === 'completed' ? 'none' : '';
  _btnStart.style.display  = s === 'pending'   ? ''     : 'none';
  _btnEnd.style.display    = s === 'active'    ? ''     : 'none';
  _btnCancel.style.display = s === 'completed' ? ''     : 'none';
  _btnStart.disabled = _lastDisableStart;
}

function _enterAddMode() {
  _addMode = true;
  _btnAddOp.style.display      = 'none';
  _btnAddCancel.style.display  = '';
  _btnAddConfirm.style.display = '';
  document.getElementById('modal-add-area').style.display = '';
  _btnStart.style.display  = 'none';
  _btnEnd.style.display    = 'none';
}

function _exitAddMode(cancel = false) {
  _addMode = false;
  _btnAddOp.style.display      = '';
  _btnAddCancel.style.display  = 'none';
  _btnAddConfirm.style.display = 'none';
  document.getElementById('modal-add-area').style.display = 'none';
  if (cancel) {
    _selectedItems?.clear();
    const cell = document.getElementById('modal-op-cell');
    if (cell) cell.textContent = 'なし';
  }
  _applyActionBtns();
}

/**
 * モーダルを初期化する（1回だけ呼ぶ）
 */
export function initBookingModal({ onStart, onEnd, onCancel } = {}) {
  if (_initialized) return;
  _initialized = true;

  document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

  _overlay        = document.getElementById('modal-overlay');
  _sheet          = document.getElementById('modal-sheet');
  _btnStart       = document.getElementById('modal-btn-start');
  _btnEnd         = document.getElementById('modal-btn-end');
  _btnCancel      = document.getElementById('modal-btn-cancel');
  _btnChat        = document.getElementById('modal-btn-chat');
  _btnStoreChat   = document.getElementById('modal-btn-store-chat');
  _btnDriverChat  = document.getElementById('modal-btn-driver-chat');
  _btnAddOp       = document.getElementById('modal-btn-add-op');
  _btnAddConfirm  = document.getElementById('modal-btn-add-confirm');
  _btnAddCancel   = document.getElementById('modal-btn-add-cancel');

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
  _btnAddOp.addEventListener('click', () => { _enterAddMode(); });
  _btnAddCancel.addEventListener('click', () => { _exitAddMode(true); });
  _btnAddConfirm.addEventListener('click', () => { _exitAddMode(false); });

  _initCurrent = v => { _current = v; };
}

// initBookingModal 内の _current をセットするための内部フック
let _initCurrent = null;

/**
 * 予約詳細モーダルを開く
 */
export function openBookingModal(booking, { disableStart = false } = {}) {
  _initCurrent?.(booking);
  _lastBooking      = booking;
  _lastDisableStart = disableStart;

  // 追加モードをリセット
  _addMode = false;
  _btnAddOp.style.display      = '';
  _btnAddConfirm.style.display = 'none';
  _btnAddCancel.style.display  = 'none';
  document.getElementById('modal-add-area').style.display = 'none';

  // ヘッダー
  document.getElementById('modal-time').textContent = `${booking.time} 〜 ${booking.outTime}`;
  const talk = TALK_LIST.find(t => t.type === 'customer' && t.name === booking.customerName);
  document.getElementById('modal-name').textContent = `${booking.customerName} 様`;

  if (talk) {
    const rp = location.pathname.split('/').pop() || 'home.html';
    _btnChat.href = `chat_room.html?id=${talk.id}&returnPage=${rp}&returnModal=${booking.id}`;
    _btnChat.style.display = '';
  } else {
    _btnChat.style.display = 'none';
  }
  if (booking.storeChatId) {
    const rp = location.pathname.split('/').pop() || 'home.html';
    _btnStoreChat.href = `chat_room.html?id=${booking.storeChatId}&returnPage=${rp}&returnModal=${booking.id}`;
    _btnStoreChat.style.display = '';
  } else {
    _btnStoreChat.style.display = 'none';
  }
  if (booking.driverChatId) {
    const rp = location.pathname.split('/').pop() || 'home.html';
    _btnDriverChat.href = `chat_room.html?id=${booking.driverChatId}&returnPage=${rp}&returnModal=${booking.id}`;
    _btnDriverChat.style.display = '';
  } else {
    _btnDriverChat.style.display = 'none';
  }

  // オプション・延長 トグルボタン（追加モード用）
  const opContainer = document.getElementById('modal-op-btns');
  opContainer.innerHTML = '';
  _selectedItems = new Set();

  function updateOpCell() {
    const cell = document.getElementById('modal-op-cell');
    if (cell) cell.textContent = _selectedItems.size ? [..._selectedItems].join(' / ') : 'なし';
  }

  const BTN_STYLE = 'background:var(--deep);border:1px solid var(--line);color:var(--muted);border-radius:4px;padding:4px 10px;font-size:12px;cursor:pointer;font-family:var(--font);transition:background 0.15s,border-color 0.15s,color 0.15s;';

  function makeToggleBtn(label) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.style.cssText = BTN_STYLE;
    btn.dataset.active = '0';
    btn.addEventListener('click', () => {
      const on = btn.dataset.active === '1';
      btn.dataset.active = on ? '0' : '1';
      btn.style.background  = on ? 'var(--deep)'             : 'rgba(122,162,255,0.14)';
      btn.style.borderColor = on ? 'var(--line)'             : 'var(--blue)';
      btn.style.color       = on ? 'var(--muted)'            : 'var(--blue)';
      on ? _selectedItems.delete(label) : _selectedItems.add(label);
      updateOpCell();
    });
    return btn;
  }

  // 延長ボタン（30分 / 1時間）
  const extContainer = document.getElementById('modal-ext-btns');
  extContainer.innerHTML = '';
  ['30分', '1時間'].forEach(label => {
    extContainer.appendChild(makeToggleBtn(label));
  });

  // OPボタン
  opContainer.innerHTML = '';
  (OP_OPTIONS[booking.shopId] ?? []).forEach(op => {
    opContainer.appendChild(makeToggleBtn(op.label));
  });

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
    ['コース',       booking.courseLabel,            null],
    ['延長',         booking.extensionLabel,         null],
    ['デリバリー',   booking.deliveryLabel,          null],
    ['担当スタッフ', booking.staffLabel,             null],
    ['送迎（往）',   booking.carGoingLabel,          null],
    ['送迎（帰）',   booking.carReturnLabel,         null],
    ['指名',         booking.nominationLabel ?? '—', null],
    ['オプション',   'なし',                         'modal-op-cell'],
  ];
  document.getElementById('modal-grid').innerHTML = cells.map(([label, value, id]) =>
    `<div class="modal-detail-cell">
      <div class="modal-detail-cell__label">${label}</div>
      <div class="modal-detail-cell__value"${id ? ` id="${id}"` : ''}>${value}</div>
    </div>`
  ).join('');

  // ボタン状態
  _applyActionBtns();

  _overlay.classList.add('is-open');
  _sheet.classList.add('is-open');
}
