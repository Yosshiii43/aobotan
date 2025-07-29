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

<body  class="exp-grid">

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
       <div class="c-mainContainer">
        <div class="l-inner">
          <section class="c-headeSection">
            <h1>私達について</h1>
          </section>
        </div>
      </div>

<?php include $_SERVER['DOCUMENT_ROOT'] . '/inc/footer.php'; ?>