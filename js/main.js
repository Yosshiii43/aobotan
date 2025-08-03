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
 * 電話番号表示形式
 *************************************************************************/
document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelectorAll('.js-form__tel input[type="tel"]')   // ← input 要素だけ取る
    .forEach(telField => {

      telField.addEventListener('blur', () => {
        let v = telField.value.trim();

        /* +8190… → 090… */
        if (/^\+81\d{9,10}$/.test(v)) {
          v = '0' + v.slice(3);
        }

        /* ハイフンが無ければ 3-4-4 / 2-4-4 に整形 */
        if (/^\d{10,11}$/.test(v)) {
          v = v.length === 11
            ? v.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')  // 11桁 → 3-4-4
            : v.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3'); // 10桁 → 2-4-4
        }

        telField.value = v;
      });
    });
});


/*************************************************************************
 * 資料請求フォーム
 *************************************************************************/
document.querySelectorAll('.js-dlForm').forEach(form => {
  const body = form.querySelector('.c-form__inner');
  const btn  = form.querySelector('.js-dlBtn');
  const msg  = form.querySelector('.js-thanksMsg');

  if (!form || !btn || !msg || !body) {
    console.warn('フォーム部品が見つかりません');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.reportValidity()) return;  // 必須・型チェック

    btn.disabled = true;
    btn.classList.add('is-disabled'); 

    try {
      /** 1) HTTP レイヤーのエラーを確認 */
      const res = await fetch(form.action, {
        method: 'POST',
        body  : new FormData(form),
        credentials: 'same-origin'
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      /** 2) JSON をパースしてアプリケーションエラーを確認 */
      const data = await res.json();               // ← ここで壊れた JSON なら catch へ
      if (data.status !== 'ok') throw new Error('API status NG');

      /** 3) 成功処理 */
      const h = body.offsetHeight;                 // 現在の高さを取得
      form.style.minHeight = `${h}px`;             // フォーム全体の最小高さを固定
      body.style.display = 'none';                 // 入力・ボタン・注意書きを隠す
      msg.style.display  = 'block';                // サンクスメッセージ表示

    } catch (err) {
      alert('送信に失敗しました。時間をおいて再度お試しください');
      btn.disabled = false;
      btn.classList.remove('is-disabled');
      console.error(err);                          // console で原因を確認できる
    }
  });
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
  const form = document.querySelector('.js-form');
  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');

  // 入力監視して送信ボタンの有効・無効を制御
  form.addEventListener('input', () => {
    submitButton.disabled = !form.checkValidity();
  });

  // 電話番号フィールドの整形
  form.querySelectorAll('input[type="tel"]').forEach(telField => {
    telField.addEventListener('blur', () => {
      let v = telField.value.trim();

      /* +8190… → 090… */
      if (/^\+81\d{9,10}$/.test(v)) {
        v = '0' + v.slice(3);
      }

      /* ハイフンが無ければ 3-4-4 / 2-4-4 に整形 */
      if (/^\d{10,11}$/.test(v)) {
        v = v.length === 11
          ? v.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')  // 11桁 → 3-4-4
          : v.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3'); // 10桁 → 2-4-4
      }

      telField.value = v;
    });
  });
});