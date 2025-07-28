<!DOCTYPE html>
<html lang="ja">
<head prefix="og: https://ogp.me/ns#">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="description" content="<?= htmlspecialchars($pageDescription ?? '') ?>">
  <?php if (!empty($noIndex)): ?>
    <meta name="robots" content="noindex">
  <?php endif; ?>
  <title><?= htmlspecialchars($pageTitle ?? '青牡丹工務店') ?></title>
  <meta property="og:url" content="<?= htmlspecialchars($ogUrl ?? '') ?>">
  <meta property="og:type" content="website">
  <meta property="og:title" content="<?= htmlspecialchars($pageTitle ?? '青牡丹工務店') ?>">
  <meta property="og:description" content="<?= htmlspecialchars($pageDescription ?? '') ?>">
  <meta property="og:site_name" content="青牡丹工務店">
  <meta property="og:image" content="<?= htmlspecialchars($ogImage ?? '') ?>">
  <link rel="icon" href="/img/favicon.png" type="/image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;700&family=Zen+Kaku+Gothic+New:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
  <link rel="stylesheet" href="/css/style.css">
</head>