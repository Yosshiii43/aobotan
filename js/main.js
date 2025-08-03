/*************************************************************************
 * main.js  –  ver.1.13
 * ハンバーガーメニュー制御 + スムーススクロール安定化 + ヘッダーずれ対策 + フェードイン即時表示
 *************************************************************************/

// リロード時に勝手に元のスクロール位置へ戻らないように
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
  /* ─────────────────────────────────────
     0. 定数 & 要素取得
  ───────────────────────────────────── */
  const header    = document.getElementById('js-header');
  const mqPC      = window.matchMedia('(min-width: 1024px)');
  const hamburger = document.getElementById('js-hamburger');
  const nav       = document.getElementById('js-navWrapper');
  const body      = document.body;
  if (!nav) return;

  /* ヘッダー高さを CSS変数から取得 */
  const getHeaderHeight = () => {
    // PCのときは高さ0として扱う（ヘッダーを引かない）
    if (mqPC.matches) return 0;

    const header = document.querySelector('#js-header'); // 適宜修正
    return header ? header.offsetHeight : 0;
  };

  /* ─────────────────────────────────────
     1. ナビ状態を強制リセット
  ───────────────────────────────────── */
  const closeMobileMenu = () => {
    hamburger?.classList.remove('is-open');
    hamburger?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    body.classList.remove('is-scrollLock');
    nav.setAttribute('aria-hidden', 'true');
    nav.setAttribute('inert', '');
  };

  const openDesktopNav = () => {
    hamburger?.classList.remove('is-open');
    hamburger?.setAttribute('aria-expanded', 'false');
    body.classList.remove('is-scrollLock');
    nav.classList.remove('is-open');
    nav.removeAttribute('aria-hidden');
    nav.removeAttribute('inert');
  };

  /* ─────────────────────────────────────
     2. ハンバーガー開閉
  ───────────────────────────────────── */
  const toggleMenu = () => {
    const isOpen = nav.classList.toggle('is-open');
    hamburger?.setAttribute('aria-expanded', isOpen);
    nav.setAttribute('aria-hidden', !isOpen);
    body.classList.toggle('is-scrollLock', isOpen);

    if (isOpen) {
      nav.removeAttribute('inert');
    } else {
      const focused = document.activeElement;
      if (nav.contains(focused)) focused.blur();
      nav.setAttribute('inert', '');
    }
  };

  hamburger?.addEventListener('click', toggleMenu);

  /* ─────────────────────────────────────
     3. スムーススクロール処理
  ───────────────────────────────────── */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const smoothScrollTo = (targetY, duration = 350) => {
    if (reduceMotion) {
      window.scrollTo(0, targetY);
      return;
    }
    const startY = window.pageYOffset;
    const dist   = targetY - startY;
    const startT = performance.now();
    const easeOut = t => t * (2 - t);

    const step = now => {
      const t = Math.min(1, (now - startT) / duration);
      window.scrollTo(0, startY + dist * easeOut(t));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const scrollToTarget = (target) => {
    const headerH = getHeaderHeight();
    let retry = 0;
    const maxRetry = 10;

    const waitForStable = () => {
      const rect = target.getBoundingClientRect();
      const offsetY = rect.top + window.pageYOffset - headerH;

      if (retry > 1) {
        smoothScrollTo(offsetY);
        setTimeout(() => {
          const correctedOffsetY =
            target.getBoundingClientRect().top + window.pageYOffset - getHeaderHeight();
          window.scrollTo({ top: correctedOffsetY });
        }, 400);
      } else {
        retry++;
        requestAnimationFrame(waitForStable);
      }
    };

    waitForStable();
  };

  /* ─────────────────────────────────────
     4. アンカーリンククリック
  ───────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      e.preventDefault();
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      history.pushState(null, '', href);
      if (nav.classList.contains('is-open')) toggleMenu();

      document.querySelectorAll('.c-fadeIn').forEach(el => {
        el.classList.add('is-inview');
      });

      scrollToTarget(target);
    });
  });

  /* ─────────────────────────────────────
     5. PC/SP幅切替の状態初期化
  ───────────────────────────────────── */
  mqPC.addEventListener('change', e => {
    if (e.matches) {
      openDesktopNav();
    } else {
      closeMobileMenu();
    }
  });

  if (mqPC.matches) {
    openDesktopNav();
  } else {
    closeMobileMenu();
  }

  /* ─────────────────────────────────────
     6. サブメニュー（実測 height アニメ） PC 専用
  ───────────────────────────────────── */
  const BREAKPOINT_PC = 1024;
  const isPC = () => window.innerWidth >= BREAKPOINT_PC;
  const parentItems = nav.querySelectorAll('.p-nav__item.has-child');

  let activeLi = null; // 現在 open / opening の LI
  let transitionMap = new WeakMap(); // panel => listener (キャンセル用)

  function setState(li, state) {
    li.dataset.state = state; // デバッグしやすくする
  }

  function cleanupTransition(panel) {
    const listener = transitionMap.get(panel);
    if (listener) {
      panel.removeEventListener('transitionend', listener);
      transitionMap.delete(panel);
    }
  }

  /* 強制的に閉じ状態へ（即座に height:0 へ遷移させアニメに任せる） */
  function closePanel(li, instant = false) {
    const trigger = li.querySelector(':scope > .p-nav__link');
    const panel   = li.querySelector(':scope > .p-nav__sublist');
    if (!panel) return;

    const state = li.dataset.state;
    if (state === 'closed' || state === 'closing') return;

    cleanupTransition(panel);

    // height:auto なら現高さを固定
    if (panel.style.height === '' || panel.style.height === 'auto') {
      panel.style.height = panel.scrollHeight + 'px';
      // reflow
      void panel.offsetWidth;
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
      // アニメを使わず即閉じ（リサイズ / 全閉など）
      panel.style.transition = 'none';
      doToZero();
      panel.style.visibility = 'hidden';
      panel.offsetWidth; // reflow
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

  /* 開く */
  function openPanel(li) {
    if (!isPC()) return;
    if (li === activeLi && (li.dataset.state === 'open' || li.dataset.state === 'opening')) return;

    const trigger = li.querySelector(':scope > .p-nav__link');
    const panel   = li.querySelector(':scope > .p-nav__sublist');
    if (!panel) return;

    // 他を全部閉じる
    if (activeLi && activeLi !== li) {
      closePanel(activeLi);
    }

    cleanupTransition(panel);

    setState(li, 'opening');
    li.classList.add('is-open', 'is-animating');
    trigger?.setAttribute('aria-expanded', 'true');
    activeLi = li;

    // 初期値セット
    panel.style.visibility = 'visible';
    panel.style.opacity    = '1';
    panel.style.transform  = 'translateY(0)';
    panel.style.height     = '0px'; // まず0確定（再オープンの残骸防止）
    // 1フレーム後に実高セット
    requestAnimationFrame(() => {
      const targetH = panel.scrollHeight;
      panel.style.height = targetH + 'px';
    });

    const onEnd = (e) => {
      if (e.propertyName !== 'height') return;
      cleanupTransition(panel);
      // 最終状態へ
      if (li.dataset.state === 'opening') {
        panel.style.height = 'auto';
        li.classList.remove('is-animating');
        setState(li, 'open');
      }
    };
    panel.addEventListener('transitionend', onEnd);
    transitionMap.set(panel, onEnd);
  }

  /* 全閉（instant=true で一気に） */
  function closeAll(instant = false) {
    parentItems.forEach(li => closePanel(li, instant));
    activeLi = null;
  }

  /* イベント登録 */
  parentItems.forEach(li => {
    setState(li, 'closed');

    const trigger = li.querySelector(':scope > .p-nav__link');
    const panel   = li.querySelector(':scope > .p-nav__sublist');
    if (!trigger || !panel) return;

    /* フォーカスで開く */
    trigger.addEventListener('focus', () => openPanel(li));

    /* 親リンクキーボード */
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

    /* サブ内部 */
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

        // 次のフォーカス先確定を待ってから判定
        setTimeout(() => {
          const now = document.activeElement;
          if (li.contains(now)) return;           // まだ li 内にいる
          if (!nav.contains(now)) {
            // nav 外 → document の focusin ハンドラが全閉するので任意
            closePanel(li);
            return;
          }
          // nav 内の別要素（他の親でない）へ移ったので閉じる
          closePanel(li);
        }, 0);
      });

    /* Hover: pointerenter / pointerleave */
    li.addEventListener('pointerenter', () => {
      if (!isPC()) return;
      openPanel(li);
    });

    li.addEventListener('pointerleave', (e) => {
      if (!isPC()) return;
      // すぐ他 LI に入るならその LI の pointerenter で openPanel → こちらは閉じるだけ
      // 少し猶予欲しければ setTimeout 追加
      closePanel(li);
    });
  });

  /* Nav 外へフォーカス移動で全閉 */
  document.addEventListener('focusin', e => {
    if (isPC() && !nav.contains(e.target)) {
      closeAll();
    }
  });

  /* Esc グローバル */
  document.addEventListener('keydown', e => {
    if (isPC() && e.key === 'Escape') {
      closeAll();
    }
  });

  /* リサイズ */
  window.addEventListener('resize', () => {
    if (!isPC()) {
      // SP: サブは常時展開
      parentItems.forEach(li => {
        const trigger = li.querySelector(':scope > .p-nav__link');
        const panel   = li.querySelector(':scope > .p-nav__sublist');
        cleanupTransition(panel);
        li.classList.remove('is-open','is-animating');
        setState(li, 'open'); // SPでは開き扱い
        trigger?.setAttribute('aria-expanded', 'false'); // SPは視覚開なので任意
        if (panel) {
          panel.style.height     = 'auto';
          panel.style.visibility = 'visible';
          panel.style.opacity    = '1';
          panel.style.transform  = 'none';
        }
      });
      activeLi = null;
    } else {
      closeAll(true); // instant
    }
  });
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