import { initHalfModal } from './booking/halfmodal.js';
import { initLeftModal } from './booking/left-halfmodal.js';

// ─── テーブルヘッダー追従 ──────────────────────────────────────────────────────
{
  const TOPBAR_H = 56;
  let frame = null;
  let clone = null;

  function syncClone() {
    const wrap = document.querySelector('.table-wrap');
    if (!wrap || !clone) return;
    const rect = wrap.getBoundingClientRect();
    const theadH = wrap.querySelector('thead').getBoundingClientRect().height;
    const visible = rect.top < TOPBAR_H && rect.bottom > TOPBAR_H + theadH;
    if (visible) {
      clone.style.display = '';
      clone.style.top = TOPBAR_H + 'px';
      clone.style.left = rect.left + 'px';
      clone.style.width = wrap.offsetWidth + 'px';
      // 横スクロール同期
      clone.querySelector('table').style.transform = `translateX(-${wrap.scrollLeft}px)`;
    } else {
      clone.style.display = 'none';
    }
  }

  function buildClone() {
    const wrap = document.querySelector('.table-wrap');
    if (!wrap) return;
    const thead = wrap.querySelector('thead');
    if (!thead) return;

    clone = document.createElement('div');
    clone.style.cssText = `
      position: fixed;
      z-index: 50;
      overflow: hidden;
      pointer-events: none;
      background: #0d1019;
      display: none;
    `;

    const tbl = document.createElement('table');
    tbl.className = 'booking-table';
    tbl.style.cssText = 'margin: 0; white-space: nowrap; table-layout: fixed;';
    tbl.appendChild(thead.cloneNode(true));
    clone.appendChild(tbl);
    document.body.appendChild(clone);

    // カラム幅を元テーブルの th から同期
    function syncWidths() {
      const srcThs = wrap.querySelectorAll('thead th');
      const dstThs = clone.querySelectorAll('thead th');
      srcThs.forEach((th, i) => {
        if (dstThs[i]) dstThs[i].style.width = th.getBoundingClientRect().width + 'px';
      });
    }

    const ro = new ResizeObserver(syncWidths);
    ro.observe(wrap.querySelector('table'));
    syncWidths();

    wrap.addEventListener('scroll', () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = null; syncClone(); });
    }, { passive: true });

    syncClone();
  }

  function onScroll() {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = null; syncClone(); });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // DOM 準備後にクローンを生成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildClone);
  } else {
    buildClone();
  }
}

// ─── 列プリセット ─────────────────────────────────────────────────────────────
// 列番号は index.html の <th> 順（1始まり）
const PRESET_COLS = {
  '監査項目': new Set([1,4,5,9,10,13,14,16,17,18,19,20,24,25,26,37,38,39,40,41,42,43,44,45]),
  '連携項目': new Set([1,4,9,10,14,15,16,17,18,19,20,21,24,25,26,29,30,34,35,36,37]),
  '作業項目': new Set([1,2,3,4,5,7,9,10,11,12,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,37]),
};
const TOTAL_COLS = 45;
const activePresets = new Set(['全項目']);

function applyColVisibility() {
  let styleEl = document.getElementById('col-preset-style');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'col-preset-style';
    document.head.appendChild(styleEl);
  }
  if (activePresets.has('全項目')) { styleEl.textContent = ''; return; }
  const shown = new Set();
  activePresets.forEach(name => PRESET_COLS[name].forEach(i => shown.add(i)));
  const hidden = [];
  for (let i = 1; i <= TOTAL_COLS; i++) { if (!shown.has(i)) hidden.push(i); }
  styleEl.textContent = hidden.map(i =>
    `.booking-table th:nth-child(${i}), .booking-table td:nth-child(${i}) { display: none; }`
  ).join('\n');
}

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.preset;
    if (name === '全項目') {
      activePresets.clear();
      activePresets.add('全項目');
    } else {
      activePresets.delete('全項目');
      if (activePresets.has(name)) {
        activePresets.delete(name);
        if (activePresets.size === 0) activePresets.add('全項目');
      } else {
        activePresets.add(name);
      }
    }
    document.querySelectorAll('.preset-btn').forEach(b =>
      b.classList.toggle('is-active', activePresets.has(b.dataset.preset))
    );
    applyColVisibility();
  });
});

// ─── index.html: 予約一覧テーブル ────────────────────────────────────────────

if (document.getElementById('booking-tbody')) {
  const { bookings } = await import('./mock/bookings.js');
  const {
    CAR_OPTIONS, BRANDS, STAFF_OPTIONS,
    NOMINATIONS, COURSE_OPTIONS, EXTENSION_OPTIONS,
    OP_OPTIONS, TRANSPORT_FEE_OPTIONS, DISCOUNT_OPTIONS,
    DELIVERY_TYPE_OPTIONS, MEDIA_OPTIONS, CAST_OPTIONS,
  } = await import('./mock/bookingselect.js');

  // ── フィルターセレクトを動的生成 ──────────────────────────────────────────
  {
    const brandSel = document.getElementById('filter-brand');
    BRANDS.forEach(br => {
      const opt = document.createElement('option');
      opt.value = br.label;
      opt.textContent = br.label;
      brandSel.appendChild(opt);
    });

    const staffSel = document.getElementById('filter-staff');
    STAFF_OPTIONS.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o.label;
      opt.textContent = o.label;
      staffSel.appendChild(opt);
    });
  }

  // ── テーブル描画ヘルパー ──────────────────────────────────────────────────

  function dim(val) {
    if (val == null || val === '') return `<span class="cell-dim">-</span>`;
    return val;
  }

  function chkBox(checked, disabled = false) {
    if (disabled) {
      return checked
        ? `<span class="chk-done chk-done--on">✓</span>`
        : `<span class="chk-done chk-done--off">−</span>`;
    }
    return `<input type="checkbox" class="tbl-chk"${checked ? ' checked' : ''}>`;
  }

  function walletCell(val) {
    if (val == null || val === '') return `<span class="cell-dim">-</span>`;
    return `<span class="wallet-val">${val}</span>`;
  }

  function opText(shopId, options) {
    if (!options || options.length === 0) return `<span class="cell-dim">-</span>`;
    const currentOps = OP_OPTIONS[shopId] || [];
    return options.map(id => {
      const op = currentOps.find(o => o.id === id);
      return op ? `<span class="op-tag">${op.label}</span>` : '';
    }).filter(Boolean).join('');
  }

  function carSelect(val, disabled = false) {
    const opts = CAR_OPTIONS.map(o =>
      `<option value="${o.id}"${val === o.id ? ' selected' : ''}>${o.label}</option>`
    ).join('');
    return `<select class="tbl-select"${disabled ? ' disabled' : ''}>${opts}</select>`;
  }

  function truncate(val) {
    if (val == null || val === '') return `<span class="cell-dim">-</span>`;
    const text = val.replace(/\n/g, ' ').trim();
    return text.length > 10 ? text.slice(0, 10) + '......' : text;
  }

  function noteCell(val) {
    return `<td class="cell-note">${truncate(val)}</td>`;
  }

  function calcBreakdown(b) {
    const fees       = NOMINATIONS[b.nomination] || { membershipFee: 0, nominationFee: 0, specialNominationFee: 0 };
    const courseOpts = COURSE_OPTIONS[b.shopId] || [];
    const extOpts    = EXTENSION_OPTIONS[b.shopId] || [];
    const currentOps = OP_OPTIONS[b.shopId] || [];
    const selCourse  = courseOpts.find(c => c.id === b.courseId) || { price: 0 };
    const selExt     = extOpts.find(e => e.id === b.extensionId) || { price: 0 };
    const opTotal    = (b.options || []).reduce((sum, id) => {
      const op = currentOps.find(o => o.id === id);
      return sum + (op ? op.price : 0);
    }, 0);
    return {
      membershipFee:        fees.membershipFee,
      nominationFee:        fees.nominationFee,
      specialNominationFee: fees.specialNominationFee,
      coursePrice:          selCourse.price,
      extensionPrice:       selExt.price,
      opTotal,
    };
  }

  function priceCell(val, negative = false) {
    if (val === 0) return `<td class="cell-dim">-</td>`;
    return negative
      ? `<td class="cell-money-neg">-¥${Math.abs(val).toLocaleString('ja-JP')}</td>`
      : `<td class="cell-money">¥${val.toLocaleString('ja-JP')}</td>`;
  }

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

  function renderRow(b, index) {
    const done = b.completed;
    const bd   = calcBreakdown(b);

    // ── 導出フィールドを計算 ──
    const calcAmount = bd.coursePrice + bd.extensionPrice + bd.opTotal;
    const courseOpts = COURSE_OPTIONS[b.shopId] || [];
    const extOpts    = EXTENSION_OPTIONS[b.shopId] || [];
    const selCourse  = courseOpts.find(c => c.id === b.courseId) || { duration: 0 };
    const selExt     = extOpts.find(e => e.id === b.extensionId) || { duration: 0 };
    const outTime    = toMin(b.time) != null
      ? toTime(toMin(b.time) + selCourse.duration + selExt.duration) : '';
    const ttNum         = b.travelTime != null && b.travelTime !== '' ? parseInt(b.travelTime, 10) : null;
    const travelDist    = ttNum != null ? `${ttNum}km` : null;
    const plannedOutTime = toMin(outTime) != null && ttNum != null
      ? toTime(toMin(outTime) + ttNum) : '';

    const brandLabel    = BRANDS.find(br => br.shopId === b.shopId)?.label || '';
    const staffLabel    = STAFF_OPTIONS.find(o => o.id === b.staffId)?.label || '';
    const mediaLabel    = MEDIA_OPTIONS.find(o => o.id === b.mediaId)?.label || '';
    const castLabel     = CAST_OPTIONS.find(c => c.companionId === b.companionId)?.label || '';
    const courseLabel   = courseOpts.find(c => c.id === b.courseId)?.label || '';
    const extLabel      = extOpts.find(e => e.id === b.extensionId)?.label || '';
    const deliveryLabel = DELIVERY_TYPE_OPTIONS.find(o => o.id === b.deliveryTypeId)?.label || '';
    const tfValue       = TRANSPORT_FEE_OPTIONS.find(o => o.id === b.transportFeeId)?.value ?? null;
    const discValue     = DISCOUNT_OPTIONS.find(o => o.id === b.discountId)?.value ?? null;

    return `
      <tr data-index="${index}"${done ? ' class="is-completed"' : ''}>
        <td class="col-sticky cell-no cell-dim">${index + 1}</td>
        <td class="cell-chk">${chkBox(b.dentatsu, done)}</td>
        <td class="cell-chk">${chkBox(b.heavenCheck, done)}</td>
        <td>${dim(brandLabel)}</td>
        <td>${dim(staffLabel)}</td>
        <td class="cell-dim">${b.tel1 ? `${b.tel1}-${b.tel2}-${b.tel3}` : '<span class="cell-dim">-</span>'}</td>
        <td class="cell-chk">${chkBox(b.confirmedCall, done)}</td>
        <td class="cell-customer-name">${dim(b.customerName)}</td>
        <td>${dim(b.nomination)}</td>
        <td>${mediaLabel ? `${mediaLabel}${b.mediaDate ? '<br><span class="cell-dim">' + b.mediaDate + '</span>' : ''}` : '<span class="cell-dim">-</span>'}</td>
        <td class="cell-chk">${walletCell(b.wallet)}</td>
        <td class="cell-chk">${chkBox(b.survey, done)}</td>
        <td class="cell-chk">${chkBox(b.salesReceipt, done)}</td>
        <td>${dim(castLabel)}</td>
        <td class="cell-time">${b.time}</td>
        <td>${dim(courseLabel)}</td>
        <td>${dim(extLabel)}</td>
        <td class="cell-money">¥${calcAmount.toLocaleString('ja-JP')}</td>
        <td class="cell-time">${dim(b.time)}</td>
        <td class="${outTime ? 'cell-time' : ''}">${dim(outTime)}</td>
        <td>${dim(deliveryLabel)}</td>
        <td class="cell-location">${truncate(b.location)}${b.address ? `<br><span class="cell-dim cell-location__addr">${truncate(b.address)}</span>` : ''}</td>
        <td>${dim(b.roomNo)}</td>
        <td>${opText(b.shopId, b.options)}</td>
        <td>${tfValue != null ? `<span class="cell-money">¥${tfValue.toLocaleString('ja-JP')}</span>` : '<span class="cell-dim">-</span>'}</td>
        <td>${discValue != null ? `<span class="cell-money-neg">-¥${Math.abs(discValue).toLocaleString('ja-JP')}</span>` : '<span class="cell-dim">-</span>'}</td>
        ${noteCell(b.castNote)}
        ${noteCell(b.storeNote)}
        <td>${carSelect(b.carGoingId, done)}</td>
        <td>${carSelect(b.carReturnId, done)}</td>
        <td>${dim(travelDist)}</td>
        <td>${ttNum != null ? `${ttNum}分` : '<span class="cell-dim">-</span>'}</td>
        <td class="${plannedOutTime ? 'cell-time' : ''}">${dim(plannedOutTime)}</td>
        <td class="cell-dim">${dim(b.shopId)}</td>
        <td class="cell-dim">${dim(b.memberId)}</td>
        <td class="cell-dim">${dim(b.companionId)}</td>
        <td class="cell-sglink"><a href="${b.sgLink || 'https://sg-system.jp/'}" target="_blank" class="sg-link">${b.sgLink || 'https://sg-system.jp/'}</a></td>
        ${priceCell(bd.membershipFee)}
        ${priceCell(bd.nominationFee)}
        ${priceCell(bd.specialNominationFee)}
        ${priceCell(bd.coursePrice)}
        ${priceCell(bd.extensionPrice)}
        ${priceCell(bd.opTotal)}
        ${priceCell(tfValue || 0)}
        ${priceCell(discValue || 0, true)}
      </tr>`;
  }

  // ── テーブル描画 ──────────────────────────────────────────────────────────

  function renderSummary() {
    const extraCols = ['J','S','F','JG×','JT×','JS×','FG×','FS×','FT×'];
    const nomCount = (list, col) => list.filter(b => b.nomination && b.nomination.includes(col)).length;
    const nomCell  = (n) => n > 0 ? `<td>${n}</td>` : '<td class="cell-dim">0</td>';
    let totalAmount = 0, totalCount = 0;
    const totalNom = new Array(extraCols.length).fill(0);
    const rows = BRANDS.map(br => {
      const brs = bookings.filter(b => b.shopId === br.shopId);
      const amount = brs.reduce((s, b) => {
        const bd = calcBreakdown(b);
        return s + bd.coursePrice + bd.extensionPrice + bd.opTotal;
      }, 0);
      totalAmount += amount;
      totalCount  += brs.length;
      const counts = extraCols.map((col, i) => { const n = nomCount(brs, col); totalNom[i] += n; return n; });
      return `<tr>
        <td>${br.label}</td>
        <td class="cell-money">¥${amount.toLocaleString('ja-JP')}</td>
        <td>${brs.length}</td>
        ${counts.map(nomCell).join('')}
      </tr>`;
    });
    const totalRow = `<tr class="summary-total">
      <td><strong>合計</strong></td>
      <td class="cell-money"><strong>¥${totalAmount.toLocaleString('ja-JP')}</strong></td>
      <td><strong>${totalCount}</strong></td>
      ${totalNom.map(nomCell).join('')}
    </tr>`;
    document.getElementById('summary-table').innerHTML = `
      <table class="booking-table" style="margin-bottom:16px">
        <thead><tr>
          <th>ブランド</th><th>売上</th><th>本数</th>
          ${extraCols.map(c => `<th>${c}</th>`).join('')}
        </tr></thead>
        <tbody>${rows.join('')}${totalRow}</tbody>
      </table>`;
  }

  function applyFilter() {
    const brandLabel  = document.getElementById('filter-brand').value;
    const staffLabel  = document.getElementById('filter-staff').value;
    const completed   = document.getElementById('filter-completed').value;
    const brandShopId = BRANDS.find(br => br.label === brandLabel)?.shopId || '';
    const staffId     = STAFF_OPTIONS.find(o => o.label === staffLabel)?.id || '';
    const filtered = bookings.filter(b =>
      (!brandShopId || b.shopId === brandShopId) &&
      (!staffId || b.staffId === staffId) &&
      (completed === '' || (completed === 'done' ? b.completed : !b.completed))
    );
    document.getElementById('booking-tbody').innerHTML = filtered.map(renderRow).join('');
    document.getElementById('booking-count').textContent = filtered.length;
  }

  applyFilter();
  renderSummary();

  document.getElementById('filter-brand').addEventListener('change', applyFilter);
  document.getElementById('filter-staff').addEventListener('change', applyFilter);
  document.getElementById('filter-completed').addEventListener('change', applyFilter);

  // ── 左ハーフモーダル初期化（お客様名クリック）────────────────────────────
  // 右モーダルより先に addEventListener するため先に初期化する
  const { openModal: openLeftModal, closeModal: closeLeftModal } = await initLeftModal(bookings, { MEDIA_OPTIONS });

  // ── ハーフモーダル初期化 ───────────────────────────────────────────────────

  const { openNewModal } = await initHalfModal(bookings, {
    CAR_OPTIONS, BRANDS, STAFF_OPTIONS,
    NOMINATIONS, COURSE_OPTIONS, EXTENSION_OPTIONS,
    OP_OPTIONS, TRANSPORT_FEE_OPTIONS, DISCOUNT_OPTIONS,
    DELIVERY_TYPE_OPTIONS, MEDIA_OPTIONS, CAST_OPTIONS,
  }, renderRow, renderSummary, { onOpen: closeLeftModal, onCustomerClick: openLeftModal });

  // ── 予約追加ボタン ────────────────────────────────────────────────────────
  document.getElementById('fab-add').addEventListener('click', e => {
    e.stopPropagation();
    openNewModal();
    openLeftModal({});
  });
}
