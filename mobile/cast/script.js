/**
 * SG キャストポータル — ページスクリプト
 * 全ページ共通で読み込み、要素の存在でページを判別して初期化する
 */

// ── 共通ユーティリティ ──────────────────────────────
function toast(msg) {
  const el = document.createElement('div');
  el.textContent = msg;
  Object.assign(el.style, {
    position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
    background: 'var(--panel)', border: '1px solid var(--line-2)', color: 'var(--text)',
    padding: '10px 20px', borderRadius: '8px', fontSize: '13px', zIndex: '400',
    boxShadow: 'var(--shadow)', whiteSpace: 'nowrap', opacity: '1', transition: 'opacity 0.3s',
  });
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 2000);
}
// ────────────────────────────────────────────────────

// ═══════════════════════════════════════════════
// ログインページ  (#login-btn が存在する場合)
// ═══════════════════════════════════════════════
if (document.getElementById('login-btn')) {
  // auth.js（非モジュール）で isAuthed / login がグローバルに定義済み
  if (isAuthed()) {
    const params = new URLSearchParams(location.search);
    location.replace(params.get('redirect') || 'home.html');
  }

  function doLogin() {
    const code     = document.getElementById('code').value.trim();
    const password = document.getElementById('password').value.trim();
    if (login(code, password)) {
      const params = new URLSearchParams(location.search);
      location.replace(params.get('redirect') || 'home.html');
    } else {
      document.getElementById('login-error').textContent = 'アクセスコードが正しくありません';
      document.getElementById('code').focus();
    }
  }

  document.getElementById('login-btn').addEventListener('click', doLogin);
  document.getElementById('code').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('password').focus();
  });
  document.getElementById('password').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
}

// ═══════════════════════════════════════════════
// ホームページ  (#next-booking が存在する場合)
// ═══════════════════════════════════════════════
if (document.getElementById('next-booking')) {
  const { TODAY_BOOKINGS } = await import('./mock/schedule.js');
  const { initBookingModal, openBookingModal } = await import('./modal/booking-modal.js');

  const STATUS_BADGE_INLINE = {
    completed: '<span class="badge badge--dim"   style="font-size:10px;padding:2px 6px;">完了</span>',
    active:    '<span class="badge badge--green" style="font-size:10px;padding:2px 6px;">進行中</span>',
    pending:   '<span class="badge badge--amber" style="font-size:10px;padding:2px 6px;">予定</span>',
  };
  const DOT_CLASS = { completed: 'is-done', active: 'is-active', pending: '' };
  const bookingMap = new Map(TODAY_BOOKINGS.map(b => [b.id, b]));

  // 今日の件数
  document.getElementById('today-count').innerHTML =
    `${TODAY_BOOKINGS.length}<span class="summary-card__unit">件</span>`;

  // 次の予約カード
  function renderFeatured() {
    const featured = TODAY_BOOKINGS.find(b => b.status === 'active')
                  ?? TODAY_BOOKINGS.find(b => b.status === 'pending');

    if (featured) {
      const statusBadge = featured.status === 'active'
        ? '<span class="badge badge--green">進行中</span>'
        : '<span class="badge badge--amber">予定</span>';
      const noteHtml = featured.note
        ? `<div style="font-size:12px;color:var(--amber);margin-top:6px;">📝 ${featured.note}</div>`
        : '';
      const extPart = featured.extensionLabel && featured.extensionLabel !== 'なし'
        ? ` ＋ ${featured.extensionLabel}` : '';

      document.getElementById('next-booking').innerHTML = `
        <div class="card card--accent-blue" data-booking-id="${featured.id}" style="cursor:pointer;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <span style="font-size:22px;font-weight:700;color:var(--text);">${featured.time}</span>
            ${statusBadge}
          </div>
          <div style="font-size:16px;font-weight:600;color:var(--text);margin-bottom:4px;">${featured.customerName} 様</div>
          <div style="font-size:13px;color:var(--muted);">${featured.courseLabel}${extPart} &nbsp;|&nbsp; ${featured.deliveryLabel} &nbsp;|&nbsp; ¥${featured.totalPrice.toLocaleString()}</div>
          ${noteHtml}
          <div style="display:flex;gap:8px;margin-top:14px;">
            <div style="flex:1;background:var(--deep);border-radius:8px;padding:8px 10px;">
              <div style="font-size:10px;color:var(--dim);margin-bottom:2px;">送迎（往）</div>
              <div style="font-size:12px;color:var(--text);">${featured.carGoingLabel}</div>
            </div>
            <div style="flex:1;background:var(--deep);border-radius:8px;padding:8px 10px;">
              <div style="font-size:10px;color:var(--dim);margin-bottom:2px;">送迎（帰）</div>
              <div style="font-size:12px;color:var(--text);">${featured.carReturnLabel}</div>
            </div>
            <div style="flex:1;background:var(--deep);border-radius:8px;padding:8px 10px;">
              <div style="font-size:10px;color:var(--dim);margin-bottom:2px;">担当スタッフ</div>
              <div style="font-size:12px;color:var(--text);">${featured.staffLabel}</div>
            </div>
          </div>
        </div>`;
    } else {
      document.getElementById('next-booking').innerHTML =
        '<div class="card" style="color:var(--muted);font-size:13px;text-align:center;padding:20px;">本日の残予約はありません</div>';
    }
  }

  // 本日の予約リスト
  function renderItem(b) {
    const extPart = b.extensionLabel && b.extensionLabel !== 'なし'
      ? ` ＋ ${b.extensionLabel}` : '';
    const noteHtml = b.note
      ? `<div class="booking-item__note">📝 ${b.note}</div>` : '';
    return `
      <div class="booking-item" data-booking-id="${b.id}" style="cursor:pointer;">
        <div class="booking-item__time">
          <div class="booking-item__time-start">${b.time}</div>
          <div class="booking-item__time-end">〜${b.outTime}</div>
        </div>
        <div class="booking-item__dot">
          <div class="booking-item__dot-circle ${DOT_CLASS[b.status] ?? ''}"></div>
        </div>
        <div class="booking-item__body">
          <div class="booking-item__customer">
            ${b.customerName} 様
            ${STATUS_BADGE_INLINE[b.status] ?? ''}
          </div>
          <div class="booking-item__detail">${b.courseLabel}${extPart} &nbsp;|&nbsp; ${b.deliveryLabel} &nbsp;|&nbsp; ¥${b.totalPrice.toLocaleString()}</div>
          ${noteHtml}
        </div>
      </div>`;
  }

  function renderList() {
    document.getElementById('today-bookings').innerHTML =
      TODAY_BOOKINGS.length
        ? TODAY_BOOKINGS.map(renderItem).join('')
        : '<div style="color:var(--muted);font-size:13px;text-align:center;padding:20px;">本日の予約はありません</div>';
  }

  renderFeatured();
  renderList();

  // モーダル
  initBookingModal({
    onStart: (booking) => {
      booking.status = 'active';
      renderFeatured();
      renderList();
      toast('接客開始を記録しました');
    },
    onEnd: (booking) => {
      booking.status = 'completed';
      renderFeatured();
      renderList();
      toast('接客終了を記録しました');
    },
    onCancel: (booking) => {
      booking.status = 'pending';
      renderFeatured();
      renderList();
      toast('完了を取り消しました');
    },
  });

  document.addEventListener('click', e => {
    const target = e.target.closest('[data-booking-id]');
    if (!target) return;
    const booking = bookingMap.get(target.dataset.bookingId);
    if (!booking) return;
    const hasOtherActive = TODAY_BOOKINGS.some(b => b.status === 'active' && b.id !== booking.id);
    openBookingModal(booking, { disableStart: hasOtherActive });
  });
  // ?openModal=bookingId の時は自動おお設開モーダル
  const _openModalId1 = new URLSearchParams(location.search).get('openModal');
  if (_openModalId1) {
    const _target1 = bookingMap.get(_openModalId1);
    if (_target1) openBookingModal(_target1, { disableStart: TODAY_BOOKINGS.some(b => b.status === 'active' && b.id !== _target1.id) });
  }}

// ═══════════════════════════════════════════════
// 予約一覧ページ  (#booking-list が存在する場合)
// ═══════════════════════════════════════════════
if (document.getElementById('booking-list')) {
  const { TODAY_BOOKINGS } = await import('./mock/schedule.js');
  const { initBookingModal, openBookingModal } = await import('./modal/booking-modal.js');

  const bookingMap = new Map(TODAY_BOOKINGS.map(b => [b.id, b]));

  // 日付ナビ
  const DAYS = ['日', '月', '火', '水', '木', '金', '土'];
  let current = new Date('2026-04-06');

  function updateLabel() {
    const y = current.getFullYear();
    const m = current.getMonth() + 1;
    const d = current.getDate();
    const w = DAYS[current.getDay()];
    document.getElementById('date-label').textContent = `${y}年${m}月${d}日（${w}）`;
  }

  document.getElementById('prev-day').addEventListener('click', () => {
    current.setDate(current.getDate() - 1);
    updateLabel();
  });
  document.getElementById('next-day').addEventListener('click', () => {
    current.setDate(current.getDate() + 1);
    updateLabel();
  });

  // 予約カード描画
  const STATUS_BADGE = {
    completed: '<span class="badge badge--dim">完了</span>',
    active:    '<span class="badge badge--green">進行中</span>',
    pending:   '<span class="badge badge--amber">予定</span>',
  };

  function renderCard(b) {
    const isActive = b.status === 'active';
    const cardClass = isActive ? 'card card--accent-blue' : 'card';
    const cellBg = isActive ? 'rgba(0,0,0,0.2)' : 'var(--deep)';
    const cell = (label, value) =>
      `<div style="background:${cellBg};border-radius:6px;padding:8px 10px;">
        <div style="font-size:10px;color:var(--dim);margin-bottom:2px;">${label}</div>
        <div style="font-size:12px;color:var(--text);">${value}</div>
      </div>`;
    const noteHtml = b.note
      ? `<div style="font-size:12px;color:var(--amber);margin-bottom:8px;">📝 ${b.note}</div>` : '';
    const nameMb = b.note ? '4' : '8';
    return `
      <div class="${cardClass}" data-booking-id="${b.id}" style="margin-bottom:10px;cursor:pointer;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div style="display:flex;align-items:baseline;gap:6px;">
            <span style="font-size:20px;font-weight:700;color:var(--text);">${b.time}</span>
            <span style="font-size:13px;color:var(--muted);">〜 ${b.outTime}</span>
          </div>
          ${STATUS_BADGE[b.status] ?? ''}
        </div>
        <div style="font-size:16px;font-weight:600;color:var(--text);margin-bottom:${nameMb}px;">${b.customerName} 様</div>
        ${noteHtml}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          ${cell('コース',     b.courseLabel)}
          ${cell('延長',       b.extensionLabel)}
          ${cell('デリバリー', b.deliveryLabel)}
          ${cell('担当',       b.staffLabel)}
        </div>
      </div>`;
  }

  // フィルター: null=全件, 'completed'|'active'|'pending'
  let activeFilter = null;

  const BADGE_IDS = ['badge-total', 'badge-completed', 'badge-active', 'badge-pending'];
  const BADGE_FILTER_MAP = {
    'badge-total':     null,
    'badge-completed': 'completed',
    'badge-active':    'active',
    'badge-pending':   'pending',
  };

  function renderBadges() {
    const counts = { completed: 0, active: 0, pending: 0 };
    TODAY_BOOKINGS.forEach(b => { if (b.status in counts) counts[b.status]++; });
    document.getElementById('badge-total').textContent     = `全 ${TODAY_BOOKINGS.length}件`;
    document.getElementById('badge-completed').textContent = `完了 ${counts.completed}件`;
    document.getElementById('badge-active').textContent    = `進行中 ${counts.active}件`;
    document.getElementById('badge-pending').textContent   = `予定 ${counts.pending}件`;

    // アクティブバッジの強調
    BADGE_IDS.forEach(id => {
      const el = document.getElementById(id);
      const isSelected = BADGE_FILTER_MAP[id] === activeFilter;
      el.style.outline = isSelected ? '2px solid currentColor' : '';
      el.style.cursor  = 'pointer';
    });
  }

  function renderList() {
    const filtered = activeFilter
      ? TODAY_BOOKINGS.filter(b => b.status === activeFilter)
      : TODAY_BOOKINGS;
    document.getElementById('booking-list').innerHTML = filtered.length
      ? filtered.map(renderCard).join('')
      : '<div class="card" style="color:var(--muted);font-size:13px;text-align:center;padding:20px;">該当する予約はありません</div>';
    renderBadges();
  }

  // バッジクリックでフィルター切り替え
  BADGE_IDS.forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
      const next = BADGE_FILTER_MAP[id];
      activeFilter = activeFilter === next ? null : next;
      renderList();
    });
  });

  renderList();

  initBookingModal({
    onStart: (booking) => {
      booking.status = 'active';
      renderList();
      toast('接客開始を記録しました');
    },
    onEnd: (booking) => {
      booking.status = 'completed';
      renderList();
      toast('接客終了を記録しました');
    },
    onCancel: (booking) => {
      booking.status = 'pending';
      renderList();
      toast('完了を取り消しました');
    },
  });

  document.addEventListener('click', e => {
    const target = e.target.closest('[data-booking-id]');
    if (!target) return;
    const booking = bookingMap.get(target.dataset.bookingId);
    if (!booking) return;
    const hasOtherActive = TODAY_BOOKINGS.some(b => b.status === 'active' && b.id !== booking.id);
    openBookingModal(booking, { disableStart: hasOtherActive });
  });
  // ?openModal=bookingId の時は自動おお設開モーダル
  const _openModalId2 = new URLSearchParams(location.search).get('openModal');
  if (_openModalId2) {
    const _target2 = bookingMap.get(_openModalId2);
    if (_target2) openBookingModal(_target2, { disableStart: TODAY_BOOKINGS.some(b => b.status === 'active' && b.id !== _target2.id) });
  }}

// ═══════════════════════════════════════════════
// 勤怠ページ  (#clock が存在する場合)
// ═══════════════════════════════════════════════
if (document.getElementById('clock')) {
  const { MONTHLY_SHIFTS, RECENT_LOGS } = await import('./mock/timeline.js');

  // ── 今月のシフト描画 ──────────────────────────
  const todayIdx = MONTHLY_SHIFTS.findIndex(s => s.isToday);
  const weekEnd  = todayIdx + 7;

  function makeShiftRow(s) {
    const label = `${s.date}（${s.day}）`;
    if (s.isToday) {
      const timeStr = s.start && s.end ? `${s.start} 〜 ${s.end}` : '';
      return `<div class="att-log-item">
        <div class="att-log-item__date" style="color:var(--blue);">${label}</div>
        <div class="att-log-item__times">${timeStr}</div>
        <span class="badge badge--blue" style="font-size:10px;padding:2px 7px;">今日</span>
      </div>`;
    }
    if (s.type === 'shift') {
      return `<div class="att-log-item">
        <div class="att-log-item__date">${label}</div>
        <div class="att-log-item__times">${s.start} 〜 ${s.end}</div>
      </div>`;
    }
    if (s.type === 'off') {
      return `<div class="att-log-item">
        <div class="att-log-item__date">${label}</div>
        <div class="att-log-item__times" style="color:var(--dim);">休み</div>
      </div>`;
    }
    // unsubmitted
    return `<div class="att-log-item" style="opacity:0.55;">
      <div class="att-log-item__date">${label}</div>
      <div class="att-log-item__times" style="color:var(--amber);">シフト未提出</div>
    </div>`;
  }

  const pastRows   = MONTHLY_SHIFTS.slice(0, todayIdx).map(makeShiftRow).join('');
  const weekRows   = MONTHLY_SHIFTS.slice(todayIdx, weekEnd).map(makeShiftRow).join('');
  const futureRows = MONTHLY_SHIFTS.slice(weekEnd).map(makeShiftRow).join('');

  document.getElementById('shift-card').innerHTML =
    `<div id="shift-past" style="display:none;">${pastRows}</div>` +
    weekRows +
    `<div id="shift-future" style="display:none;">${futureRows}</div>`;
  // ─────────────────────────────────────────────

  // ── 直近の打刻履歴描画 ────────────────────────
  document.getElementById('recent-log-card').innerHTML = RECENT_LOGS.map(log => {
    const label = `${log.date}（${log.day}）`;
    if (log.isToday) {
      return `<div class="att-log-item" id="log-today">
        <div class="att-log-item__date">${label}</div>
        <div class="att-log-item__times">${log.start} 〜 <span style="color:var(--dim)">—</span></div>
        <span class="badge badge--green" style="font-size:10px;padding:2px 7px;">出勤中</span>
      </div>`;
    }
    if (log.type === 'completed') {
      const right = log.late
        ? `<div style="display:flex;align-items:center;gap:6px;">
             <span class="badge badge--amber" style="font-size:10px;padding:2px 7px;">遅刻</span>
             <div class="att-log-item__hours">${log.hours}h</div>
           </div>`
        : `<div class="att-log-item__hours">${log.hours}h</div>`;
      return `<div class="att-log-item">
        <div class="att-log-item__date">${label}</div>
        <div class="att-log-item__times">${log.start} 〜 ${log.end}</div>
        ${right}
      </div>`;
    }
    if (log.type === 'off') {
      return `<div class="att-log-item">
        <div class="att-log-item__date">${label}</div>
        <div class="att-log-item__times" style="color:var(--dim);">休み</div>
      </div>`;
    }
    // absent
    return `<div class="att-log-item">
      <div class="att-log-item__date">${label}</div>
      <div class="att-log-item__times" style="color:var(--dim);">欠勤</div>
      <div class="att-log-item__hours" style="color:var(--dim);">—</div>
    </div>`;
  }).join('');
  // ─────────────────────────────────────────────
  // 打刻状態: 'in'=出勤中, 'break'=休憩中, 'out'=退勤済
  let workState = 'in';
  // 打刻イベントを時系列で管理: { type:'in'|'break'|'out', time?, start?, end? }
  const punchLog = [{ type: 'in', time: '18:30' }];

  const btnIn    = document.getElementById('btn-in');
  const btnBreak = document.getElementById('btn-break');
  const btnOut   = document.getElementById('btn-out');
  const statusEl = document.getElementById('work-status');

  const ICON_DONE    = `<div style="width:20px;height:20px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0b0d12" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>`;
  const ICON_CIRCLE  = `<div style="width:20px;height:20px;border-radius:50%;background:var(--line-2);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/></svg></div>`;
  const ICON_CROSS   = `<div style="width:20px;height:20px;border-radius:50%;background:var(--line-2);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>`;

  function renderLog() {
    const rows = punchLog.map((entry, i) => {
      const isLast = i === punchLog.length - 1;
      const border = isLast ? '' : 'border-bottom:1px solid var(--line);';
      if (entry.type === 'in') {
        return `<div style="display:flex;align-items:center;gap:10px;padding:10px 0;${border}">
          ${ICON_DONE}
          <div style="flex:1;font-size:14px;color:var(--text);">出勤</div>
          <div style="font-size:15px;font-weight:700;color:var(--text);font-variant-numeric:tabular-nums;">${entry.time}</div>
        </div>`;
      }
      if (entry.type === 'break') {
        const ended = entry.end !== null;
        return `<div style="display:flex;align-items:center;gap:10px;padding:10px 0;${border}">
          ${ended ? ICON_DONE : ICON_CIRCLE}
          <div style="flex:1;font-size:14px;color:var(--text);">休憩</div>
          <div style="font-size:13px;font-weight:700;color:var(--text);font-variant-numeric:tabular-nums;">${entry.start} 〜 ${ended ? entry.end : '——'}</div>
        </div>`;
      }
      if (entry.type === 'out') {
        return `<div style="display:flex;align-items:center;gap:10px;padding:10px 0;${border}">
          ${ICON_DONE}
          <div style="flex:1;font-size:14px;color:var(--text);">退勤</div>
          <div style="font-size:15px;font-weight:700;color:var(--text);font-variant-numeric:tabular-nums;">${entry.time}</div>
        </div>`;
      }
      return '';
    });
    document.getElementById('today-log').innerHTML = rows.join('');
  }

  function applyState() {
    btnIn.disabled    = workState !== null;
    btnBreak.disabled = workState !== 'in' && workState !== 'break';
    btnOut.disabled   = workState !== 'in';

    btnBreak.textContent = workState === 'break' ? '休憩終了' : '休憩';

    if (workState === 'in') {
      statusEl.className = 'badge badge--green'; statusEl.textContent = '● 出勤中';
    } else if (workState === 'break') {
      statusEl.className = 'badge badge--amber'; statusEl.textContent = '● 休憩中';
    } else {
      statusEl.className = 'badge badge--dim';   statusEl.textContent = '● 未出勤';
    }
    renderLog();
  }

  function getTimeStr() {
    return document.getElementById('clock').textContent;
  }

  function calcHours(startStr, endStr) {
    const [sh, sm] = startStr.split(':').map(Number);
    let   [eh, em] = endStr.split(':').map(Number);
    if (eh * 60 + em < sh * 60 + sm) eh += 24; // 日をまたぐ場合
    return ((eh * 60 + em) - (sh * 60 + sm)) / 60;
  }

  btnIn.addEventListener('click', () => {
    punchLog.push({ type: 'in', time: getTimeStr() });
    workState = 'in';
    applyState();
    toast('出勤を記録しました');
  });
  btnBreak.addEventListener('click', () => {
    if (workState === 'in') {
      punchLog.push({ type: 'break', start: getTimeStr(), end: null });
      workState = 'break';
      toast('休憩打刻を記録しました');
    } else if (workState === 'break') {
      punchLog[punchLog.length - 1].end = getTimeStr();
      workState = 'in';
      toast('業務を再開しました');
    }
    applyState();
  });
  btnOut.addEventListener('click', () => {
    const outTime = getTimeStr();
    punchLog.push({ type: 'out', time: outTime });
    workState = null;
    applyState();
    toast('退勤打刻を記録しました');

    // 初回の退勤のみ反映
    const outs = punchLog.filter(e => e.type === 'out');
    if (outs.length === 1) {
      const inTime = punchLog.find(e => e.type === 'in').time;
      const worked = calcHours(inTime, outTime);
      const newTotal = parseFloat((24.5 + worked).toFixed(2));

      const totalEl = document.getElementById('total-hours');
      if (totalEl) totalEl.innerHTML = `${newTotal}<span class="summary-card__unit">h</span>`;

      const logToday = document.getElementById('log-today');
      if (logToday) logToday.innerHTML = `
        <div class="att-log-item__date">4/6（月）</div>
        <div class="att-log-item__times">${inTime} 〜 ${outTime}</div>
        <div class="att-log-item__hours">${parseFloat(worked.toFixed(2))}h</div>`;
    }
  });

  applyState();

  document.getElementById('shift-show-all').addEventListener('click', function () {
    const isOpen = this.textContent === '閉じる';
    document.getElementById('shift-past').style.display   = isOpen ? 'none' : '';
    document.getElementById('shift-future').style.display = isOpen ? 'none' : '';
    this.textContent = isOpen ? 'すべて見る' : '閉じる';
  });
}

// ═══════════════════════════════════════════════
// マイページ  (#prev-month が存在する場合)
// ═══════════════════════════════════════════════
if (document.getElementById('prev-month')) {
  let current = new Date(2026, 3, 1); // 2026年4月

  function renderMonthLabel() {
    const y = current.getFullYear();
    const m = current.getMonth() + 1;
    document.getElementById('month-label').textContent = `${y}年${m}月の実績`;
  }

  document.getElementById('prev-month').addEventListener('click', () => {
    current.setMonth(current.getMonth() - 1);
    renderMonthLabel();
  });
  document.getElementById('next-month').addEventListener('click', () => {
    current.setMonth(current.getMonth() + 1);
    renderMonthLabel();
  });

  renderMonthLabel();
}

// ═══════════════════════════════════════════════
// チャット一覧  (#talk-list が存在する場合)
// ═══════════════════════════════════════════════
if (document.getElementById('talk-list')) {
  const { TALK_LIST } = await import('./mock/chat.js');

  // mock データの type フィールドをそのまま利用
  const talksWithType = TALK_LIST;

  function sortTalks(list) {
    return [...list].sort((a, b) => {
      const aUnread = a.unread > 0 ? 1 : 0;
      const bUnread = b.unread > 0 ? 1 : 0;
      if (bUnread !== aUnread) return bUnread - aUnread;
      return new Date(b.lastTimestamp) - new Date(a.lastTimestamp);
    });
  }

  // URLパラメータから初期フィルターを復元
  const _initFilter = new URLSearchParams(location.search).get('filter') || 'all';
  let _currentFilter = _initFilter;

  // フィルターボタンの初期状態を復元
  document.querySelectorAll('#chat-filter [data-filter]').forEach(el => {
    el.classList.toggle('is-active', el.dataset.filter === _initFilter);
  });

  function renderTalkList(filter) {
    _currentFilter = filter;
    const filtered = filter === 'all'
      ? talksWithType
      : talksWithType.filter(t => t.type === filter);
    const sorted = sortTalks(filtered);
    document.getElementById('talk-list').innerHTML = sorted.map(t => `
      <a class="talk-item" href="chat_room.html?id=${t.id}&returnPage=chat.html&returnFilter=${filter}">
        <div class="talk-avatar talk-avatar--${t.type}">${t.initial}</div>
        <div class="talk-body">
          <div class="talk-header">
            <span class="talk-name">${t.name}</span>
            <span class="talk-time">${t.lastTime}</span>
          </div>
          <div class="talk-footer">
            <span class="talk-preview">${t.lastMessage}</span>
            ${t.unread > 0 ? `<span class="talk-unread">${t.unread}</span>` : ''}
          </div>
        </div>
      </a>
    `).join('') || '<p style="padding:24px 16px;color:var(--dim);font-size:13px;">該当するチャットはありません</p>';
  }

  renderTalkList(_initFilter);

  document.getElementById('chat-filter').addEventListener('click', e => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    document.querySelectorAll('#chat-filter [data-filter]').forEach(el => el.classList.remove('is-active'));
    btn.classList.add('is-active');
    renderTalkList(btn.dataset.filter);
  });
}

// ═══════════════════════════════════════════════
// 個別チャット  (#chat-list が存在する場合)
// ═══════════════════════════════════════════════
if (document.getElementById('chat-list')) {
  const { TALK_LIST, MESSAGES, formatDateLabel } = await import('./mock/chat.js');

  const id      = new URLSearchParams(location.search).get('id') || '1';
  const partner = TALK_LIST.find(t => t.id === id) ?? TALK_LIST[0];
  const threads = MESSAGES[id] ?? [];

  document.getElementById('room-title').textContent = partner.name;

  document.getElementById('chat-list').innerHTML = threads.map(thread => `
    <div class="chat-date-divider">${formatDateLabel(thread.date)}</div>
    ${thread.messages.map((msg, i) => {
      const isMe     = msg.sender === 'me';
      const showName = !isMe && i === 0;
      return `
        <div class="chat-row${isMe ? ' chat-row--me' : ''}">
          <div class="chat-avatar${isMe ? ' chat-avatar--me' : ` chat-avatar--${partner.type}`}">${isMe ? 'あ' : partner.initial}</div>
          <div class="chat-bubble-wrap">
            ${showName ? `<span class="chat-msg-name">${partner.name}</span>` : ''}
            <span class="chat-bubble${isMe ? ' chat-bubble--me' : ''}">${msg.text}</span>
            <div class="chat-meta">
              ${isMe && msg.read ? `<span class="chat-read">既読</span>` : ''}
              <span class="chat-time">${msg.time}</span>
            </div>
          </div>
        </div>`;
    }).join('')}
  `).join('');

  const anchor = document.createElement('div');
  document.getElementById('chat-list').appendChild(anchor);
  anchor.scrollIntoView();

  function sendMessage() {
    const input = document.querySelector('.chat-input');
    const text  = input.value.trim();
    if (!text) return;

    const now  = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    const row = document.createElement('div');
    row.className = 'chat-row chat-row--me';
    row.innerHTML = `
      <div class="chat-avatar chat-avatar--me">あ</div>
      <div class="chat-bubble-wrap">
        <span class="chat-bubble chat-bubble--me">${text}</span>
        <div class="chat-meta">
          <span class="chat-time">${time}</span>
        </div>
      </div>`;
    document.getElementById('chat-list').insertBefore(row, anchor);
    anchor.scrollIntoView();
    input.value = '';
  }

  document.querySelector('.chat-send-btn').addEventListener('click', sendMessage);
  document.querySelector('.chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.isComposing) sendMessage();
  });
}
