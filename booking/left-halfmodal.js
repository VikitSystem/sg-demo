/**
 * report/booking/left-halfmodal.js
 * 顧客情報 左ハーフモーダル
 * お客様名セル (.cell-customer-name) クリックで開く
 */

export async function initLeftModal(bookings, { MEDIA_OPTIONS }) {

  // ── スタイル注入 ──────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    .left-modal-overlay {
      position: fixed;
      top: 56px;
      left: 0;
      width: min(360px, 100vw);
      height: calc(100vh - 56px);
      z-index: 199;
      pointer-events: none;
    }
    .left-modal-overlay.is-open {
      pointer-events: auto;
    }
    .left-modal-panel {
      width: 100%;
      height: 100%;
      background: var(--panel);
      border-top: 1px solid var(--line-2);
      border-right: 1px solid var(--line-2);
      border-top-right-radius: 18px;
      display: flex;
      flex-direction: column;
      transform: translateX(-100%);
      transition: transform .28s cubic-bezier(0.32, 0.72, 0, 1);
      box-shadow: 12px -4px 48px rgba(0, 0, 0, 0.55);
    }
    .left-modal-overlay.is-open .left-modal-panel {
      transform: translateX(0);
    }
    .left-modal-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--line);
      flex-shrink: 0;
    }
    .left-modal-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--blue);
      letter-spacing: 0.04em;
    }
    .left-modal-subtitle {
      font-size: 12px;
      color: var(--muted);
      flex: 1;
    }
    .left-modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }
    .left-modal-body::-webkit-scrollbar { width: 4px; }
    .left-modal-body::-webkit-scrollbar-track { background: transparent; }
    .left-modal-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }

    /* クリック可能セル */
    .cell-customer-name {
      cursor: pointer;
    }
    .cell-customer-name:hover {
      color: var(--blue) !important;
      text-decoration: underline;
    }

    /* 右モーダルのサブタイトル内顧客名 */
    .modal-subtitle__name {
      cursor: pointer;
      transition: color 0.15s;
    }
    .modal-subtitle__name:hover {
      color: var(--blue);
    }

    /* 顧客プロフィール */
    .cust-profile {
      display: flex;
      align-items: center;
      gap: 14px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--line);
      margin-bottom: 16px;
    }
    .cust-avatar {
      width: 52px; height: 52px;
      border-radius: 50%;
      background: rgba(122,162,255,0.15);
      border: 1px solid rgba(122,162,255,0.3);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; font-weight: 700;
      color: var(--blue);
      flex-shrink: 0;
    }
    .cust-name {
      font-size: 16px;
      font-weight: 700;
      color: var(--text);
    }
    .cust-id {
      font-size: 11px;
      color: var(--dim);
      font-family: monospace;
      margin-top: 3px;
    }
    .cust-section {
      margin-bottom: 18px;
    }
    .cust-section__title {
      font-size: 11px;
      font-weight: 600;
      color: var(--muted);
      letter-spacing: 0.06em;
      margin-bottom: 8px;
    }
    .cust-row {
      display: flex;
      align-items: center;
      padding: 6px 0;
      border-bottom: 1px solid var(--line);
      font-size: 12px;
      gap: 8px;
    }
    .cust-row:last-child { border-bottom: none; }
    .cust-row__label {
      color: var(--muted);
      width: 76px;
      flex-shrink: 0;
    }
    .cust-row__val {
      color: var(--text);
      flex: 1;
    }
    .hist-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    .hist-table thead th {
      padding: 5px 8px;
      text-align: left;
      color: var(--muted);
      background: var(--deep);
      border-bottom: 1px solid var(--line);
      font-weight: 600;
      white-space: nowrap;
    }
    .hist-table tbody td {
      padding: 6px 8px;
      border-bottom: 1px solid var(--line);
      color: var(--text);
      white-space: nowrap;
    }
    .hist-table tbody tr:last-child td { border-bottom: none; }
    .hist-table tbody tr:hover td { background: var(--hover); }
    .hist-money { color: var(--green); }
    .hist-nom   { color: var(--cyan); }

    /* 顧客検索 */
    .cust-search-input {
      width: 100%;
      box-sizing: border-box;
      padding: 8px 12px;
      background: var(--deep);
      border: 1px solid var(--line);
      border-radius: 6px;
      color: var(--text);
      font-size: 13px;
      outline: none;
      margin-bottom: 16px;
    }
    .cust-search-input:focus {
      border-color: var(--blue);
    }
    .cust-search-input::placeholder {
      color: var(--dim);
    }
    .cust-result-item {
      padding: 9px 10px;
      border-radius: 6px;
      cursor: pointer;
      border: 1px solid transparent;
      margin-bottom: 4px;
    }
    .cust-result-item:hover {
      background: var(--hover);
      border-color: var(--line);
    }
    .cust-result-item__name {
      font-size: 13px;
      color: var(--text);
      font-weight: 600;
    }
    .cust-result-item__sub {
      font-size: 11px;
      color: var(--muted);
      margin-top: 2px;
    }
    .cust-search-empty {
      font-size: 12px;
      color: var(--dim);
      text-align: center;
      padding: 20px 0;
    }

    /* 統計カード */
    .stat-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }
    .stat-card {
      background: var(--deep);
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 8px 10px;
    }
    .stat-card__label {
      font-size: 10px;
      color: var(--muted);
      margin-bottom: 4px;
    }
    .stat-card__val {
      font-size: 14px;
      font-weight: 700;
      color: var(--green);
    }
    .stat-card__val--normal {
      font-size: 13px;
      font-weight: 600;
      color: var(--text);
    }
    .stat-card__sub {
      font-size: 11px;
      color: var(--muted);
      margin-left: 2px;
    }
  `;
  document.head.appendChild(style);

  // ── HTML 注入 ─────────────────────────────────────────────────────
  const htmlUrl = new URL('./left-halfmodal.html', import.meta.url);
  const res  = await fetch(htmlUrl);
  const html = await res.text();
  document.body.insertAdjacentHTML('beforeend', html);

  const modal    = document.getElementById('left-modal');
  const subtitle = document.getElementById('left-modal-subtitle');
  const body     = document.getElementById('left-modal-body');

  // ── 開閉 ──────────────────────────────────────────────────────────
  function outsideClickHandler(e) {
    if (!modal.querySelector('.left-modal-panel').contains(e.target)) {
      closeModal();
    }
  }

  function openModal(b) {
    document.removeEventListener('click', outsideClickHandler);
    setTimeout(() => document.addEventListener('click', outsideClickHandler), 0);
    const isSearch = !b.customerName && !b.memberId;
    subtitle.textContent = b.customerName || '';
    if (isSearch) {
      body.innerHTML = renderSearchMode();
      initSearchListeners();
    } else {
      body.innerHTML = renderContent(b);
    }
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('click', outsideClickHandler);
  }

  // 左パネル内のクリックを document までバブリングさせない
  // （右モーダルの outsideClickHandler が誤発火するのを防ぐ）
  modal.querySelector('.left-modal-panel').addEventListener('click', e => e.stopPropagation());

  document.getElementById('left-modal-close').addEventListener('click', e => { e.stopPropagation(); closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // ── ヒートマップ生成（固定） ──────────────────────────────────────
  function buildHeatmap() {
    function heatColor(v) {
      const stops = [
        [0.00, [ 49,  54, 149]],  // 濃青
        [0.12, [ 69, 117, 180]],  // 青
        [0.25, [116, 173, 209]],  // 水色
        [0.37, [171, 217, 233]],  // 薄水色
        [0.50, [255, 255, 191]],  // 黄
        [0.62, [254, 224, 144]],  // 薄オレンジ
        [0.75, [252, 141,  89]],  // オレンジ
        [0.87, [215,  48,  39]],  // 赤
        [1.00, [165,   0,  38]],  // 濃赤
      ];
      let i = 0;
      while (i < stops.length - 2 && v > stops[i + 1][0]) i++;
      const [t0, c0] = stops[i];
      const [t1, c1] = stops[i + 1];
      const f = (v - t0) / (t1 - t0);
      const r = Math.round(c0[0] + f * (c1[0] - c0[0]));
      const g = Math.round(c0[1] + f * (c1[1] - c0[1]));
      const b = Math.round(c0[2] + f * (c1[2] - c0[2]));
      return `rgb(${r},${g},${b})`;
    }
    // 2つのホットスポット（ガウス分布の重ね合わせ）
    const hotspots = [
      { cx: 28, cy: 32, sigma: 22, weight: 1.0 },
      { cx: 68, cy: 63, sigma: 18, weight: 0.85 },
    ];
    function gauss(i, j, cx, cy, sigma) {
      return Math.exp(-((i - cx) ** 2 + (j - cy) ** 2) / (2 * sigma ** 2));
    }
    const rows = Array.from({length: 100}, (_, i) =>
      '<tr>' + Array.from({length: 100}, (_, j) => {
        const v = Math.min(1, hotspots.reduce((sum, h) => sum + h.weight * gauss(i, j, h.cx, h.cy, h.sigma), 0));
        return `<td style="width:3px;height:3px;background:${heatColor(v)};border:none;padding:0;"></td>`;
      }).join('') + '</tr>'
    ).join('');
    const labelStyle = 'font-size:10px;color:var(--muted);white-space:nowrap;';
    return `
      <div style="display:inline-grid;grid-template-columns:auto auto auto;grid-template-rows:auto auto auto;align-items:center;justify-items:center;gap:4px;">

        <!-- 上ラベル（中央列） -->
        <div></div>
        <div style="${labelStyle}">接客重視</div>
        <div></div>

        <!-- 左ラベル・ヒートマップ・右ラベル -->
        <div style="${labelStyle}writing-mode:vertical-rl;">低単価</div>
        <div style="position:relative;display:inline-block;">
          <table style="border-collapse:collapse;table-layout:fixed;display:block;"><tbody>${rows}</tbody></table>
          <div style="position:absolute;top:0;left:50%;width:1px;height:100%;background:rgba(255,255,255,0.6);transform:translateX(-50%);pointer-events:none;"></div>
          <div style="position:absolute;top:50%;left:0;width:100%;height:1px;background:rgba(255,255,255,0.6);transform:translateY(-50%);pointer-events:none;"></div>
        </div>
        <div style="${labelStyle}writing-mode:vertical-rl;">高単価</div>

        <!-- 下ラベル（中央列） -->
        <div></div>
        <div style="${labelStyle}">見た目重視</div>
        <div></div>

      </div>
    `;
  }

  // ── 固定コンテンツ描画 ────────────────────────────────────────────
  function renderContent(b) {
    const nameFirst = (b.customerName || '？').charAt(0);
    const tel = b.tel1 && b.tel2 && b.tel3 ? `${b.tel1}-${b.tel2}-${b.tel3}` : '-';

    return `
      <div class="cust-profile">
        <div class="cust-avatar">${nameFirst}</div>
        <div>
          <div class="cust-name">${b.customerName || '-'}</div>
          <div class="cust-id">memberId: ${b.memberId || '-'}</div>
        </div>
      </div>

      <div class="cust-section">
        <div class="cust-section__title">前回情報</div>
        <div class="cust-row">
          <span class="cust-row__label">TEL</span>
          <span class="cust-row__val">${tel}</span>
        </div>
        <div class="cust-row">
          <span class="cust-row__label">指名区分</span>
          <span class="cust-row__val">${b.nomination || '-'}</span>
        </div>
        <div class="cust-row">
          <span class="cust-row__label">媒体</span>
          <span class="cust-row__val">${MEDIA_OPTIONS.find(o => o.id === b.mediaId)?.label || '-'}</span>
        </div>
      </div>

      <div class="cust-section">
        <div class="cust-section__title">来店履歴（固定サンプル）</div>
        <table class="hist-table">
          <thead>
            <tr><th>日付</th><th>コース</th><th>指名</th><th>売上</th></tr>
          </thead>
          <tbody>
            <tr><td>2026/03/15</td><td>90分</td><td class="hist-nom">S本指名</td><td class="hist-money">¥26,000</td></tr>
            <tr><td>2026/02/28</td><td>120分</td><td class="hist-nom">J指名</td><td class="hist-money">¥30,000</td></tr>
            <tr><td>2026/02/10</td><td>60分</td><td class="hist-nom">Fフリー</td><td class="hist-money">¥16,000</td></tr>
            <tr><td>2026/01/22</td><td>90分</td><td class="hist-nom">J指名</td><td class="hist-money">¥24,000</td></tr>
            <tr><td>2026/01/05</td><td>120分</td><td class="hist-nom">S本指名</td><td class="hist-money">¥33,000</td></tr>
          </tbody>
        </table>
      </div>

      <div class="cust-section">
        <div class="cust-section__title">顧客の嗜好(固定サンプル)</div>
        <div style="overflow-x:auto;">${buildHeatmap()}</div>
      </div>

      <div class="cust-section">
        <div class="cust-section__title">統計データ(固定サンプル)</div>
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-card__label">来店総数</div>
            <div class="stat-card__val--normal">39<span class="stat-card__sub">回</span></div>
          </div>
          <div class="stat-card">
            <div class="stat-card__label">平均来店頻度</div>
            <div class="stat-card__val--normal">29<span class="stat-card__sub">日</span></div>
          </div>
          <div class="stat-card">
            <div class="stat-card__label">平均単価</div>
            <div class="stat-card__val--normal">¥19,000</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__label">総売上</div>
            <div class="stat-card__val--normal">¥741,000</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__label">接客回数 1位</div>
            <div class="stat-card__val--normal">ゆき<span class="stat-card__sub">/ 9回</span></div>
          </div>
          <div class="stat-card">
            <div class="stat-card__label">接客回数 2位</div>
            <div class="stat-card__val--normal">れい<span class="stat-card__sub">/ 8回</span></div>
          </div>
          <div class="stat-card">
            <div class="stat-card__label">接客回数 3位</div>
            <div class="stat-card__val--normal">こはる<span class="stat-card__sub">/ 6回</span></div>
          </div>
          <div class="stat-card" style="grid-column:1">
            <div class="stat-card__label">指名数 1位</div>
            <div class="stat-card__val--normal">しおり<span class="stat-card__sub">/ 5回</span></div>
          </div>
          <div class="stat-card">
            <div class="stat-card__label">指名数 2位</div>
            <div class="stat-card__val--normal">れい<span class="stat-card__sub">/ 4回</span></div>
          </div>
          <div class="stat-card">
            <div class="stat-card__label">指名数 3位</div>
            <div class="stat-card__val--normal">こはる<span class="stat-card__sub">/ 2回</span></div>
          </div>
        </div>
      </div>

    `;
  }

  // ── 顧客リスト（bookings から重複排除）────────────────────────────
  function getCustomerList() {
    const seen = new Set();
    return bookings.filter(b => {
      if (!b.customerName) return false;
      const key = b.memberId || b.customerName;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // ── 検索モード描画 ────────────────────────────────────────────────
  function renderSearchMode() {
    return `
      <div class="cust-section__title" style="margin-bottom:6px;">既存顧客検索</div>
      <input type="text" class="cust-search-input" id="cust-search-input"
        placeholder="MemberIDを入力..." autocomplete="off" value="M">
      <div class="cust-section">
        <div class="cust-section__title">検索結果</div>
        <div id="cust-search-results">
          <div class="cust-search-empty">顧客名を入力してください</div>
        </div>
      </div>
    `;
  }

  function renderResults(customers) {
    if (customers.length === 0) {
      return `<div class="cust-search-empty">該当する顧客がいません</div>`;
    }
    return customers.map((b, i) => {
      const tel = b.tel1 && b.tel2 && b.tel3 ? `${b.tel1}-${b.tel2}-${b.tel3}` : '';
      const sub = [b.memberId || '', tel].filter(Boolean).join('　');
      return `
        <div class="cust-result-item" data-idx="${i}">
          <div class="cust-result-item__name">${b.customerName}</div>
          ${sub ? `<div class="cust-result-item__sub">${sub}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  function initSearchListeners() {
    const input   = document.getElementById('cust-search-input');
    const results = document.getElementById('cust-search-results');
    let matched   = [];

    input.focus();

    function runSearch() {
      const q = input.value.trim();
      if (!q) {
        matched = [];
        results.innerHTML = `<div class="cust-search-empty">会員IDを入力してください</div>`;
        return;
      }
      matched = getCustomerList().filter(b => b.memberId && String(b.memberId).includes(q));
      results.innerHTML = renderResults(matched);
    }

    input.addEventListener('input', runSearch);
    runSearch(); // 初期値 "M" で即検索

    results.addEventListener('click', e => {
      const item = e.target.closest('.cust-result-item');
      if (!item) return;
      e.stopPropagation();
      const b = matched[Number(item.dataset.idx)];
      if (!b) return;
      subtitle.textContent = b.customerName;
      body.innerHTML = renderContent(b);

      // 右モーダルに自動入力
      const nameInput = document.getElementById('mf-customer-name');
      if (nameInput) nameInput.value = b.customerName;

      const memberIdInput = document.getElementById('mf-member-id');
      if (memberIdInput) memberIdInput.value = b.memberId || '';

      const tel1 = document.getElementById('mf-tel1');
      const tel2 = document.getElementById('mf-tel2');
      const tel3 = document.getElementById('mf-tel3');
      if (tel1) tel1.value = b.tel1 || '';
      if (tel2) tel2.value = b.tel2 || '';
      if (tel3) tel3.value = b.tel3 || '';

      // 来店区分を「二回目以降」に設定
      const visitSelect = document.getElementById('mf-visit-type');
      if (visitSelect) visitSelect.value = '二回目以降';
    });
  }

  // ── お客様名セルのクリックで開く ──────────────────────────────────
  // stopImmediatePropagation で右ハーフモーダルのリスナーをキャンセル
  const tbody = document.getElementById('booking-tbody');
  if (tbody) {
    tbody.addEventListener('click', e => {
      const td = e.target.closest('.cell-customer-name');
      if (!td) return;
      e.stopImmediatePropagation();
      const tr = td.closest('tr');
      if (!tr) return;
      openModal(bookings[Number(tr.dataset.index)]);
    });
  }

  return { openModal, closeModal };
}
