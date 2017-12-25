<?php
/**
 * Hendrix Theme Customizer.
 *
 * @package Hendrix
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function hendrix_customize_register( $wp_customize ) {
	$wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
	$wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';
	$wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';

	/* social media option */
	$wp_customize->add_section( 'hendrix_social_section' , array(
		'title'       => __( 'Social Media Icons', 'hendrix' ),
		'priority'    => 20,
		'description' => __( 'Optional social media buttons in the header', 'hendrix' ),
	) );

	$wp_customize->add_setting( 'hendrix_facebook_setting', array (
		'sanitize_callback' => 'esc_url_raw',
	) );

	$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'hendrix_facebook', array(
		'label'    => __( 'Enter your Facebook url', 'hendrix' ),
		'section'  => 'hendrix_social_section',
		'settings' => 'hendrix_facebook_setting',
		'priority'    => 1,
	) ) );

	$wp_customize->add_setting( 'hendrix_twitter_setting', array (
		'sanitize_callback' => 'esc_url_raw',
	) );
	
	$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'hendrix_twitter', array(
		'label'    => __( 'Enter your Twitter url', 'hendrix' ),
		'section'  => 'hendrix_social_section',
		'settings' => 'hendrix_twitter_setting',
		'priority'    => 2,
	) ) );
	
	$wp_customize->add_setting( 'hendrix_google_setting', array (
		'sanitize_callback' => 'esc_url_raw',
	) );
	
	$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'hendrix_google', array(
		'label'    => __( 'Enter your Google+ url', 'hendrix' ),
		'section'  => 'hendrix_social_section',
		'settings' => 'hendrix_google_setting',
		'priority'    => 3,
	) ) );

	$wp_customize->add_setting( 'hendrix_pinterest_setting', array (
		'sanitize_callback' => 'esc_url_raw',
	) );

	$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'hendrix_pinterest', array(
		'label'    => __( 'Enter your Pinterest url', 'hendrix' ),
		'section'  => 'hendrix_social_section',
		'settings' => 'hendrix_pinterest_setting',
		'priority'    => 4,
	) ) );

	$wp_customize->add_setting( 'hendrix_linkedin_setting', array (
		'sanitize_callback' => 'esc_url_raw',
	) );

	$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'hendrix_linkedin', array(
		'label'    => __( 'Enter your Linkedin url', 'hendrix' ),
		'section'  => 'hendrix_social_section',
		'settings' => 'hendrix_linkedin_setting',
		'priority'    => 5,
	) ) );

	$wp_customize->add_setting( 'hendrix_youtube_setting', array (
		'sanitize_callback' => 'esc_url_raw',
	) );

	$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'hendrix_youtube', array(
		'label'    => __( 'Enter your Youtube url', 'hendrix' ),
		'section'  => 'hendrix_social_section',
		'settings' => 'hendrix_youtube_setting',
		'priority'    => 6,
	) ) );

	$wp_customize->add_setting( 'hendrix_tumblr_setting', array (
		'sanitize_callback' => 'esc_url_raw',
	) );

	$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'hendrix_tumblr', array(
		'label'    => __( 'Enter your Tumblr url', 'hendrix' ),
		'section'  => 'hendrix_social_section',
		'settings' => 'hendrix_tumblr_setting',
		'priority'    => 7,
	) ) );

	$wp_customize->add_setting( 'hendrix_instagram_setting', array (
		'sanitize_callback' => 'esc_url_raw',
	) );

	$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'hendrix_instagram', array(
		'label'    => __( 'Enter your Instagram url', 'hendrix' ),
		'section'  => 'hendrix_social_section',
		'settings' => 'hendrix_instagram_setting',
		'priority'    => 8,
	) ) );

	$wp_customize->add_setting( 'hendrix_flickr_setting', array (
		'sanitize_callback' => 'esc_url_raw',
	) );

	$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'hendrix_flickr', array(
		'label'    => __( 'Enter your Flickr url', 'hendrix' ),
		'section'  => 'hendrix_social_section',
		'settings' => 'hendrix_flickr_setting',
		'priority'    => 9,
	) ) );

	$wp_customize->add_setting( 'hendrix_vimeo_setting', array (
		'sanitize_callback' => 'esc_url_raw',
	) );

	$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'hendrix_vimeo', array(
		'label'    => __( 'Enter your Vimeo url', 'hendrix' ),
		'section'  => 'hendrix_social_section',
		'settings' => 'hendrix_vimeo_setting',
		'priority'    => 1,
	) ) );
	$wp_customize->add_setting( 'hendrix_rss_setting', array (
		'sanitize_callback' => 'esc_url_raw',
	) );

	$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'hendrix_rss', array(
		'label'    => __( 'Enter your RSS url', 'hendrix' ),
		'section'  => 'hendrix_social_section',
		'settings' => 'hendrix_rss_setting',
		'priority'    => 11,
	) ) );

	$wp_customize->add_setting( 'hendrix_email_setting', array (			
		'sanitize_callback' => 'sanitize_email',
	) );
	
	$wp_customize->add_control( new WP_Customize_Control( $wp_customize, 'hendrix_email', array(
		'label'    => __( 'Enter your email address', 'hendrix' ),
		'section'  => 'hendrix_social_section',
		'settings' => 'hendrix_email_setting',
		'priority'    => 12,
	) ) );
	
	/* color option */
	$wp_customize->add_setting( 'hendrix_primary_color_setting', array (
		'default'     => '#000000',
		'sanitize_callback' => 'sanitize_hex_color',
	) );

	$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'hendrix_primary_color', array(
			'label'    => __( 'Theme Primary Color', 'hendrix' ),
			'section'  => 'colors',
			'settings' => 'hendrix_primary_color_setting',
	) ) );
	
	/* Background color Header and fOOTER */
	$wp_customize->add_setting( 'hendrix_hf_bgcolor_setting', array (
		'default'     => '#ececec',
		'sanitize_callback' => 'sanitize_hex_color',
	) );

	$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'hendrix_hf_bgcolor', array(
			'label'    => __( 'Header/Footer Background Color', 'hendrix' ),
			'section'  => 'colors',
			'settings' => 'hendrix_hf_bgcolor_setting',
	) ) );
	
	/* Background color Sub Menu */
	$wp_customize->add_setting( 'hendrix_smenu_bgcolor_setting', array (
		'default'     => '#ececec',
		'sanitize_callback' => 'sanitize_hex_color',
	) );

	$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'hendrix_smenu_bgcolor', array(
			'label'    => __( 'Submenu Background Color', 'hendrix' ),
			'section'  => 'colors',
			'settings' => 'hendrix_smenu_bgcolor_setting',
	) ) );
	
}
add_action( 'customize_register', 'hendrix_customize_register' );

/**
* Apply Color Scheme
*/
if ( ! function_exists( 'hendrix_apply_color' ) ) :
  function hendrix_apply_color() {
	?>
	<style id="color-settings">
  <?php if (esc_html(get_theme_mod('hendrix_primary_color_setting')) ) { ?>
		.read_more:hover, .comment-reply-link:hover, .page-numbers .fa-chevron-right:hover, .page-numbers .fa-chevron-left:hover, button:hover, input[type="button"]:hover, input[type="reset"]:hover, input[type="submit"]:hover{background:<?php echo esc_html(get_theme_mod('hendrix_primary_color_setting')); ?>}.site-title a, a, .entry-title, .page-numbers .fa-chevron-right, .page-numbers .fa-chevron-left, .pagination a, button, input[type="button"], input[type="reset"], input[type="submit"], .page-title.single-title{color:<?php echo esc_html(get_theme_mod('hendrix_primary_color_setting')); ?>}
		.read_more, .comment-reply-link, .page-numbers .fa-chevron-right, .page-numbers .fa-chevron-left, button, input[type="button"], input[type="reset"], input[type="submit"]{border: solid 1px<?php echo esc_html(get_theme_mod('hendrix_primary_color_setting')); ?>}
	<?php } ?>
	<?php if (esc_html(get_theme_mod('hendrix_hf_bgcolor_setting')) ) { ?>
		.site-header,.footer-widget-container {background: <?php echo esc_html(get_theme_mod('hendrix_hf_bgcolor_setting')); ?>}
	<?php } ?>
	<?php if (esc_html(get_theme_mod('hendrix_smenu_bgcolor_setting')) ) { ?>
		.main-navigation ul ul {background: <?php echo esc_html(get_theme_mod('hendrix_smenu_bgcolor_setting')); ?>}
		@media only screen and (max-width: 599px){
			#primary-menu {background: <?php echo esc_html(get_theme_mod('hendrix_smenu_bgcolor_setting')); ?>}
		}
	<?php } ?>
	</style>
	<?php	  
  }
endif;
add_action( 'wp_head', 'hendrix_apply_color' );


/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function hendrix_customize_preview_js() {
	wp_enqueue_script( 'hendrix_customizer', get_template_directory_uri() . '/js/customizer.js', array( 'customize-preview' ), '20151215', true );
}
add_action( 'customize_preview_init', 'hendrix_customize_preview_js' );
