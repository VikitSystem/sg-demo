/**
 * report/booking/halfmodal.js
 * ハーフモーダル初期化モジュール
 */

import { initPopup } from './popup.js';

export async function initHalfModal(bookings, {
  CAR_OPTIONS, BRANDS, STAFF_OPTIONS,
  NOMINATIONS, COURSE_OPTIONS, EXTENSION_OPTIONS,
  OP_OPTIONS, TRANSPORT_FEE_OPTIONS, DISCOUNT_OPTIONS,
  DELIVERY_TYPE_OPTIONS, MEDIA_OPTIONS, CAST_OPTIONS,
}, renderRow, renderSummary) {

  const EMPTY_BOOKING = {};

  // halfmodal.html をフェッチして <body> 末尾に注入
  const htmlUrl = new URL('./halfmodal.html', import.meta.url);
  const res  = await fetch(htmlUrl);
  const html = await res.text();
  document.body.insertAdjacentHTML('beforeend', html);

  const modal           = document.getElementById('edit-modal');
  const modalBody       = document.getElementById('modal-body');
  const modalSubtitle   = document.getElementById('modal-subtitle');
  const modalActionBtns = document.getElementById('modal-action-btns');
  const btnAdd          = document.getElementById('btn-add');

  let selectedTr    = null;
  let currentBooking = null;

  // ── 開閉 ────────────────────────────────────────────────────────────────

  const modalPanel = modal.querySelector('.modal-panel');

  function outsideClickHandler(e) {
    if (!modalPanel.contains(e.target) && !isPopupOpen()) {
      closeModal();
    }
  }

  function updateCompleteBtn(done) {
    const btn = document.getElementById('btn-complete');
    if (done) {
      btn.textContent = '完了取消';
      btn.classList.remove('modal-action-btn--complete');
      btn.classList.add('modal-action-btn--cancel-complete');
    } else {
      btn.textContent = '完了';
      btn.classList.remove('modal-action-btn--cancel-complete');
      btn.classList.add('modal-action-btn--complete');
    }
  }

  function openModal(b, tr) {
    document.removeEventListener('click', outsideClickHandler);
    document.addEventListener('click', outsideClickHandler);
    if (selectedTr) selectedTr.classList.remove('is-selected');
    selectedTr    = tr ?? null;
    currentBooking = tr ? b : null;
    if (selectedTr) selectedTr.classList.add('is-selected');
    const isNew = !tr;
    modal.querySelector('.modal-label').textContent = isNew ? '予約追加' : '予約編集';
    modalSubtitle.textContent = isNew ? '新規' : `${b.time}　${b.customerName}`;
    modalActionBtns.style.display = isNew ? 'none' : 'flex';
    btnAdd.style.display = isNew ? '' : 'none';
    if (!isNew) updateCompleteBtn(b.completed);
    modalBody.innerHTML = renderForm(b);
    initFormListeners();
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('click', outsideClickHandler);
    if (selectedTr) {
      selectedTr.classList.remove('is-selected');
      selectedTr = null;
    }
  }

  document.getElementById('modal-close').addEventListener('click', closeModal);

  // ── ポップアップ初期化 ───────────────────────────────────────────────────

  const { openPopup, closePopup, isPopupOpen } = await initPopup();

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (isPopupOpen()) { closePopup(); return; }
    closeModal();
  });

  // ── フォーム値収集ヘルパー ─────────────────────────────────────────────────

  function collectForm(b) {
    b.dentatsu      = !!document.getElementById('mf-dentatsu')?.checked;
    b.heavenCheck   = !!document.getElementById('mf-heaven-check')?.checked;
    b.confirmedCall = !!document.getElementById('mf-confirmed-call')?.checked;
    b.survey        = !!document.getElementById('mf-survey')?.checked;
    b.salesReceipt  = !!document.getElementById('mf-sales-receipt')?.checked;

    b.staffId        = document.getElementById('mf-staff').value;
    b.nomination     = document.getElementById('mf-nomination').value;
    b.deliveryTypeId = document.getElementById('mf-delivery').value;
    b.carGoingId     = document.getElementById('mf-car-going').value;
    b.carReturnId    = document.getElementById('mf-car-return').value;
    b.mediaId        = document.getElementById('mf-media').value;
    b.mediaDate      = document.getElementById('mf-media-date').value || null;
    b.courseId       = document.getElementById('mf-course').value;
    b.extensionId    = document.getElementById('mf-extension').value;
    b.transportFeeId = document.getElementById('mf-transport-fee').value;
    b.discountId     = document.getElementById('mf-discount').value;

    b.time         = document.getElementById('mf-time').value;
    b.tel1         = document.getElementById('mf-tel1').value || null;
    b.tel2         = document.getElementById('mf-tel2').value || null;
    b.tel3         = document.getElementById('mf-tel3').value || null;
    b.customerName = document.getElementById('mf-customer-name').value || null;
    b.roomNo       = document.getElementById('mf-room-no').value || null;
    b.travelTime   = document.getElementById('mf-travel-time').value || null;
    b.sgLink       = document.getElementById('mf-sg-link').value || null;
    b.location     = document.getElementById('mf-location').value || null;
    b.address      = document.getElementById('mf-address').value || null;
    b.castNote     = document.getElementById('mf-cast-note').value || null;
    b.storeNote    = document.getElementById('mf-store-note').value || null;
    b.wallet       = document.getElementById('mf-wallet').value || null;

    b.options = [];
    document.querySelectorAll('.mf__op-btn.is-active').forEach(btn => {
      b.options.push(btn.dataset.id);
    });

    b.visitType   = document.getElementById('mf-visit-type').value;

    b.shopId      = document.getElementById('mf-shop-id').value;
    b.memberId    = document.getElementById('mf-member-id').value || null;
    b.companionId = document.getElementById('mf-companion-id').value;
    return b;
  }

  document.getElementById('btn-save').addEventListener('click', () => {
    if (!currentBooking || !selectedTr || !renderRow) return;
    collectForm(currentBooking);
    const b = currentBooking;

    const index = Number(selectedTr.dataset.index);
    const temp = document.createElement('tbody');
    temp.innerHTML = renderRow(b, index).trim();
    const newTr = temp.firstElementChild;
    selectedTr.replaceWith(newTr);
    selectedTr = newTr;
    selectedTr.classList.add('is-selected');

    modalSubtitle.textContent = `${b.time}　${b.customerName}`;
    renderSummary?.();
    closeModal();
  });

  document.getElementById('btn-add').addEventListener('click', () => {
    if (!renderRow) return;
    const b = collectForm({ completed: false });

    const newIndex = bookings.length;
    bookings.push(b);

    const tbody = document.getElementById('booking-tbody');
    if (tbody) {
      const temp = document.createElement('tbody');
      temp.innerHTML = renderRow(b, newIndex).trim();
      tbody.appendChild(temp.firstElementChild);
      const countEl = document.getElementById('booking-count');
      if (countEl) countEl.textContent = parseInt(countEl.textContent || '0', 10) + 1;
    }

    renderSummary?.();
    closeModal();
  });

  document.getElementById('btn-female-line').addEventListener('click', () => openPopup('femaleLine'));
  document.getElementById('btn-deli-shiji').addEventListener('click', () => openPopup('deliShiji'));

  document.getElementById('btn-complete').addEventListener('click', () => {
    if (!currentBooking || !selectedTr) return;
    currentBooking.completed = !currentBooking.completed;
    const done = currentBooking.completed;
    selectedTr.classList.toggle('is-completed', done);

    if (done) {
      selectedTr.querySelectorAll('input[type="checkbox"].tbl-chk').forEach(input => {
        const span = document.createElement('span');
        span.className = `chk-done chk-done--${input.checked ? 'on' : 'off'}`;
        span.textContent = input.checked ? '✓' : '−';
        input.replaceWith(span);
      });
      selectedTr.querySelectorAll('select').forEach(el => { el.disabled = true; });
    } else {
      selectedTr.querySelectorAll('.chk-done').forEach(span => {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'tbl-chk';
        input.checked = span.classList.contains('chk-done--on');
        span.replaceWith(input);
      });
      selectedTr.querySelectorAll('select').forEach(el => { el.disabled = false; });
    }

    updateCompleteBtn(done);
    renderSummary?.();
  });

  // ── 行クリック → モーダルを開く ─────────────────────────────────────────

  document.getElementById('booking-tbody').addEventListener('click', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'A') return;
    const tr = e.target.closest('tr');
    if (!tr) return;
    e.stopPropagation();
    openModal(bookings[Number(tr.dataset.index)], tr);
  });

  // ── フォーム描画 ─────────────────────────────────────────────────────────

  function renderForm(b) {
    const brandShopId = b.shopId || BRANDS[0]?.shopId || '';
    const brand       = BRANDS.find(br => br.shopId === brandShopId)?.label || BRANDS[0].label;

    // ── ヘルパー ──
    function f(label, ctrl, span = 1) {
      return `<div class="mf${span > 1 ? ' mf--span' : ''}">
        <label class="mf__label">${label}</label>
        <div class="mf__ctrl">${ctrl}</div>
      </div>`;
    }
    function chk(val, id = '') {
      return `<input type="checkbox" class="mf__chk"${val ? ' checked' : ''}${id ? ` id="${id}"` : ''}>`;
    }
    function txt(val, id = '') {
      return `<input type="text" class="mf__input" value="${val ?? ''}"${id ? ` id="${id}"` : ''}>`;
    }
    function ro(val, id = '') {
      return `<input type="text" class="mf__input mf__input--ro" value="${val ?? ''}"${id ? ` id="${id}"` : ''} readonly tabindex="-1">`;
    }
    // options に { id, label } オブジェクトまたは文字列を受け取る汎用 select ビルダー
    function sel(val, options, id = '') {
      const opts = options.map(o => {
        if (typeof o === 'object') return `<option value="${o.id}"${val === o.id ? ' selected' : ''}>${o.label}</option>`;
        return `<option${val === o ? ' selected' : ''}>${o}</option>`;
      }).join('');
      return `<select class="mf__select"${id ? ` id="${id}"` : ''}>${opts}</select>`;
    }
    function walletInput(val) {
      return `<input type="text" class="mf__input" id="mf-wallet" value="${val ?? ''}" placeholder="金額 or 日付 (例: 50000 / 3/31)" inputmode="text">`;
    }
    function ta(val, id = '') {
      return `<textarea class="mf__textarea"${id ? ` id="${id}"` : ''}>${val ?? ''}</textarea>`;
    }

    // ── 時間計算ユーティリティ ──
    function toMin(t) {
      if (!t || typeof t !== 'string') return null;
      const p = t.split(':');
      if (p.length !== 2) return null;
      const h = parseInt(p[0], 10), m = parseInt(p[1], 10);
      if (isNaN(h) || isNaN(m)) return null;
      return h * 60 + m;
    }
    function toTime(mins) {
      if (mins == null || isNaN(mins)) return '';
      const d = ((mins % 1440) + 1440) % 1440;
      return `${String(Math.floor(d / 60)).padStart(2, '0')}:${String(d % 60).padStart(2, '0')}`;
    }

    // ── 初期値計算 ──
    const courseOpts  = COURSE_OPTIONS[brandShopId] || [];
    const extOpts     = EXTENSION_OPTIONS[brandShopId] || [];
    const currentOps  = OP_OPTIONS[brandShopId] || [];
    const selCourse   = courseOpts.find(c => c.id === b.courseId) || courseOpts[0] || { duration: 0, price: 0 };
    const selExt      = extOpts.find(e => e.id === b.extensionId) || extOpts[0] || { duration: 0, price: 0 };
    const selOps      = (b.options || []).map(id => currentOps.find(o => o.id === id)).filter(Boolean);

    const startMin  = toMin(b.time);
    const outTime   = startMin != null ? toTime(startMin + selCourse.duration + selExt.duration) : '';
    const calcAmt   = selCourse.price + selExt.price + selOps.reduce((s, o) => s + o.price, 0);
    const ttNum     = b.travelTime != null && b.travelTime !== '' ? parseInt(b.travelTime, 10) : null;
    const calcDist  = ttNum != null && !isNaN(ttNum) && ttNum > 0 ? `${ttNum}km` : '';
    const outMin    = toMin(outTime);
    const calcPlan  = outMin != null && ttNum != null && !isNaN(ttNum) ? toTime(outMin + ttNum) : '';

    const deliveryLabel = DELIVERY_TYPE_OPTIONS.find(o => o.id === b.deliveryTypeId)?.label || '';
    function buildCastNote(loc, dt) {
      if (!loc || dt === '歩き') return '';
      return `${loc}\n\nお疲れ様です。\n上記ホテルへのデリをお願いいたします。\n時間厳守でよろしくお願いいたします。`;
    }
    const initCastNote = b.castNote != null ? b.castNote : buildCastNote(b.location, deliveryLabel);

    // ── TEL ──
    const telCtrl = `<div class="mf__tel-wrap">
      <input type="text" class="mf__input mf__tel-box" id="mf-tel1" value="${b.tel1 || ''}" maxlength="4" inputmode="numeric" pattern="[0-9]*" placeholder="090">
      <span class="mf__tel-sep">-</span>
      <input type="text" class="mf__input mf__tel-box" id="mf-tel2" value="${b.tel2 || ''}" maxlength="4" inputmode="numeric" pattern="[0-9]*" placeholder="1234">
      <span class="mf__tel-sep">-</span>
      <input type="text" class="mf__input mf__tel-box" id="mf-tel3" value="${b.tel3 || ''}" maxlength="4" inputmode="numeric" pattern="[0-9]*" placeholder="5678">
    </div>`;

    // ── 来店区分 ──
    const visitTypeOpts = ['未選択', '初回', '二回目以降'];
    const curVisitType  = b.visitType || '未選択';
    const visitCtrl = `<select class="mf__select" id="mf-visit-type">
      ${visitTypeOpts.map(o => `<option${curVisitType === o ? ' selected' : ''}>${o}</option>`).join('')}
    </select>`;

    // ── 指名区分 (ブランド連動 + 来店区分連動) ──
    const nomOpts = Object.entries(NOMINATIONS)
      .filter(([, v]) => {
        if (!v.brands.includes(brandShopId)) return false;
        if (curVisitType === '初回') return v.first_flg;
        if (curVisitType === '二回目以降') return v.second_flg;
        return true;
      })
      .map(([k]) => k);
    const nomCtrl = `<select class="mf__select" id="mf-nomination">
      ${nomOpts.map(o => `<option${b.nomination === o ? ' selected' : ''}>${o}</option>`).join('')}
    </select>`;

    // ── 媒体 + 日付 ──
    const mediaCtrl = `<div class="mf__media-wrap">
      <select class="mf__select" id="mf-media">${MEDIA_OPTIONS.map(o => `<option value="${o.id}"${b.mediaId === o.id ? ' selected' : ''}>${o.label}</option>`).join('')}</select>
      <input type="date" class="mf__input mf__media-date" id="mf-media-date" value="${b.mediaDate || ''}">
    </div>`;

    // ── コース (ブランド連動) ──
    const courseCtrl = `<select class="mf__select" id="mf-course">
      ${courseOpts.map(c => `<option value="${c.id}"${b.courseId === c.id ? ' selected' : ''}>${c.label}</option>`).join('')}
    </select>`;

    // ── 延長 (ブランド連動) ──
    const extCtrl = `<select class="mf__select" id="mf-extension">
      ${extOpts.map(e => `<option value="${e.id}"${b.extensionId === e.id ? ' selected' : ''}>${e.label}</option>`).join('')}
    </select>`;

    // ── OP トグル (ブランド連動) ──
    const selectedOpIds = b.options || [];
    const opCtrl = `<div class="mf__op-wrap">
      ${currentOps.map(op => `<button type="button" class="mf__op-btn${selectedOpIds.includes(op.id) ? ' is-active' : ''}" data-id="${op.id}">${op.label}<span class="mf__op-price">¥${op.price.toLocaleString('ja-JP')}</span></button>`).join('')}
    </div>`;

    // ── 交通費 ──
    const tfCtrl = `<select class="mf__select" id="mf-transport-fee">
      ${TRANSPORT_FEE_OPTIONS.map(o => `<option value="${o.id}"${b.transportFeeId === o.id ? ' selected' : ''}>${o.label}</option>`).join('')}
    </select>`;

    // ── 割引 (ブランド連動) ──
    const discCtrl = `<select class="mf__select" id="mf-discount">
      ${DISCOUNT_OPTIONS
        .filter(o => o.shopIds.includes(brandShopId))
        .map(o => `<option value="${o.id}"${b.discountId === o.id ? ' selected' : ''}>${o.label}</option>`)
        .join('')}
    </select>`;

    // ── 女性 (ブランド連動) ──
    const castLabels      = CAST_OPTIONS.filter(c => c.shopId === brandShopId).map(c => c.label);
    const currentCastLabel = CAST_OPTIONS.find(c => c.companionId === b.companionId)?.label || '';
    const companionId      = b.companionId || '';

    return `<div class="mf-grid">
      <div class="mf mf--span">
        <div class="mf__ctrl mf__chk-row">
          <label class="mf__chk-item">${chk(b.dentatsu, 'mf-dentatsu')}伝達</label>
          <label class="mf__chk-item">${chk(b.heavenCheck, 'mf-heaven-check')}ヘブン</label>
          <label class="mf__chk-item">${chk(b.confirmedCall, 'mf-confirmed-call')}確電</label>
          <label class="mf__chk-item">${chk(b.survey, 'mf-survey')}アンケ</label>
          <label class="mf__chk-item">${chk(b.salesReceipt, 'mf-sales-receipt')}売上受取</label>
        </div>
      </div>
      <div class="mf-divider"></div>
      ${f('ブランド',       sel(brand, BRANDS.map(br => br.label), 'mf-brand'))}
      ${f('担当',          sel(b.staffId, STAFF_OPTIONS, 'mf-staff'))}
      ${f('TEL',          telCtrl, 2)}
      ${f('お客様名',       txt(b.customerName, 'mf-customer-name'), 2)}
      ${f('来店区分',       visitCtrl)}
      ${f('指名区分',       nomCtrl)}
      ${f('媒体',          mediaCtrl, 2)}
      ${f('女性',          sel(currentCastLabel, castLabels, 'mf-cast'))}
      ${f('コース',         courseCtrl)}
      ${f('予約時間',       `<input type="text" class="mf__input" id="mf-time" value="${b.time || ''}" inputmode="numeric" maxlength="5" placeholder="HH:MM">`)}
      ${f('デリ区分',       sel(b.deliveryTypeId, DELIVERY_TYPE_OPTIONS, 'mf-delivery'))}
      ${f('OP',           opCtrl, 2)}
      ${f('交通費',         tfCtrl)}
      ${f('割引',          discCtrl)}
      ${f('延長',          extCtrl)}
      ${f('財布',          walletInput(b.wallet))}
      ${f('場所',          txt(b.location || '', 'mf-location'), 2)}
      ${f('住所',          txt(b.address || '', 'mf-address'), 2)}
      ${f('部屋番',         txt(b.roomNo, 'mf-room-no'))}
      ${f('金額',          ro(calcAmt.toLocaleString('ja-JP'), 'mf-amount'))}
      ${f('IN',           ro(b.time || '', 'mf-in'))}
      ${f('OUT',          ro(outTime, 'mf-out'))}
      ${f('女性伝達事項',    ta(initCastNote, 'mf-cast-note'), 2)}
      ${f('店舗備考',       ta(b.storeNote, 'mf-store-note'), 2)}
      ${f('行き車',         sel(b.carGoingId, CAR_OPTIONS, 'mf-car-going'))}
      ${f('帰り車',         sel(b.carReturnId, CAR_OPTIONS, 'mf-car-return'))}
      ${f('移動時間',       `<div class="mf__num-wrap"><input type="text" class="mf__input mf__input--num" id="mf-travel-time" value="${b.travelTime ?? ''}" inputmode="numeric" pattern="[0-9]*"><span class="mf__unit">分</span></div>`)}
      ${f('距離',          ro(calcDist, 'mf-distance'))}
      ${f('アウト予定時刻',  ro(calcPlan, 'mf-planned-out'))}
      ${f('shopId',        ro(brandShopId, 'mf-shop-id'))}
      ${f('memberId',      txt(b.memberId || '', 'mf-member-id'))}
      ${f('companionId',   ro(companionId, 'mf-companion-id'))}
      ${f('SGリンク',       txt(b.sgLink || 'https://sg-system.jp/', 'mf-sg-link'), 2)}
    </div>`;
  }

  // ── フォームイベント (自動計算) ─────────────────────────────────────────

  function initFormListeners() {

    function toMin(t) {
      if (!t || typeof t !== 'string') return null;
      const p = t.split(':');
      if (p.length !== 2) return null;
      const h = parseInt(p[0], 10), m = parseInt(p[1], 10);
      if (isNaN(h) || isNaN(m)) return null;
      return h * 60 + m;
    }
    function toTime(mins) {
      if (mins == null || isNaN(mins)) return '';
      const d = ((mins % 1440) + 1440) % 1440;
      return `${String(Math.floor(d / 60)).padStart(2, '0')}:${String(d % 60).padStart(2, '0')}`;
    }

    function recalc() {
      const brand       = document.getElementById('mf-brand').value;
      const brandShopId = BRANDS.find(br => br.label === brand)?.shopId || '';
      const time        = document.getElementById('mf-time').value;
      const courseVal   = document.getElementById('mf-course').value;
      const extVal      = document.getElementById('mf-extension').value;
      const ttStr       = document.getElementById('mf-travel-time').value;

      const courses    = COURSE_OPTIONS[brandShopId] || [];
      const exts       = EXTENSION_OPTIONS[brandShopId] || [];
      const currentOps = OP_OPTIONS[brandShopId] || [];
      const course     = courses.find(c => c.id === courseVal) || { duration: 0, price: 0 };
      const ext        = exts.find(e => e.id === extVal)       || { duration: 0, price: 0 };
      const ttNum      = ttStr !== '' ? parseInt(ttStr, 10) : null;

      // IN = 予約時間
      document.getElementById('mf-in').value = time;

      // OUT = 予約時間 + コース + 延長
      const startMin = toMin(time);
      const outStr   = startMin != null ? toTime(startMin + course.duration + ext.duration) : '';
      document.getElementById('mf-out').value = outStr;

      // 金額 = コース + 延長 + 選択OP合計
      let opTotal = 0;
      document.querySelectorAll('.mf__op-btn.is-active').forEach(btn => {
        const op = currentOps.find(o => o.id === btn.dataset.id);
        if (op) opTotal += op.price;
      });
      document.getElementById('mf-amount').value = (course.price + ext.price + opTotal).toLocaleString('ja-JP');

      // 距離 = 移動時間 × 1km
      document.getElementById('mf-distance').value =
        ttNum != null && !isNaN(ttNum) && ttNum > 0 ? `${ttNum}km` : '';

      // アウト予定時刻 = OUT + 移動時間
      const outMin = toMin(outStr);
      document.getElementById('mf-planned-out').value =
        outMin != null && ttNum != null && !isNaN(ttNum) ? toTime(outMin + ttNum) : '';
    }

    function updateCastNote() {
      const location = document.getElementById('mf-location').value.trim();
      const delivId  = document.getElementById('mf-delivery').value;
      const delivery = DELIVERY_TYPE_OPTIONS.find(o => o.id === delivId)?.label || '';
      const noteEl   = document.getElementById('mf-cast-note');
      if (location && delivery !== '歩き') {
        noteEl.value = `${location}\n\nお疲れ様です。\n上記ホテルへのデリをお願いいたします。\n時間厳守でよろしくお願いいたします。`;
      } else {
        noteEl.value = '';
      }
    }

    function updateBrandSelects() {
      const brand       = document.getElementById('mf-brand').value;
      const brandShopId = BRANDS.find(br => br.label === brand)?.shopId || '';

      // shopId
      document.getElementById('mf-shop-id').value = brandShopId;

      // 指名区分
      const visitType = document.getElementById('mf-visit-type').value;
      const nomSel = document.getElementById('mf-nomination');
      const curNom = nomSel.value;
      nomSel.innerHTML = Object.entries(NOMINATIONS)
        .filter(([, v]) => {
          if (!v.brands.includes(brandShopId)) return false;
          if (visitType === '初回') return v.first_flg;
          if (visitType === '二回目以降') return v.second_flg;
          return true;
        })
        .map(([k]) => `<option${k === curNom ? ' selected' : ''}>${k}</option>`).join('');

      // コース
      const courseSel = document.getElementById('mf-course');
      const curCourse = courseSel.value;
      courseSel.innerHTML = (COURSE_OPTIONS[brandShopId] || [])
        .map(c => `<option value="${c.id}"${c.id === curCourse ? ' selected' : ''}>${c.label}</option>`).join('');

      // 延長
      const extSel = document.getElementById('mf-extension');
      const curExt = extSel.value;
      extSel.innerHTML = (EXTENSION_OPTIONS[brandShopId] || [])
        .map(e => `<option value="${e.id}"${e.id === curExt ? ' selected' : ''}>${e.label}</option>`).join('');

      // 女性 (shopId でフィルタ)
      const castSel = document.getElementById('mf-cast');
      const curCast = castSel.value;
      castSel.innerHTML = CAST_OPTIONS
        .filter(c => c.shopId === brandShopId)
        .map(c => `<option${c.label === curCast ? ' selected' : ''}>${c.label}</option>`).join('');
      const newCast = CAST_OPTIONS.find(c => c.label === castSel.value);
      document.getElementById('mf-companion-id').value = newCast?.companionId || '';

      // OP ボタン更新 (ブランド連動)
      const opWrap = document.querySelector('.mf__op-wrap');
      if (opWrap) {
        opWrap.innerHTML = (OP_OPTIONS[brandShopId] || [])
          .map(op => `<button type="button" class="mf__op-btn" data-id="${op.id}">${op.label}<span class="mf__op-price">¥${op.price.toLocaleString('ja-JP')}</span></button>`)
          .join('');
        opWrap.querySelectorAll('.mf__op-btn').forEach(btn => {
          btn.addEventListener('click', () => { btn.classList.toggle('is-active'); recalc(); });
        });
      }

      // 割引 (shopId でフィルタ)
      const discSel = document.getElementById('mf-discount');
      const curDisc = discSel.value;
      discSel.innerHTML = DISCOUNT_OPTIONS
        .filter(o => o.shopIds.includes(brandShopId))
        .map(o => `<option value="${o.id}"${o.id === curDisc ? ' selected' : ''}>${o.label}</option>`).join('');

      recalc();
    }

    document.getElementById('mf-brand').addEventListener('change', updateBrandSelects);
    document.getElementById('mf-visit-type').addEventListener('change', () => {
      const brand       = document.getElementById('mf-brand').value;
      const brandShopId = BRANDS.find(br => br.label === brand)?.shopId || '';
      const visitType   = document.getElementById('mf-visit-type').value;
      const nomSel      = document.getElementById('mf-nomination');
      const curNom      = nomSel.value;
      nomSel.innerHTML  = Object.entries(NOMINATIONS)
        .filter(([, v]) => {
          if (!v.brands.includes(brandShopId)) return false;
          if (visitType === '初回') return v.first_flg;
          if (visitType === '二回目以降') return v.second_flg;
          return true;
        })
        .map(([k]) => `<option${k === curNom ? ' selected' : ''}>${k}</option>`).join('');
    });
    document.getElementById('mf-cast').addEventListener('change', () => {
      const cast = CAST_OPTIONS.find(c => c.label === document.getElementById('mf-cast').value);
      document.getElementById('mf-companion-id').value = cast?.companionId || '';
    });
    document.getElementById('mf-time').addEventListener('input', e => {
      let v = e.target.value.replace(/[^0-9]/g, '');
      if (v.length > 2) v = v.slice(0, 2) + ':' + v.slice(2, 4);
      e.target.value = v;
      recalc();
    });
    document.getElementById('mf-course').addEventListener('change', recalc);
    document.getElementById('mf-extension').addEventListener('change', recalc);

    document.getElementById('mf-travel-time').addEventListener('input', recalc);
    document.getElementById('mf-location').addEventListener('input', updateCastNote);
    document.getElementById('mf-delivery').addEventListener('change', () => { updateCastNote(); recalc(); });
    document.querySelectorAll('.mf__op-btn').forEach(btn => {
      btn.addEventListener('click', () => { btn.classList.toggle('is-active'); recalc(); });
    });
  }

  return {
    openModal,
    openNewModal: () => openModal(EMPTY_BOOKING, null),
  };
}
