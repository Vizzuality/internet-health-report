<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package ihr-2018
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <?php wp_head(); ?>

  <!-- Google Analytics -->
  <script>
    window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
    ga('create', 'UA-87658599-2', 'auto');
    ga('send', 'pageview');
  </script>
  <script async src='https://www.google-analytics.com/analytics.js'></script>
  <!-- End Google Analytics -->

	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">

  <!-- Prefetching the JS -->
  <link rel="prefetch" href="/wp-content/themes/ihr-2018/js/pages0.bundle.js" as="script">
  <link rel="prefetch" href="/wp-content/themes/ihr-2018/js/pages1.bundle.js" as="script">
  <link rel="prefetch" href="/wp-content/themes/ihr-2018/js/pages2.bundle.js" as="script">
  <link rel="prefetch" href="/wp-content/themes/ihr-2018/js/pages3.bundle.js" as="script">
  <link rel="prefetch" href="/wp-content/themes/ihr-2018/js/mapbox.bundle.js" as="script">
  <link rel="prefetch" href="/wp-content/themes/ihr-2018/js/vega.bundle.js" as="script">

  <!-- Loading visualizations & more -->
  <script>
    window.BASE_URL='<?php echo get_site_url(null, '', 'relative'); ?>';
    window.LANG='<?php echo substr(get_locale(), 0, 2); ?>';
    window.COLOR = '<?php echo the_field('color', 'category_' . get_the_category()[0]->term_id);?>';
    window.CATEGORY = '<?php echo get_the_category()[0]->slug; ?>';
    <?php
      if (have_rows('visualizations')):
        echo 'window.VISUALIZATIONS = [';
        while (have_rows('visualizations')) : the_row();
          echo '{';
          echo 'id: ' . json_encode(get_sub_field('id')) . ',';
          echo 'file: ' . json_encode(get_sub_field('file')) . ',';
          echo 'title: ' . json_encode(get_sub_field('title')) . ',';
          echo 'description: ' . json_encode(get_sub_field('description')) . ',';
          echo 'dictionary: ' . json_encode(get_sub_field('dictionary'));
          echo '},';
        endwhile;
        echo '];';
      else:
        echo 'window.VISUALIZATIONS = [];';
      endif;
    ?>

    window.TRANSLATIONS = {
      missing_title: <?php echo json_encode(translate('Missing title', 'ihr-2018')) ?>,
      missing_description: <?php echo json_encode(translate('Missing description', 'ihr-2018')) ?>,
      visualization_error: <?php echo json_encode(translate('Unable to display this visualization.', 'ihr-2018')) ?>,
      map_category_switcher_label: <?php echo json_encode(translate('Layer', 'ihr-2018')) ?>,
      close_tooltip: <?php echo json_encode(translate('Close', 'ihr-2018')) ?>,
      reactions: <?php echo json_encode(translate('Reaction', 'ihr-2018')) ?>,
      no_data: <?php echo json_encode(translate('No data', 'ihr-2018')) ?>
    };
  </script>
</head>
<body
  <?php body_class('category-'.substr(get_field('color', 'category_' . get_the_category()[0]->term_id), 1)); ?>
  <?php
    if(is_single()) {
      $bgColor = get_field('color', 'category_' . get_the_category()[0]->term_id);
      echo 'style="background: linear-gradient(to bottom, ' . $bgColor . ', #fff)"';
    }
  ?>
>
<?php get_template_part('template-parts/icons'); ?>

<div id="page" class="site l-main-layout">
	<a class="skip-link screen-reader-text" href="<?php get_permalink(); ?>"><?php esc_html_e( 'Skip to content', 'ihr-2018' ); ?></a>

	<header id="masthead" class="site-header l-header">
    <div class="wrap">
      <div class="row">
        <div class="column small-8 medium-3">
      		<div class="site-branding">
      			<?php
        			the_custom_logo();

        			$description = get_bloginfo( 'description', 'display' );
        			if ( $description || is_customize_preview() ) : ?>
        				<p class="site-description"><?php echo $description; /* WPCS: xss ok. */ ?></p>
        			<?php
      			endif; ?>
      		</div><!-- .site-branding -->
        </div>
        <div class="column small-12 medium-9">
      		<nav id="site-navigation" class="main-navigation c-main-navigation">
      			<button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false">&#9776;</button>
      			<?php
              wp_nav_menu();
      			?>
            <div class="lang-selector"><?php languages_list_footer(); ?></div>
  		    </nav><!-- #site-navigation -->
        </div>
      </div>
    </div>
	</header><!-- #masthead -->

	<div id="content" class="site-content">
