/**
 * report/booking/popup.js
 * センターポップアップ初期化モジュール
 *
 * 使い方:
 *   import { initPopup } from './popup.js';
 *   const { openPopup, closePopup } = await initPopup();
 *   openPopup('femaleLine');  // または 'deliShiji'
 */

const MESSAGES = {
  femaleLine: {
    title: '女性ライン',
    body:
`お疲れ様です。
本日のご予約が確定いたしました。
内容をご確認のうえ、時間厳守でお願いいたします。

ご不明点がある場合は、お早めにご連絡ください。
よろしくお願いいたします。`,
  },
  deliShiji: {
    title: 'デリ指示',
    body:
`お疲れ様です。
以下の内容でデリバリーをお願いいたします。

予約詳細の場所・部屋番号・出発時刻をご確認の上、
時間に余裕を持って出発してください。

到着後は必ずご連絡をお願いいたします。
よろしくお願いいたします。`,
  },
};

export async function initPopup() {

  // popup.html をフェッチして <body> 末尾に注入
  const htmlUrl = new URL('./popup.html', import.meta.url);
  const res  = await fetch(htmlUrl);
  const html = await res.text();
  document.body.insertAdjacentHTML('beforeend', html);

  const popup      = document.getElementById('center-popup');
  const popupTitle = document.getElementById('center-popup-title');
  const popupBody  = document.getElementById('center-popup-body');

  function openPopup(key) {
    const msg = MESSAGES[key];
    popupTitle.textContent = msg.title;
    popupBody.textContent  = msg.body;
    popup.setAttribute('aria-hidden', 'false');
    popup.classList.add('is-open');
  }

  function closePopup() {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
  }

  const toast = document.getElementById('center-popup-toast');
  let toastTimer = null;

  function showToast() {
    if (toastTimer) clearTimeout(toastTimer);
    toast.setAttribute('aria-hidden', 'false');
    toast.classList.add('is-visible');
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
      toast.setAttribute('aria-hidden', 'true');
      toastTimer = null;
    }, 3000);
  }

  document.getElementById('center-popup-copy').addEventListener('click', e => {
    e.stopPropagation();
    navigator.clipboard.writeText(popupBody.textContent).then(showToast);
  });

  document.getElementById('center-popup-close').addEventListener('click', e => { e.stopPropagation(); closePopup(); });
  document.getElementById('center-popup-backdrop').addEventListener('click', e => { e.stopPropagation(); closePopup(); });

  function isPopupOpen() {
    return popup.getAttribute('aria-hidden') === 'false';
  }

  return { openPopup, closePopup, isPopupOpen };
}
