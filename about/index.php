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

      <section class="p-aboutPhilosophy" id="philosophy">
        <div class="l-inner--923">
          <h2 class="p-aboutphilosophy__title c-aboutH2">経営理念</h2>
          <img 
            class="p-aboutphilosophy__contents"
            src="/img/img_about02.png" 
            alt="青牡丹工務店の経営理念を構成する6要素 
            ①【品質第一】常に成功水準の品質いを提供し、お客様の信頼と満足を勝ち取ります。
            ②【顧客志向】お客様のニーズを理解し、それに応えることを最優先とし、積極的かつ柔軟なサービスを提供します。
            ③【創造性と確信】常に新しいアイデアや技術を追求し、建築業界の常識に挑戦します。
            ④【社会貢献】地域社会や環境への責任を果たし、持続可能な未来の実現に貢献します。
            ⑤【チームワーク】協力と連携を重視し、一丸となって目標達成に取り組みます。
            ⑥【誠実と透明性】誠実な姿勢と聡明性を貫き、常に正直で公正な行動を心がけます。"
          >
        </div>
      </section>

      <section class="p-aboutProfile" id="profile">
        <div class="l-inner--953">
          <h2 class="p-aboutProfile__title c-aboutH2">会社概要</h2>
          <div class="p-aboutProfile__greeting">
            <div class="p-aboutProfile__greetingText">
              <p>青牡丹工務店は、1965年に創業しました。当初は小さな地域の工務店として始まりましたが、顧客志向の高いサービスと品質へのこだわりが徐々に評判を高め、地域の信頼を得ることとなりました。</p>
              <p>創業以来、私たちの経営理念は変わることなく、品質第一と顧客満足を常に追求することを掲げています。私たちは、建物を単なる建築物としてではなく、人々の生活や夢の実現の場として捉え、お客様の要望に応えるために最善の努力を惜しまず取り組んできました。</p>
              <p>その結果、地域社会だけでなく、広く多くのお客様からの信頼を得て、業績を着実に拡大させてまいりました。途中で直面した困難や挑戦もありましたが、常に創造性と革新を重視し、チーム全体で協力し合いながら、克服してまいりました。</p>
              <p>私たちの理念は、常に社会に貢献し、持続可能な未来を築くことにあります。地域社会や環境への配慮を大切にし、誠実な姿勢で仕事に取り組むことで、より良い社会を築いていくことを目指しています。</p>
              <p>今後も、お客様の声に耳を傾けながら、さらなる成長と発展を目指し、青牡丹工務店は邁進してまいります。</p>
            </div>
            <figure class="p-aboutProfile__greetingPhoto">
              <img src="/img/img_representativeDirector01.jpg" alt="代表取締役谷垣周平写真">
              <figcaption><span>代表取締役</span><span>谷垣周平</span></figcaption>
            </figure>
          </div><!-- .p-aboutProfile__greeting -->
          <table class="p-aboutProfile__table">
            <tr><th>商号</th><td>株式会社　青牡丹工務店</td></tr>
            <tr><th>創業</th><td>昭和40年5月3日</td></tr>
            <tr><th>資本金</th><td>2000万円</td></tr>
            <tr><th>従業員数</th><td>24人</td></tr>
            <tr><th>営業種目</th><td>総合建設設計施工・不動産業・倉庫業・リフォーム工事</td></tr>
            <tr><th>本社所在地</th><td><span>〒000-0000　</span>大阪府大阪市中央区北区南町5-6-7</td></tr>
            <tr><th>代表取締役</th><td>谷垣周平</td></tr>
          </table>
        </div>
      </section>

      <?php include $_SERVER['DOCUMENT_ROOT'] . '/inc/contactSec.php'; ?>
<?php include $_SERVER['DOCUMENT_ROOT'] . '/inc/footer.php'; ?>