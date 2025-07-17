/*************************************************************************
 * achievements__swiper
 *************************************************************************/
window.addEventListener('load', () => {
  const base = document.querySelectorAll('.p-achievements__swiper .swiper-slide');
  const wrapper = document.querySelector('.p-achievements__swiper .swiper-wrapper');
  for(let i=0;i<3;i++){            // 3 セット追加で計 20 枚
    base.forEach(slide=>wrapper.append(slide.cloneNode(true)));
  }
  const achievementsSwiper = new Swiper('.p-achievements__swiper', {
    loop: true,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    speed   : 10000,
    allowTouchMove: false,

    slidesPerView : 'auto',
    centeredSlides: false,
    spaceBetween  : 63,
    breakpoints   : { 768: { spaceBetween: 80 } },
    
    
    roundLengths: true,
    loopedSlides:20, 
    loopAdditionalSlides: 0,
  });
});


/*************************************************************************
 * examples-swiper
 *************************************************************************/
window.addEventListener('load', () => {
  const examplesSwiper = new Swiper('.p-examples__swiper', {
    /* 共通設定 ------------------------------------------------ */
    loop           : true,
    speed          : 600,
    navigation     : {
      nextEl : '.p-examplesSwiper-button-next',
      prevEl : '.p-examplesSwiper-button-prev',
    },

    /* ----- 画面幅別の表示枚数 ----- */
    breakpoints : {
      /*── SP / Tab ───────────────────────*/
      0 : {
        slidesPerView  : 1,
        slidesPerGroup : 1,
        centeredSlides : true,
        spaceBetween   : 0,
      },
      1024: {         // 1024px〜（PC）
        slidesPerView   : 2,
        slidesPerGroup  : 2,
        centeredSlides  : false,  // 2 枚セットを手動で中央へ
        spaceBetween    : 70,
      },
    },

    /* リサイズに追従させる（仕様 1-⑤） ----------------------- */
    observer       : true,
    observeParents : true,
  });

  /* Safari など一部環境で resize 検知が遅い場合の保険 */
  window.addEventListener('resize', () => examplesSwiper.update());
});