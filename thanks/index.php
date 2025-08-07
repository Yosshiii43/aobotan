<?php
$pageTitle = '送信完了 | 青牡丹工務店';
$pageDescription = '大阪府大阪市に拠点をおく青牡丹工務店のお問い合わせフォーム送信完了画面です。';
$ogImage = 'https://aobotan.yosshiii.site/img/img_ogp.png';
$ogUrl = 'https://aobotan.yosshiii.site/thanks/';
$ogType = 'article';
$noIndex = true;
$heroImage = '/img/img_contactHero01.jpg';
$heroImageAlt = '机に置かれた設計図と鉛筆';
$heroImageWidth ='2240';
$heroImageHeight ='1312';
include $_SERVER['DOCUMENT_ROOT'] . '/inc/head.php';
?>

<body  class="exp-grid p-thanks" id="thanks">

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
          <h1 class="c-lowerHeaderSection__title">送信完了</h1>
          <div class="c-lowerHeaderSection__text">
            <p>お問い合わせありがとうございました</p>
            <p>後日担当者より返信させていただきますので、お待ち下さいませ。</p>
          </div>
          <div class="c-lowerHeaderSection__catch">
            <img src="/img/img_contact02.svg" alt="">
          </div>
        </div>
      </section>

      <div class="p-contact__wrapper l-inner--880">
        <div class="l-inner--470">
          <div class="p-contactForm">
            <div class="p-contactForm__progress">
              <div class="p-contactForm__progressItem"><span>01</span><span>入力</span></div>
              <div class="p-contactForm__progressItem is-current"><span>02</span><span>送信完了</span></div>
            </div><!-- .p-contactForm__progress -->
            <a class="c-button--a p-contactForm__button" href="/">トップページに戻る</a>
          </div><!-- .p-contactForm -->
        </div><!-- .l-inner--470 -->

        <div class="p-contact__tel">
          <p>お電話も受け付けています。</p>
          <p><a href="tel:0000-000-0000">0000-000-0000</a></p>
          <p>営業時間10:00-20:00</p>
        </div>

      </div><!-- .p-contact_wrapper -->

      <?php include $_SERVER['DOCUMENT_ROOT'] . '/inc/contactSec.php'; ?>
<?php include $_SERVER['DOCUMENT_ROOT'] . '/inc/footer.php'; ?>