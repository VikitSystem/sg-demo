/**
 * サイドメニュー（右スライドパネル）
 * openSidemenu() でパネルを表示する
 */
(function () {
  const MENU_ITEMS = [
    '本社閲覧アナリティクス',
    '勤怠管理システム',
    '予約管理システム',
    '顧客用画面-管理画面',
    '広告用画面-管理画面',
    'キャスト用ページ-管理画面',
    '送迎管理-管理画面',
    '求人管理システム',
  ];

  /* ── CSS ──────────────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    .smenu-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0);
      z-index: 1000;
      pointer-events: none;
      transition: background 0.25s;
    }
    .smenu-overlay.is-open {
      background: rgba(0,0,0,0.55);
      pointer-events: auto;
    }
    .smenu-panel {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 260px;
      background: var(--panel, #111522);
      border-left: 1px solid var(--line, rgba(255,255,255,0.08));
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
      box-shadow: -4px 0 24px rgba(0,0,0,0.4);
    }
    .smenu-overlay.is-open .smenu-panel {
      transform: translateX(0);
    }
    .smenu-panel__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-bottom: 1px solid var(--line, rgba(255,255,255,0.08));
      background: rgba(122,162,255,0.06);
    }
    .smenu-panel__title {
      font-size: 13px;
      font-weight: 600;
      color: var(--blue, #7aa2ff);
      letter-spacing: 0.04em;
    }
    .smenu-panel__close {
      background: transparent;
      border: none;
      color: var(--muted, #aab3c5);
      font-size: 16px;
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 4px;
      line-height: 1;
    }
    .smenu-panel__close:hover { color: var(--text, #e9edf5); background: var(--hover, rgba(255,255,255,0.06)); }
    .smenu-panel__body {
      flex: 1;
      overflow-y: auto;
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .smenu-btn {
      display: block;
      width: 100%;
      padding: 10px 14px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 6px;
      color: var(--text, #e9edf5);
      font-size: 13px;
      text-align: left;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
    }
    .smenu-btn:hover {
      background: var(--hover, rgba(255,255,255,0.06));
      border-color: var(--line, rgba(255,255,255,0.08));
      color: var(--blue, #7aa2ff);
    }
  `;
  document.head.appendChild(style);

  /* ── DOM ──────────────────────────────────────────────── */
  const overlay = document.createElement('div');
  overlay.className = 'smenu-overlay';

  const panel = document.createElement('div');
  panel.className = 'smenu-panel';

  panel.innerHTML = `
    <div class="smenu-panel__head">
      <span class="smenu-panel__title">機能選択</span>
      <button class="smenu-panel__close" id="smenu-close">✕</button>
    </div>
    <div class="smenu-panel__body">
      ${MENU_ITEMS.map(item => `<button class="smenu-btn">${item}</button>`).join('')}
    </div>
  `;

  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  /* ── 開閉 ─────────────────────────────────────────────── */
  function open()  { overlay.classList.add('is-open'); }
  function close() { overlay.classList.remove('is-open'); }

  window.openSidemenu = open;

  document.getElementById('smenu-close').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
