<?php
$pageTitle = '事業内容 | 青牡丹工務店';
$pageDescription = '大阪府大阪市に拠点をおく青牡丹工務店の事業内容についてご説明いたします。';
$ogImage = 'https://aobotan.yosshiii.site/img/img_ogp.png';
$ogUrl = 'https://aobotan.yosshiii.site/service/';
$ogType = 'article';
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
      <section class="c-lowerHeaderSection">
        <div class="l-inner--703">
          <h1 class="c-lowerHeaderSection__title">事業内容</h1>
          <div class="c-lowerHeaderSection__text">
            <p>青牡丹工務店は、「住宅建築・リフォーム」「方針新築・リフォーム」「公共工事」の3つを事業の柱としています。ここではそれぞれご紹介します。</p>
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

      <section class="p-serviceContent p-serviceContent--housing" id="housing">
        <div class="l-inner--960">
          <img class="p-serviceContent__mainImg" src="/img/img_service02.jpg" alt="オリエンタルな雰囲気のリビングダイニング" width="1920" height="800">
          <div class="p-serviceContent__body">
            <div>
              <h2 class="p-serviceContent__title">住宅建築・リフォーム</h2>
              <div class="p-serviceContent_discription">
                <div class="p-serviceContent_discriptionLead">
                  <p>当社の住宅建築・リフォーム事業では、お客様の夢や理想を具現化するためのサービスを提供しています。</p>
                </div>
                <div class="p-serviceContent_discriptionText">
                  <p>新しい家を建てる際には、お客様のニーズや希望を理解し、オーダーメイドの住宅を設計・施工します。</p>
                  <p>また、古くなったり、機能性が低下したりした建物を、新しい価値ある空間へと再生するリフォームサービスを提供しています。お客様のライフスタイルやニーズに合わせて、効率的かつリーズナブルなリフォームプランをご提案し、品質に妥協することなく施工いたします。</p>
                </div>
              </div><!-- .p-serviceContent_discription -->
              <div class="p-serviceContent__cases">
                <article class="p-serviceContent__case">
                  <h3>芦屋（兵庫県）のコテージ付き住宅</h3>
                  <figure>
                    <img  src="/img/img_housesWithCottages01.jpg" alt="コテージのある2階建て住宅外観" width="704" height="548">
                    <figcaption>施工年月：R2年2月 構造：S造</figcaption>
                  </figure>
                </article>
                <article class="p-serviceContent__case">
                  <h3>鷹峯（京都府京都市）のモダン和風住宅</h3>
                  <figure>
                    <img src="/img/img_modernJapaneseStyleHouse01.jpg" alt="和風の庭のある3階建てのモダン木造住宅外観" width="704" height="548">
                    <figcaption>施工年月：R4年4月 構造：木造</figcaption>
                  </figure>
                </article>
              </div><!-- .p-serviceContent__cases -->
            </div>
          </div><!-- .p-serviceContent__body -->
        </div><!-- l-inner--960 -->
      </section><!-- #housing -->

      <section class="p-serviceContent p-serviceContent--business" id="business">
        <div class="l-inner--960">
          <img class="p-serviceContent__mainImg" src="/img/img_service03.jpg" alt="複数の重なり合った設計図" width="1920" height="800">
          <div class="p-serviceContent__body">
            <div>
              <h2 class="p-serviceContent__title">法人新築・リフォーム</h2>
              <div class="p-serviceContent_discription">
                <div class="p-serviceContent_discriptionLead">
                  <p>当社の法人新築・リフォームサービスでは、商業施設やオフィスビル、工場など、法人向けの建物の新築や改修を手がけています。</p>
                </div>
                <div class="p-serviceContent_discriptionText">
                  <p>既存の商業施設やオフィス、工場などの建物を改修し、最新のビジネスニーズに適した空間へと生まれ変わらせます。設備の更新やレイアウトの見直し、外装や内装のリニューアルなど、お客様の要望に応じたリフォームプランを提案し、スムーズな工事を実施します。</p>
                </div>
              </div><!-- .p-serviceContent_discription -->
              <div class="p-serviceContent__cases">
                <article class="p-serviceContent__case">
                  <h3>株式会社kaminari station</h3>
                  <figure>
                    <img  src="/img/img_kaminariStation01.jpg" alt="株式会社kaminari station外観" width="704" height="548">
                    <figcaption>施工年月：H25年4月 構造：S造</figcaption>
                  </figure>
                </article>
                <article class="p-serviceContent__case">
                  <h3>鯉登陸運(株)</h3>
                  <figure>
                    <img src="/img/img_koitoLandTransport.jpg" alt="鯉登陸運(株)外観" width="704" height="548">
                    <figcaption>施工年月：R4年3月 構造：S造</figcaption>
                  </figure>
                </article>
              </div><!-- .p-serviceContent__cases -->
            </div>
          </div><!-- .p-serviceContent__body -->
        </div><!-- l-inner--960 -->
      </section><!-- #business -->

      <section class="p-serviceContent p-serviceContent--public" id="public">
        <div class="l-inner--960">
          <img class="p-serviceContent__mainImg" src="/img/img_service04.jpg" alt="赤煉瓦造りの前庭のある公共施設外観" width="1920" height="800">
          <div class="p-serviceContent__body">
            <div>
              <h2 class="p-serviceContent__title">公共工事</h2>
              <div class="p-serviceContent_discription">
                <div class="p-serviceContent_discriptionLead">
                  <p>公共工事事業は、道路や橋梁、公共施設などの建設・改修を行う事業です。</p>
                </div>
                <div class="p-serviceContent_discriptionText">
                  <p>公共工事事業は、地域社会の発展や住民の生活に密接に関わる重要な事業です。政府や自治体からの発注が多く、厳しい品質基準や工期管理が求められます。当社では、経験豊富な専門家がチームを組み、最新の技術とノウハウを駆使して、安全で信頼性の高い公共施設の建設に貢献しています。</p>
                </div>
              </div><!-- .p-serviceContent_discription -->
              <div class="p-serviceContent__cases">
                <article class="p-serviceContent__case">
                  <h3>神戸市立真島小学校　内装工事</h3>
                  <figure>
                    <img  src="/img/img_elementarySchool01.jpg" alt="明るい日差しの入る小学校の教室" width="704" height="548">
                    <figcaption>施工年月：R1年3月 構造：S造</figcaption>
                  </figure>
                </article>
                <article class="p-serviceContent__case">
                  <h3>枚方市立暮方郵便局</h3>
                  <figure>
                    <img src="/img/img_postOffice01.jpg" alt="曇り空を背景に建つ郵便局外観" width="704" height="548">
                    <figcaption>施工年月：R4年4月 構造：木造</figcaption>
                  </figure>
                </article>
              </div><!-- .p-serviceContent__cases -->
            </div>
          </div><!-- .p-serviceContent__body -->
        </div><!-- l-inner--960 -->
      </section><!-- #public -->

      <?php include $_SERVER['DOCUMENT_ROOT'] . '/inc/contactSec.php'; ?>
<?php include $_SERVER['DOCUMENT_ROOT'] . '/inc/footer.php'; ?>