<?php
$pageTitle = 'お問い合わせ | 青牡丹工務店';
$pageDescription = '大阪府大阪市に拠点をおく青牡丹工務店のお問い合わせフォームです。';
$ogImage = '/img/img_ogp.png';
$ogUrl = 'https://aobotan.yosshiii.site/contact/';
$noIndex = true;
$heroImage = '/img/img_contactHero01.jpg';
$heroImageAlt = '机に置かれた設計図と鉛筆';
$heroImageWidth ='2240';
$heroImageHeight ='1312';
include $_SERVER['DOCUMENT_ROOT'] . '/inc/head.php';
?>

<body  class="exp-grid p-contact" id="contact">

  <div class="l-shell">
    <!-- 全ページ共通のヘッダー -->
    <?php
    $is_top = false;
    include $_SERVER['DOCUMENT_ROOT'] . '/inc/header.php';
    ?>

    <main class="l-main">
      <!-- ヒーロー -->
      <?php include $_SERVER['DOCUMENT_ROOT'] . '/inc/hero.php'; ?>

      <!-- コンテンツ -->
      <section class="c-lowerHeaderSection">
        <div class="l-inner--703">
          <h1 class="c-lowerHeaderSection__title">お問い合わせ</h1>
          <div class="c-lowerHeaderSection__text">
            <p>青牡丹工務店のサービスにご興味を持って頂き、誠にありがとうございます。下記のフォームよりお問い合わせください。</p>
          </div>
          <div class="c-lowerHeaderSection__catch">
            <img src="/img/img_contact02.svg" alt="">
          </div>
        </div>
      </section>

      <article class="p-contactForm">
        <div class="l-inner--470">
          <div class="p-contactForm__progress">
            <div class="p-contactForm__progressItem is-current"><span>01</span><span>入力</span></div>
            <div class="p-contactForm__progressItem"><span>02</span><span>送信完了</span></div>
          </div><!-- .p-contactForm__progress -->

          <form action="">
            
          </form>
        </div><!-- .l-inner--470 -->
      </article><!-- .p-contactForm -->


      <?php include $_SERVER['DOCUMENT_ROOT'] . '/inc/contactSec.php'; ?>
<?php include $_SERVER['DOCUMENT_ROOT'] . '/inc/footer.php'; ?>