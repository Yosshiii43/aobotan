/*************************************************************************
 * swiper
 *************************************************************************/
let mySwiper = null;
let currentBreakpoint = window.innerWidth >= 1024 ? 'pc' : 'sp';

const initSwiper = () => {

  // すでにSwiperが存在していたら破棄
  if (mySwiper !== null) {
    mySwiper.destroy(true, true);
  }

  mySwiper = new Swiper('.p-about .swiper', {
    slidesPerView: 'auto',
    spaceBetween: 16,
    loop: true,
    loopAdditionalSlides: 2,
    speed: 8000,
    autoplay: {
      delay: 0,
      //disableOnInteraction: false,
    },
    freeMode: {
      enabled: true,
      momentum: false,
    },
      breakpoints: {
      1024: {
        spaceBetween: 48,
      }
    },
  });
};

//初期化
window.addEventListener('load', () =>{
  initSwiper();
});

// ブレークポイントを跨いだときだけ再初期化
window.addEventListener('resize', () => {
  const newBreakpoint = window.innerWidth >= 1024 ? 'pc' : 'sp';
  if (newBreakpoint !== currentBreakpoint) {
    currentBreakpoint = newBreakpoint;
    initSwiper();
  }
});