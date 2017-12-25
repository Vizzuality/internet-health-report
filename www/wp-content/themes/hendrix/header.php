<?php
/**
 * The header for our theme.
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Hendrix
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', 'hendrix' ); ?></a>
	
    <div class="top-bar">
		<div class="container">
        	<div class="row">
            <div class="col-md-6">
            <ul class="social-meidia">
                <?php if ( get_theme_mod( 'hendrix_facebook_setting' ) ){ ?>
                    <li><a href="<?php echo esc_url( get_theme_mod( 'hendrix_facebook_setting' ) ); ?>" title="<?php _e('Facebook', 'hendrix'); ?>"><i class="fa fa-facebook"></i></a></li>
                <?php } ?>
                <?php if ( get_theme_mod( 'hendrix_twitter_setting' ) ){ ?>
                    <li><a href="<?php echo esc_url( get_theme_mod( 'hendrix_twitter_setting' ) ); ?>" title="<?php _e('Twitter', 'hendrix'); ?>"><i class="fa fa-twitter"></i></a></li>
                <?php } ?>
                <?php if ( get_theme_mod( 'hendrix_google_setting' ) ){ ?>
                    <li><a href="<?php echo esc_url( get_theme_mod( 'hendrix_google_setting' ) ); ?>" title="<?php _e('Google Plus', 'hendrix'); ?>"><i class="fa fa-google-plus"></i></a></li>
                <?php } ?>
                <?php if ( get_theme_mod( 'hendrix_pinterest_setting' ) ){ ?>
                    <li><a href="<?php echo esc_url( get_theme_mod( 'hendrix_pinterest_setting' ) ); ?>" title="<?php _e('Pinterest', 'hendrix'); ?>"><i class="fa fa-pinterest"></i></a></li>
                <?php } ?>
                <?php if ( get_theme_mod( 'hendrix_linkedin_setting' ) ){ ?>
                    <li><a href="<?php echo esc_url( get_theme_mod( 'hendrix_linkedin_setting' ) ); ?>" title="<?php _e('Linkedin', 'hendrix'); ?>"><i class="fa fa-linkedin"></i></a></li>
                <?php } ?>
                <?php if ( get_theme_mod( 'hendrix_youtube_setting' ) ){ ?>
                    <li><a href="<?php echo esc_url( get_theme_mod( 'hendrix_youtube_setting' ) ); ?>" title="<?php _e('Youtube', 'hendrix'); ?>"><i class="fa fa-youtube"></i></a></li>
                <?php } ?>
                <?php if ( get_theme_mod( 'hendrix_tumblr_setting' ) ){ ?>
                    <li><a href="<?php echo esc_url( get_theme_mod( 'hendrix_tumblr_setting' ) ); ?>" title="<?php _e('Tumblr', 'hendrix'); ?>"><i class="fa fa-tumblr"></i></a></li>
                <?php } ?>
                <?php if ( get_theme_mod( 'hendrix_instagram_setting' ) ){ ?>
                    <li><a href="<?php echo esc_url( get_theme_mod( 'hendrix_instagram_setting' ) ); ?>" title="<?php _e('Instagram', 'hendrix'); ?>"><i class="fa fa-instagram"></i></a></li>
                <?php } ?>
                <?php if ( get_theme_mod( 'hendrix_flickr_setting' ) ){ ?>
                    <li><a href="<?php echo esc_url( get_theme_mod( 'hendrix_flickr_setting' ) ); ?>" title="<?php _e('Flickr', 'hendrix'); ?>"><i class="fa fa-flickr"></i></a></li>
                <?php } ?>
                <?php if ( get_theme_mod( 'hendrix_vimeo_setting' ) ){ ?>
                    <li><a href="<?php echo esc_url( get_theme_mod( 'hendrix_vimeo_setting' ) ); ?>" title="<?php _e('Vimeo', 'hendrix'); ?>"><i class="fa fa-vimeo-square"></i></a></li>
                <?php } ?>
                <?php if ( get_theme_mod( 'hendrix_rss_setting' ) ){ ?>
                    <li><a href="<?php echo esc_url( get_theme_mod( 'hendrix_rss_setting' ) ); ?>" title="<?php _e('RSS', 'hendrix'); ?>"><i class="fa fa-rss"></i></a></li>
                <?php } ?>  
                <?php if ( get_theme_mod( 'hendrix_email_setting' ) ) : ?>
                    <li><a href="<?php _e('mailto:', 'hendrix'); echo sanitize_email( get_theme_mod( 'hendrix_email_setting' ) ); ?>"  title="<?php _e('Email', 'hendrix'); ?>"><i class="fa fa-envelope"></i></a></li>
            <?php endif; ?>                                                     
            </ul>
            </div>
            <div class="col-md-6">
            <div class="search-container">
                <div class="serch-form-coantainer">
                    <?php get_search_form(); ?>
                </div>
                <span id="search-button"><i class="fa fa-search"></i></span>
            </div>
            </div>
            </div>
        </div>
    </div>
    
	<header id="masthead" class="site-header" role="banner">
    	<div class="container">
        	<?php if ( has_header_image() ) { ?>
            	<div class="row">
                    <div class="col-md-12">
                        <div class="img-header">
                            <img src="<?php header_image(); ?>" height="<?php echo get_custom_header()->height; ?>" width="<?php echo get_custom_header()->width; ?>" alt="" />
                        </div>
                    </div>
                </div>
            <?php } ?>
            <div class="site-branding">
               	<?php 
					if ( function_exists( 'the_custom_logo' ) ) {
						the_custom_logo();
					}
				?>
                <h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
				<p class="site-description"><?php bloginfo( 'description' ); ?></p>

            </div><!-- .site-branding -->
    
            <nav id="site-navigation" class="main-navigation" role="navigation">
           	 	<button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false"><i class="fa fa-bars"></i></button>
                <?php wp_nav_menu( array( 'theme_location' => 'primary', 'menu_id' => 'primary-menu' ) ); ?>
            </nav><!-- #site-navigation -->
        </div>
	</header><!-- #masthead -->

	<div id="content" class="site-content">
