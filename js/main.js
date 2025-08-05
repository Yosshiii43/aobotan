/*************************************************************************
 * main.js  –  ver.1.13
 * ハンバーガーメニュー制御 + スムーススクロール安定化 + ヘッダーずれ対策 + フェードイン即時表示
 *************************************************************************/

// ブラウザの位置復元を無効化
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
  const BREAKPOINT_PC = 1024;
  const HEADER_H = 79; // SP固定ヘッダー
  const isPC = () => window.innerWidth >= BREAKPOINT_PC;

  const body = document.body;
  const nav = document.querySelector('.p-nav');
  const hamburger = document.querySelector('.c-hamburger');
  if (!nav) return;

  // クリック時は Reduce Motion を無視してスムースさせたい場合は true（必要なければ false）
  const FORCE_SMOOTH_ON_CLICK = true;

  /* ---------------------------
     1) モバイルメニュー開閉
  --------------------------- */
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
    nav.classList.contains('is-open') ? closeMobileMenu() : openMobileMenu();
  });

  /* ---------------------------
     2) スクロール制御（自前アニメ＋微小差分スムース補正）
  --------------------------- */
  const computeOffsetTop = (el) => {
    const rect = el.getBoundingClientRect();
    const targetTop = window.scrollY + rect.top;
    return isPC() ? targetTop : (targetTop - HEADER_H);
  };

  let _animFrame = null;
  const cancelPending = () => {
    if (_animFrame) { cancelAnimationFrame(_animFrame); _animFrame = null; }
  };

  const easeOut = t => 1 - Math.pow(1 - t, 3); // 立ち上がり速め

  function animateScrollTo(targetY, duration = 450) {
    return new Promise(resolve => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce || duration <= 0) {
        window.scrollTo({ top: targetY, behavior: 'auto' });
        resolve();
        return;
      }
      const startY = window.scrollY;
      const dist = targetY - startY;
      const startT = performance.now();

      const step = (now) => {
        const t = Math.min(1, (now - startT) / duration);
        window.scrollTo(0, startY + dist * easeOut(t));
        if (t < 1) {
          _animFrame = requestAnimationFrame(step);
        } else {
          _animFrame = null;
          resolve();
        }
      };
      _animFrame = requestAnimationFrame(step);
    });
  }

  async function scrollToElement(el, wantSmooth = true) {
    if (!el) return;
    cancelPending();

    const reduceActive = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const useSmooth = wantSmooth && (!reduceActive || FORCE_SMOOTH_ON_CLICK);

    const firstY = computeOffsetTop(el);

    if (useSmooth) {
      // 距離に応じて時間可変（速め）
      const dist = Math.abs(firstY - window.scrollY);
      // 例：最短 220ms ～ 最長 650ms、係数も軽めに
      const duration = Math.max(220, Math.min(650, 220 + dist * 0.22));
      await animateScrollTo(firstY, duration);

      // 微小差分も短めで仕上げ（ジャンプなし）
      const finalY = computeOffsetTop(el);
      const diff = Math.abs(finalY - window.scrollY);
      if (diff > 6) {
        const microDur = Math.max(80, Math.min(140, diff * 0.6));
        await animateScrollTo(finalY, microDur);
      }
    } else {
      window.scrollTo({ top: firstY, behavior: 'auto' });
    }
  }

  /* ---------------------------
     2.5) 到着時の“延期スムース”処理（別ページ→ # のため）
     - クリック時に sessionStorage へ記録したターゲットを到着後にスムース
  --------------------------- */
  (function handleDeferredSmooth() {
    try {
      const raw = sessionStorage.getItem('DEFER_SMOOTH_TARGET');
      if (!raw) return;
      const data = JSON.parse(raw);
      // 到着ページが一致しているときだけ実行
      const arrivedPath = location.pathname + location.search;
      if (data && data.path === arrivedPath && data.hash) {
        const el = document.querySelector(data.hash);
        // 実行したら消す（再読込で二重にならないように）
        sessionStorage.removeItem('DEFER_SMOOTH_TARGET');
        if (el) {
          // 画像/フォントを少し待ってからスムース開始
          window.addEventListener('load', () => {
            setTimeout(() => scrollToElement(el, true), 60);
          }, { once: true });
        }
      }
    } catch (e) {
      // 破損していたら削除
      sessionStorage.removeItem('DEFER_SMOOTH_TARGET');
    }
  })();

  /* ---------------------------
     3) クリック捕捉（キャプチャ）：
        - 同一ページの # は自前スムース
        - 別ページの # は「延期スムース」方式に差し替え
  --------------------------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;

    const raw = a.getAttribute('href');
    if (!raw) return;

    // 1) ダミー #
    if (raw === '#') {
      if (!isPC() && nav.classList.contains('is-open')) closeMobileMenu();
      e.preventDefault();
      return;
    }

    let urlObj = null;
    try { urlObj = new URL(raw, location.href); } catch {}

    const hasHash = raw.startsWith('#') || (urlObj && urlObj.hash);
    if (!hasHash) {
      // 通常リンク：SPは閉じてから遷移
      if (!isPC() && nav.classList.contains('is-open')) closeMobileMenu();
      return; // デフォルト遷移
    }

    // 同一ページの # ？
    let samePage = false, hash = null;
    if (raw.startsWith('#')) {
      samePage = true;
      hash = raw;
    } else if (urlObj) {
      samePage = (urlObj.origin === location.origin && urlObj.pathname === location.pathname);
      hash = urlObj.hash;
    }

    if (samePage) {
      // ---- 同一ページ：その場でスムース ----
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();

      if (!isPC() && nav.classList.contains('is-open')) {
        closeMobileMenu();
        setTimeout(() => {
          scrollToElement(target, true);
          history.replaceState(null, '', location.pathname + location.search);
        }, 310);
      } else {
        scrollToElement(target, true);
        history.replaceState(null, '', location.pathname + location.search);
      }
      return;
    }

    // ---- 別ページ：延期スムースに差し替え ----
    // 例: /about#initiatives → /about へ遷移し、到着後にスムースで hash 位置へ
    if (urlObj) {
      e.preventDefault();
      // 目標を保存（同一オリジンのみ）
      sessionStorage.setItem(
        'DEFER_SMOOTH_TARGET',
        JSON.stringify({ path: urlObj.pathname + urlObj.search, hash: urlObj.hash, ts: Date.now() })
      );

      // SP は閉じてから遷移
      if (!isPC() && nav.classList.contains('is-open')) {
        closeMobileMenu();
        setTimeout(() => { location.assign(urlObj.pathname + urlObj.search); }, 310);
      } else {
        location.assign(urlObj.pathname + urlObj.search);
      }
      return;
    }

  }, { capture: true });

  /* ---------------------------
     4) PCサブメニュー（hover / focus / Esc / 矢印）
     ※あなたの既存実装を踏襲
  --------------------------- */
  const parentItems = nav.querySelectorAll('.p-nav__item.has-child');
  let activeLi = null;
  let transitionMap = new WeakMap();

  const setState = (li, state) => { li.dataset.state = state; };
  const cleanupTransition = (panel) => {
    const listener = transitionMap.get(panel);
    if (listener) {
      panel.removeEventListener('transitionend', listener);
      transitionMap.delete(panel);
    }
  };

  function closePanel(li, instant = false) {
    const trigger = li.querySelector(':scope > .p-nav__link');
    const panel   = li.querySelector(':scope > .p-nav__sublist');
    if (!panel) return;
    const state = li.dataset.state;
    if (state === 'closed' || state === 'closing') return;

    cleanupTransition(panel);

    if (panel.style.height === '' || panel.style.height === 'auto') {
      panel.style.height = panel.scrollHeight + 'px';
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

    trigger.addEventListener('focus', () => openPanel(li));

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

    li.addEventListener('focusout', () => {
      if (!isPC() || !li.classList.contains('is-open')) return;
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

    li.addEventListener('pointerenter', () => { if (isPC()) openPanel(li); });
    li.addEventListener('pointerleave', () => { if (isPC()) closePanel(li); });
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
        setState(li, 'open'); // SPでは常時展開扱い
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

  /* ---------------------------
     5) 直URLで # が付いて来た場合（ユーザー直打ち）
        → 正確さ最優先の補正（従来通り）
  --------------------------- */
  function initialHashScroll() {
    const hash = location.hash;
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;

    setTimeout(() => {
      const y0 = computeOffsetTop(target);
      window.scrollTo({ top: y0, behavior: 'auto' });

      let attempts = 0;
      const maxAttempts = 5;
      const rafAdjust = () => {
        attempts++;
        const y = computeOffsetTop(target);
        if (Math.abs(y - window.scrollY) > 1 && attempts <= maxAttempts) {
          window.scrollTo({ top: y, behavior: 'auto' });
          _animFrame = requestAnimationFrame(rafAdjust);
        } else {
          _animFrame = null;
        }
      };
      _animFrame = requestAnimationFrame(rafAdjust);
    }, 80);
  }
  window.addEventListener('load', () => {
    initialHashScroll();
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