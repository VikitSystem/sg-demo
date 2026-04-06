/**
 * SG キャストポータル — ページスクリプト
 * 全ページ共通で読み込み、要素の存在でページを判別して初期化する
 */

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
        <div style="font-size:13px;color:var(--muted);">${featured.courseLabel}${extPart} &nbsp;|&nbsp; ${featured.deliveryLabel}</div>
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
      '<div class="card" style="color:var(--muted);font-size:13px;text-align:center;padding:20px;">本日の予約はありません</div>';
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
          <div class="booking-item__detail">${b.courseLabel}${extPart} &nbsp;|&nbsp; ${b.deliveryLabel}</div>
          ${noteHtml}
        </div>
      </div>`;
  }

  document.getElementById('today-bookings').innerHTML =
    TODAY_BOOKINGS.length
      ? TODAY_BOOKINGS.map(renderItem).join('')
      : '<div style="color:var(--muted);font-size:13px;text-align:center;padding:20px;">本日の予約はありません</div>';

  // モーダル
  function toast(msg) {
    const el = document.createElement('div');
    el.textContent = msg;
    Object.assign(el.style, {
      position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
      background: 'var(--panel)', border: '1px solid var(--line-2)', color: 'var(--text)',
      padding: '10px 20px', borderRadius: '8px', fontSize: '13px', zIndex: '400',
      boxShadow: 'var(--shadow)', whiteSpace: 'nowrap', opacity: '1', transition: 'opacity 0.3s',
    });
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 2000);
  }

  initBookingModal({
    onStart: () => toast('接客開始を記録しました（仮）'),
    onEnd:   () => toast('接客終了を記録しました（仮）'),
  });

  document.addEventListener('click', e => {
    const target = e.target.closest('[data-booking-id]');
    if (!target) return;
    const booking = bookingMap.get(target.dataset.bookingId);
    if (booking) openBookingModal(booking);
  });
}

// ═══════════════════════════════════════════════
// 予約一覧ページ  (#booking-list が存在する場合)
// ═══════════════════════════════════════════════
if (document.getElementById('booking-list')) {
  const { TODAY_BOOKINGS } = await import('./mock/schedule.js');

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
      <div class="${cardClass}" style="margin-bottom:10px;">
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

  document.getElementById('booking-list').innerHTML =
    TODAY_BOOKINGS.map(renderCard).join('');

  const counts = { completed: 0, active: 0, pending: 0 };
  TODAY_BOOKINGS.forEach(b => { if (b.status in counts) counts[b.status]++; });
  document.getElementById('badge-total').textContent     = `全 ${TODAY_BOOKINGS.length}件`;
  document.getElementById('badge-completed').textContent = `完了 ${counts.completed}件`;
  document.getElementById('badge-active').textContent    = `進行中 ${counts.active}件`;
  document.getElementById('badge-pending').textContent   = `予定 ${counts.pending}件`;
}

// ═══════════════════════════════════════════════
// 勤怠ページ  (#clock が存在する場合)
// ═══════════════════════════════════════════════
if (document.getElementById('clock')) {
  function updateClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hh}:${mm}`;
  }
  updateClock();
  setInterval(updateClock, 10000);

  function toast(msg) {
    const el = document.createElement('div');
    el.textContent = msg;
    Object.assign(el.style, {
      position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
      background: 'var(--panel)', border: '1px solid var(--line-2)', color: 'var(--text)',
      padding: '10px 20px', borderRadius: '8px', fontSize: '13px', zIndex: '200',
      boxShadow: 'var(--shadow)', whiteSpace: 'nowrap', opacity: '1', transition: 'opacity 0.3s',
    });
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 2000);
  }

  document.getElementById('btn-break').addEventListener('click', () => toast('休憩打刻を記録しました（仮）'));
  document.getElementById('btn-out').addEventListener('click',   () => toast('退勤打刻を記録しました（仮）'));
}
