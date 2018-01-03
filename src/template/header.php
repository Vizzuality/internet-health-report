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
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="http://gmpg.org/xfn/11">

	<?php wp_head(); ?>
</head>
<body <?php body_class( $category ); ?>>
<?php get_template_part('template-parts/icons'); ?>

<div id="page" class="site l-main-layout">
	<a class="skip-link screen-reader-text" href="<?php get_permalink(); ?>"><?php esc_html_e( 'Skip to content', 'ihr-2018' ); ?></a>

	<header id="masthead" class="site-header l-header">
    <div class="wrap">
      <div class="row">
        <div class="column small-12 medium-3">
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
      			<button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false"><?php esc_html_e( 'Primary Menu', 'ihr-2018' ); ?></button>
      			<?php
              wp_nav_menu();
      			?>
  		    </nav><!-- #site-navigation -->
        </div>
      </div>
    </div>
	</header><!-- #masthead -->

	<div id="content" class="site-content">
