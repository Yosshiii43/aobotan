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
  const nav       = document.getElementById('global-nav');
  const body      = document.body;
  if (!nav) return;

  /* ヘッダー高さを CSS変数から取得 */
  const getHeaderHeight = () => {
    const val = getComputedStyle(document.documentElement)
                .getPropertyValue('--header-h').trim();
    const px = parseInt(val, 10);
    if (isNaN(px)) {
      console.warn('⚠️ --header-h が無効です。デフォルト64pxを使用');
      return 64;
    }
    return px;
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
});

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
 * アコーディオン
 *************************************************************************/
document.querySelectorAll('.js-accordionDetails').forEach(details => {
  const summary  = details.querySelector('.js-accordionSummary');
  const content  = details.querySelector('.js-accordionContent');
  let   anim     = null;                       // 進行中アニメを保持
  const DURATION = 300;                        // 時間(ms) 好みで

  summary.addEventListener('click', e => {
    e.preventDefault();

    /* 進行中アニメがあればキャンセル（連打で “ガクッ” とカクついて見えることの対策） */
    if (anim) { 
      anim.cancel(); 
    }

    const isOpening = !details.open;           // これから「開く」か？
    const startH    = content.offsetHeight;    // 今まさに見えている高さ
    const endH      = isOpening ? content.scrollHeight // 全部表示したときの高さ
                                : 0;                  // 閉じるときは 0

    /* 開くときは先に open=true にしてスクリーンリーダーにも知らせる */
    if (isOpening) {
      details.open = true;
    }

    /* Web Animations API で高さを補間 */
    anim = content.animate( //.animate()メソッドの返り値をanimに格納
      { height: [`${startH}px`, `${endH}px`] }, // from → to
      { duration: DURATION, easing: 'ease', fill: 'forwards' } //アニメーション終了後にアニメーション終了時の状態を維持するにはforwards
    );

    /* アニメ終了後の後始末 */
    anim.onfinish = () => {
      if (isOpening) {
        // 開き終わったら height:auto に戻す  →  中身が増減しても追従
        content.style.height = 'auto';
      } else {
        // 閉じ終わったら open=false に戻し、height 指定を撤去
        details.open = false;
        content.style.height = '';
      }
      anim = null;
    };
  });
});