<?php
$pageTitle = '送信完了 | 青牡丹工務店';
$pageDescription = '大阪府大阪市に拠点をおく青牡丹工務店にお問い合わせをありがとうございました。';
$ogImage = '/img/img_ogp.png';
$ogUrl = 'https://aobotan.yosshiii.site/thanks/';
$noIndex = true;
$heroImage = '/img/img_serviceHero01.jpg';
$heroImageAlt = '建築模型';
$heroImageWidth ='2240';
$heroImageHeight ='1342';
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
            <p>お問い合わせありがとうございました。</p>
            <p>後日担当者より返信させていただきますので、お待ち下さいませ。</p>
          </div>
          <div class="c-lowerHeaderSection__button">
            <a class="c-button--b" href="#housing">住宅建築・リフォーム</a>
            <a class="c-button--b" href="#business">法人新築・リフォーム</a>
            <a class="c-button--b" href="#public">公共工事</a>
          </div>
          <div class="c-lowerHeaderSection__catch">
            <img src="/img/img_service01.svg" alt="">
          </div>
        </div>
      </section>

      

      <?php include $_SERVER['DOCUMENT_ROOT'] . '/inc/contactSec.php'; ?>
<?php include $_SERVER['DOCUMENT_ROOT'] . '/inc/footer.php'; ?>