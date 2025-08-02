<?php
$pageTitle = '事業内容 | 青牡丹工務店';
$pageDescription = '大阪府大阪市に拠点をおく青牡丹工務店の事業内容についてご説明いたします。';
$ogImage = '/img/img_ogp.png';
$ogUrl = 'https://aobotan.yosshiii.site/service/';
$noIndex = true;
$heroImage = '/img/img_serviceHero01.jpg';
$heroImageAlt = '建築模型';
$heroImageWidth ='2240';
$heroImageHeight ='1342';
include $_SERVER['DOCUMENT_ROOT'] . '/inc/head.php';
?>

<body  class="exp-grid p-service" id="service">

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

      <?php include $_SERVER['DOCUMENT_ROOT'] . '/inc/contactSec.php'; ?>
<?php include $_SERVER['DOCUMENT_ROOT'] . '/inc/footer.php'; ?>