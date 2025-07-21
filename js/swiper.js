/*************************************************************************
 * swiper
 *************************************************************************/
const initSwiper = () => {
  const mySwiper = new Swiper('.p-about .swiper', {

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
window.addEventListener('load', function(){
  initSwiper(); // ページ読み込み後に初期化
});

window.addEventListener('resize', function() {
  initSwiper();
})