/*************************************************************************
 * main.js  –  ver.1.13
 * ハンバーガーメニュー制御 + スムーススクロール安定化 + ヘッダーずれ対策 + フェードイン即時表示
 *************************************************************************/

// リロード時に勝手に元のスクロール位置へ戻らないように
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
  const BREAKPOINT_PC = 1024;
  const HEADER_H = 79; // SP固定ヘッダー高さ
  const body = document.body;
  const nav = document.querySelector('.p-nav');
  const hamburger = document.querySelector('.c-hamburger');

  if (!nav) return;

  /* -------------------------------------------------
     0. 初期スクロール制御（iOS Safari 初回ズレ対策）
  ------------------------------------------------- */
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  function scrollToHash(href, smooth = true) {
    const target = document.querySelector(href);
    if (!target) return;

    const doScroll = () => {
      const rect = target.getBoundingClientRect();
      const targetTop = window.scrollY + rect.top;
      const offsetTop = window.innerWidth < BREAKPOINT_PC
        ? targetTop - HEADER_H
        : targetTop;

      // 1回目は即座にスクロール
      window.scrollTo({ top: offsetTop, behavior: 'auto' });

      // iOS Safari 対策：少し待って再計算してスクロール
      setTimeout(() => {
        const rect2 = target.getBoundingClientRect();
        const targetTop2 = window.scrollY + rect2.top;
        const offsetTop2 = window.innerWidth < BREAKPOINT_PC
          ? targetTop2 - HEADER_H
          : targetTop2;

        window.scrollTo({ top: offsetTop2, behavior: smooth ? 'smooth' : 'auto' });
      }, 350);
    };

    // viewport安定を少し待つ
    setTimeout(doScroll, 100);
  }

  // ページ直アクセスで #id がある場合
  if (location.hash) {
    scrollToHash(location.hash, false);
  }

  /* -------------------------------------------------
     1. SP モバイルメニュー開閉
  ------------------------------------------------- */
  const openMobileMenu = () => {
    nav.classList.add('is-open');
    body.classList.add('is-scrollLock');
    hamburger?.setAttribute('aria-expanded', 'true');
    nav.setAttribute('aria-hidden', 'false');
    nav.removeAttribute('inert');
  };

  const closeMobileMenu = () => {
    nav.classList.remove('is-open');
    body.classList.remove('is-scrollLock');
    hamburger?.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
    nav.setAttribute('inert', '');
  };

  hamburger?.addEventListener('click', () => {
    if (nav.classList.contains('is-open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  /* -------------------------------------------------
     2. ハッシュリンクのスムーススクロール
  ------------------------------------------------- */
  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;

    const href = a.getAttribute('href');
    if (!href || href === '#') {
      // ダミーリンクは閉じるだけ
      if (window.innerWidth < BREAKPOINT_PC) closeMobileMenu();
      e.preventDefault();
      return;
    }

    if (href.startsWith('#')) {
      e.preventDefault();
      if (window.innerWidth < BREAKPOINT_PC && nav.classList.contains('is-open')) {
        closeMobileMenu();
        setTimeout(() => scrollToHash(href), 310); // メニュー閉鎖後にスクロール
      } else {
        scrollToHash(href);
      }
    } else if (window.innerWidth < BREAKPOINT_PC) {
      // ページ遷移リンクは閉じてから遷移
      closeMobileMenu();
    }
  });

  /* -------------------------------------------------
     3. PCサブメニュー（hover & focus、Esc対応）
  ------------------------------------------------- */
  const isPC = () => window.innerWidth >= BREAKPOINT_PC;
  const parentItems = nav.querySelectorAll('.p-nav__item.has-child');
  let activeLi = null;
  let transitionMap = new WeakMap();

  function setState(li, state) {
    li.dataset.state = state;
  }

  function cleanupTransition(panel) {
    const listener = transitionMap.get(panel);
    if (listener) {
      panel.removeEventListener('transitionend', listener);
      transitionMap.delete(panel);
    }
  }

  function closePanel(li, instant = false) {
    const trigger = li.querySelector(':scope > .p-nav__link');
    const panel   = li.querySelector(':scope > .p-nav__sublist');
    if (!panel) return;

    const state = li.dataset.state;
    if (state === 'closed' || state === 'closing') return;

    cleanupTransition(panel);

    if (panel.style.height === '' || panel.style.height === 'auto') {
      panel.style.height = panel.scrollHeight + 'px';
      void panel.offsetWidth; // reflow
    }

    setState(li, 'closing');
    li.classList.add('is-animating');
    li.classList.remove('is-open');
    trigger?.setAttribute('aria-expanded', 'false');

    const doToZero = () => {
      panel.style.height    = '0px';
      panel.style.opacity   = '0';
      panel.style.transform = 'translateY(-2px)';
    };

    if (instant) {
      panel.style.transition = 'none';
      doToZero();
      panel.style.visibility = 'hidden';
      panel.offsetWidth;
      panel.style.transition = '';
      li.classList.remove('is-animating');
      setState(li, 'closed');
      return;
    }

    requestAnimationFrame(doToZero);

    const onEnd = (e) => {
      if (e.propertyName !== 'height') return;
      cleanupTransition(panel);
      panel.style.visibility = 'hidden';
      li.classList.remove('is-animating');
      setState(li, 'closed');
      if (activeLi === li) activeLi = null;
    };
    panel.addEventListener('transitionend', onEnd);
    transitionMap.set(panel, onEnd);
  }

  function openPanel(li) {
    if (!isPC()) return;
    if (li === activeLi && (li.dataset.state === 'open' || li.dataset.state === 'opening')) return;

    const trigger = li.querySelector(':scope > .p-nav__link');
    const panel   = li.querySelector(':scope > .p-nav__sublist');
    if (!panel) return;

    if (activeLi && activeLi !== li) closePanel(activeLi);

    cleanupTransition(panel);

    setState(li, 'opening');
    li.classList.add('is-open', 'is-animating');
    trigger?.setAttribute('aria-expanded', 'true');
    activeLi = li;

    panel.style.visibility = 'visible';
    panel.style.opacity    = '1';
    panel.style.transform  = 'translateY(0)';
    panel.style.height     = '0px';
    requestAnimationFrame(() => {
      panel.style.height = panel.scrollHeight + 'px';
    });

    const onEnd = (e) => {
      if (e.propertyName !== 'height') return;
      cleanupTransition(panel);
      if (li.dataset.state === 'opening') {
        panel.style.height = 'auto';
        li.classList.remove('is-animating');
        setState(li, 'open');
      }
    };
    panel.addEventListener('transitionend', onEnd);
    transitionMap.set(panel, onEnd);
  }

  function closeAll(instant = false) {
    parentItems.forEach(li => closePanel(li, instant));
    activeLi = null;
  }

  parentItems.forEach(li => {
    setState(li, 'closed');
    const trigger = li.querySelector(':scope > .p-nav__link');
    const panel   = li.querySelector(':scope > .p-nav__sublist');
    if (!trigger || !panel) return;

    // Focus
    trigger.addEventListener('focus', () => openPanel(li));

    // Keyboard
    trigger.addEventListener('keydown', e => {
      if (!isPC()) return;
      if (e.key === 'ArrowDown') {
        openPanel(li);
        const first = panel.querySelector('.p-nav__subitem .p-nav__link');
        if (first) {
          e.preventDefault();
          first.focus();
        }
      } else if (e.key === 'Escape') {
        closePanel(li);
        trigger.focus();
      }
    });

    panel.addEventListener('keydown', e => {
      if (!isPC()) return;
      if (e.key === 'Escape') {
        closePanel(li);
        trigger.focus();
      } else if (e.key === 'ArrowUp') {
        const links = [...panel.querySelectorAll('.p-nav__subitem .p-nav__link')];
        if (links.indexOf(document.activeElement) === 0) {
          e.preventDefault();
          trigger.focus();
        }
      }
    });

    li.addEventListener('focusout', e => {
      if (!isPC()) return;
      if (!li.classList.contains('is-open')) return;
      setTimeout(() => {
        const now = document.activeElement;
        if (li.contains(now)) return;
        if (!nav.contains(now)) {
          closePanel(li);
          return;
        }
        closePanel(li);
      }, 0);
    });

    // Hover
    li.addEventListener('pointerenter', () => {
      if (!isPC()) return;
      openPanel(li);
    });
    li.addEventListener('pointerleave', () => {
      if (!isPC()) return;
      closePanel(li);
    });
  });

  document.addEventListener('focusin', e => {
    if (isPC() && !nav.contains(e.target)) closeAll();
  });

  document.addEventListener('keydown', e => {
    if (isPC() && e.key === 'Escape') closeAll();
  });

  window.addEventListener('resize', () => {
    if (!isPC()) {
      parentItems.forEach(li => {
        const trigger = li.querySelector(':scope > .p-nav__link');
        const panel   = li.querySelector(':scope > .p-nav__sublist');
        cleanupTransition(panel);
        li.classList.remove('is-open','is-animating');
        setState(li, 'open');
        trigger?.setAttribute('aria-expanded', 'false');
        if (panel) {
          panel.style.height     = 'auto';
          panel.style.visibility = 'visible';
          panel.style.opacity    = '1';
          panel.style.transform  = 'none';
        }
      });
      activeLi = null;
    } else {
      closeAll(true);
    }
  });
});

const BREAKPOINT_PC = 1024;
const HEADER_H = 79;

function smoothScrollWithCorrection(id) {
  const target = document.querySelector(id);
  if (!target) return;

  let frameCount = 0;
  const maxFrames = 20;

  function adjustScroll(first) {
    const rect = target.getBoundingClientRect();
    const targetTop = window.scrollY + rect.top;
    const offsetTop = window.innerWidth < BREAKPOINT_PC
      ? targetTop - HEADER_H
      : targetTop;

    const currentY = window.scrollY;
    const diff = offsetTop - currentY;

    // 初回はautoでジャンプ、それ以降は誤差があれば補正
    if (first) {
      window.scrollTo({ top: offsetTop, behavior: 'auto' });
    } else if (Math.abs(diff) > 1) {
      window.scrollTo({ top: offsetTop, behavior: 'auto' });
    }

    frameCount++;
    if (frameCount < maxFrames && Math.abs(diff) > 1) {
      requestAnimationFrame(() => adjustScroll(false));
    }
  }

  requestAnimationFrame(() => adjustScroll(true));
}

// 初回アクセスでURLにハッシュがある場合だけ補正
window.addEventListener('load', () => {
  if (location.hash) {
    smoothScrollWithCorrection(location.hash);
  }
});

/*************************************************************************
 * ローディングアニメーション
 *************************************************************************/
(function(){
  const KEY    = 'loaderShown_v1';
  const loader = document.getElementById('logo_loader');
  if (!loader) return;

  // 2回目以降
  if (sessionStorage.getItem(KEY)) {
    loader.classList.add('is-hidden'); // CSSで visibility:hidden; など
    return;
  }

  // 初回: 退場アニメ完了で削除（slideOut）
  loader.addEventListener('animationend', e => {
    if (e.animationName === 'slideOut') {
      loader.classList.add('is-hidden');
      sessionStorage.setItem(KEY,'1');
    }
  });
})();

/*************************************************************************
 * フェードイン
 *************************************************************************/
document.addEventListener('DOMContentLoaded', () => {
  const targetElements = document.querySelectorAll('.js-fadeIn')
  // 該当の要素が存在しなければ処理を終了
  if (!targetElements) return

  // ブラウザの内側の高さ
  let windowHeight = window.innerHeight
  // スクロール量
  let lastScrollY = window.scrollY
  // スクロールイベントの連続発火を防ぐためのフラグ
  let isTicking = false

  // 画面リサイズ時にwindowHeightを更新
  window.addEventListener('resize', () => {
    windowHeight = window.innerHeight
  })

  // 要素が表示された時にクラスを付与する関数
  const inviewAnimation = () => {
    targetElements.forEach((element) => {
      const targetPosition = element.getBoundingClientRect().top + lastScrollY
      const isInview = lastScrollY > targetPosition - windowHeight + 100
      element.classList.toggle('is-inview', isInview)
    })
  }

  // スクロールイベント発火時に実行する関数
  const onScroll = () => {
    // inviewAnimationを実行中は処理をスキップ
    if (isTicking) return
    lastScrollY = window.scrollY
    isTicking = true
    // 1フレーム待ってからinviewAnimationを実行
    requestAnimationFrame(() => {
      inviewAnimation()
      isTicking = false
    })
  }

  // スクロールイベントを登録
  window.addEventListener('scroll', onScroll);
});


/*************************************************************************
 * 1行と複数行の判定
 *************************************************************************/
const updateLineHeight = () => {
  const elems = document.querySelectorAll('.js-lineHeight');

  elems.forEach(elem => {
    // 一旦クラスをリセット
    elem.classList.remove('lineHeight--single', 'lineHeight--multi');

    // getComputedStyleでline-heightを取得
    const computed = window.getComputedStyle(elem);
    const lineHeight = parseFloat(computed.lineHeight);
    const height = elem.offsetHeight;
    const lines = Math.round(height / lineHeight);

    if (lines > 1) {
      elem.classList.add('lineHeight--multi');
    } else {
      elem.classList.add('lineHeight--single');
    }
  });
};

// 初回実行
window.addEventListener('DOMContentLoaded', updateLineHeight);

// リサイズ時にも再実行（デバウンス付き）
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(updateLineHeight, 200);
});


/*************************************************************************
 * モーダル（Micromodal.js使用）
 *************************************************************************/

MicroModal.init({
  openClass: 'is-open',
  disableScroll: true,
    /* モーダルの中身が2回目以降もトップから表示されるようにする */
    onShow: (modal) => {
      const inner = modal.querySelector('.modal__inner');
      if (inner) {
        inner.scrollTop = 0;
      }
    }
});

/*************************************************************************
 * footer 
 *************************************************************************/
function updateFooterBreakVisibility() {
  const nav = document.querySelector('.p-footer__nav');
  const breakEl = nav?.querySelector('.p-footer__break');
  if (!nav || !breakEl) return;

  const items = [...nav.children].filter(el => el !== breakEl);
  if (items.length < 3) {
    breakEl.style.display = 'none';
    return;
  }

  const navWidth = nav.clientWidth;
  const gapX = 24; // 横gapと一致させる
  const width =
    items.slice(0, 3).reduce((sum, el) => sum + el.getBoundingClientRect().width, 0)
    + gapX * 2;

  breakEl.style.display = width <= navWidth ? 'block' : 'none';
}

window.addEventListener('DOMContentLoaded', updateFooterBreakVisibility);
window.addEventListener('resize', () => {
  clearTimeout(window._footerBreakTimer);
  window._footerBreakTimer = setTimeout(updateFooterBreakVisibility, 100);
});


/*************************************************************************
 * メールフォーム
 *************************************************************************/
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.p-contactForm__form');
  if (!form) return;

  const submitBtn = form.querySelector('.p-contactForm__button');
  const requiredFields = form.querySelectorAll('[required]');
  const telInput = form.querySelector('input[name="電話番号"]');

  // --- 初期状態で見た目を無効化 ---
  submitBtn.classList.add('is-disabled');

  // --- 電話番号を整形する関数 ---
  function formatPhoneNumber(value) {
    let val = value.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)) // 全角→半角
                   .replace(/[^\d-]/g, ''); // 数字とハイフン以外削除

    const raw = val.replace(/-/g, '');
    if (!/^0\d+$/.test(raw)) return val; // 先頭0以外は整形しない

    if (raw.length === 11) {
      // 携帯など 3-4-4
      return raw.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
    } else if (raw.length === 10) {
      // 入力者がハイフンを入れていたら優先
      if (value.includes('-')) return val;

      if (/^(0120|0800)/.test(raw)) {
        // フリーダイヤル 4-3-3
        return raw.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1-$2-$3');
      } else if (/^0[36]/.test(raw)) {
        // 東京03 / 大阪06 2-4-4
        return raw.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1-$2-$3');
      } else {
        // その他固定電話 3-3-4
        return raw.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
      }
    }
    return val; // 桁数不足はそのまま
  }

  // --- フィールドの入力チェック ---
  function validateField(field) {
    if (field === telInput) {
      field.value = formatPhoneNumber(field.value);
    }
    return field.checkValidity();
  }

  // --- ボタンの有効化制御 ---
  function updateSubmitState() {
    const allValid = Array.from(requiredFields).every(f => validateField(f));
    submitBtn.classList.toggle('is-disabled', !allValid);
  }

  // --- 入力イベント ---
  form.addEventListener('input', e => {
    const field = e.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;

    if (field.required || field === telInput) {
      validateField(field);
      updateSubmitState();
    }
  });

  // --- blur 時にバリデーション＆電話整形 ---
  form.addEventListener('blur', e => {
    const field = e.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;

    if (field.required || field === telInput) {
      validateField(field);
      updateSubmitState();
    }
  }, true);

  // --- submit 時 ---
  form.addEventListener('submit', e => {
    // is-disabled なら強制的にエラーを表示
    if (submitBtn.classList.contains('is-disabled')) {
      e.preventDefault();
      form.reportValidity();
    }
  });
});