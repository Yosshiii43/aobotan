<?php
$pageTitle = '私達について | 青牡丹工務店';
$pageDescription = '大阪府大阪市に拠点をおく青牡丹工務店が、丁寧な家造りで理想を現実にするために行なっていることをご紹介します。';
$ogImage = '/img/img_ogp.png';
$ogUrl = 'https://aobotan.yosshiii.site/about/';
$noIndex = true;
$heroImage = '/img/img_aboutHero01.jpg';
$heroImageAlt = '工務店の室内';
$heroImageWidth ='2240';
$heroImageHeight ='1322';
include $_SERVER['DOCUMENT_ROOT'] . '/inc/head.php';
?>

<body  class="exp-grid p-about" id="about">

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
          <h1 class="c-lowerHeaderSection__title">私達について</h1>
          <div class="c-lowerHeaderSection__text">
            <p>「丁寧な家造りで、理想を現実に」</p>
            <p>これを実現するために、わたしたちが行っていることを一部ご紹介します。</p>
          </div>
          <div class="c-lowerHeaderSection__button">
            <a class="c-button--b" href="#philosophy">経営理念</a>
            <a class="c-button--b" href="#profile">会社概要</a>
            <a class="c-button--b" href="#initiatives">安全への取り組み</a>
          </div>
          <div class="c-lowerHeaderSection__catch">
            <img src="/img/img_about01.svg" alt="">
          </div>
        </div>
      </section>

<?php include $_SERVER['DOCUMENT_ROOT'] . '/inc/footer.php'; ?>