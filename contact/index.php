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

      <div class="p-contact__wrapper l-inner--880">
        <div class="l-inner--470">
          <article class="p-contactForm">
            <div class="p-contactForm__progress">
              <div class="p-contactForm__progressItem is-current"><span>01</span><span>入力</span></div>
              <div class="p-contactForm__progressItem"><span>02</span><span>送信完了</span></div>
            </div><!-- .p-contactForm__progress -->

            <form class="p-contactForm__form js-form" method="post" action="mail.php">
              <div class="p-contactForm__formBody">

                <!-- お問い合わせの種類 -->
                <fieldset class="p-contactForm__item p-contactForm__item--type">
                  <legend class="p-contactForm__label">お問い合わせの種類<span>★必須</span></legend>

                  <div class="p-contactForm__radioItem">
                    <input type="radio" id="house" name="お問い合わせの種類" value="注文住宅の相談" required>
                    <label for="house">注文住宅の相談</label>
                  </div>

                  <div class="p-contactForm__radioItem">
                    <input type="radio" id="corporate" name="お問い合わせの種類" value="法人建築の相談">
                    <label for="corporate">法人建築の相談</label>
                  </div>

                  <div class="p-contactForm__radioItem">
                    <input type="radio" id="renovation" name="お問い合わせの種類" value="リフォームの相談">
                    <label for="renovation">リフォームの相談</label>
                  </div>

                  <div class="p-contactForm__radioItem">
                    <input type="radio" id="publicworks" name="お問い合わせの種類" value="公共工事の相談">
                    <label for="publicworks">公共工事の相談</label>
                  </div>

                  <div class="p-contactForm__radioItem">
                    <input type="radio" id="other" name="お問い合わせの種類" value="その他">
                    <label for="other">その他</label>
                  </div>
                </fieldset>

                <!-- お名前 -->
                <fieldset class="p-contactForm__item p-contactForm__item--name">
                  <legend class="p-contactForm__label">お名前<span>&#9733;必須</span></legend>
                  <div>
                    <label>
                      <input name="姓" type="text" required autocomplete="family-name" placeholder="青牡丹" aria-label="姓" required>
                    </label>
                    <label>
                      <input name="名" type="text" autocomplete="given-name" placeholder="幸太郎" aria-label="名" required>
                    </label>
                  </div>
                </fieldset>

                <!-- メールアドレス -->
                <div class="p-contactForm__item">
                  <label class="p-contactForm__label" for="email">メールアドレス<span>&#9733;必須</span></label>
                  <input type="email" id="email" name="メールアドレス" placeholder="aobotan@gmail.com" autocomplete="email" required>
                </div>

                <!-- 電話番号 -->
                <div class="p-contactForm__item">
                  <label class="p-contactForm__label" for="tel">電話番号</label>
                  <input type="tel" id="tel" name="電話番号" placeholder="000-0000-0000" pattern="^(0\d{1,4}-\d{1,4}-\d{3,4}|0\d{9,10})?$" autocomplete="tel-national">
                </div>

                <!-- 住所 -->
                <div class="p-contactForm__item">
                  <label class="p-contactForm__label" for="address">住所<span>&#9733;必須</span></label>
                  <input type="text" id="address" name="住所" placeholder="大阪府大阪市中央区北区南町5-6-7" autocomplete="street-address" required>
                </div>

                <!-- 同意チェック -->
                <div class="p-contactForm__item p-contactForm__item--agree">
                  <input class="p-contactForm__label" type="checkbox" name="同意" id="agree" required>
                  <label for="agree">入力内容に間違いないことを確認しました</label>
                </div>

                <!-- 送信ボタン -->
                <button class="c-button--a p-contactForm__button is-disabled" type="submit">送信する</button>

              </div><!-- .p-contactForm__formBody -->
            </form><!-- .p-contactForm__form -->
          </article><!-- .p-contactForm -->
        </div><!-- .l-inner--470 -->

        <article class="p-contact__tel">
          <p>お電話も受け付けています。</p>
          <p><a href="tel:0000-000-0000">0000-000-0000</a></p>
          <p>営業時間10:00-20:00</p>
        </article>

      </div><!-- .p-contact_wrapper -->

      <?php include $_SERVER['DOCUMENT_ROOT'] . '/inc/contactSec.php'; ?>
<?php include $_SERVER['DOCUMENT_ROOT'] . '/inc/footer.php'; ?>