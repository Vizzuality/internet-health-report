<?php
/**
 * Hendrix functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Hendrix
 */

if ( ! function_exists( 'hendrix_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function hendrix_setup() {
	/*
	 * Make theme available for translation.
	 * Translations can be filed in the /languages/ directory.
	 * If you're building a theme based on Hendrix, use a find and replace
	 * to change 'hendrix' to the name of your theme in all the template files.
	 */
	load_theme_textdomain( 'hendrix', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
	 * Let WordPress manage the document title.
	 * By adding theme support, we declare that this theme does not use a
	 * hard-coded <title> tag in the document head, and expect WordPress to
	 * provide it for us.
	 */
	add_theme_support( 'title-tag' );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
	 */
	add_editor_style();
	add_theme_support( 'post-thumbnails' );
	add_image_size( 'hendrix-large-thumbnails',  1170, 630, true );
	add_image_size( 'hendrix-widget-post-thumb',  80, 80, true );
	add_theme_support( 'custom-logo', array(
		'height'      => 100,
		'width'       => 400,
		'flex-height' => true,
		'flex-width'  => true,
		'header-text' => array( 'site-title', 'site-description' ),
	) );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus( array(
		'primary' => esc_html__( 'Primary', 'hendrix' ),
		'footer' => __('Footer Menu', 'hendrix') 
	) );

	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
	) );

	/*
	 * Enable support for Post Formats.
	 * See https://developer.wordpress.org/themes/functionality/post-formats/
	 */
	add_theme_support( 'post-formats', array(
		'aside',
		'image',
		'video',
		'quote',
		'link',
	) );

	// Set up the WordPress core custom background feature.
	add_theme_support( 'custom-background', apply_filters( 'hendrix_custom_background_args', array(
		'default-color' => 'ffffff',
		'default-image' => '',
	) ) );
}
endif;
add_action( 'after_setup_theme', 'hendrix_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function hendrix_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'hendrix_content_width', 640 );
}
add_action( 'after_setup_theme', 'hendrix_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function hendrix_widgets_init() {
	
	register_sidebar( array(
		'name' => __( 'Footer One', 'hendrix' ),
		'id' => 'hendrix-footer-one-widget',
		'before_widget' => '<div id="footer-one" class="widget footer-widget">',
		'after_widget' => "</div>",
		'before_title' => '<h1 class="widget-title">',
		'after_title' => '</h1>',
	) );
	
	register_sidebar( array(
		'name' => __( 'Footer Two', 'hendrix' ),
		'id' => 'hendrix-footer-two-widget',
		'before_widget' => '<div id="footer-two" class="widget footer-widget">',
		'after_widget' => "</div>",
		'before_title' => '<h1 class="widget-title">',
		'after_title' => '</h1>',
	) );
	
	register_sidebar( array(
		'name' => __( 'Footer Three', 'hendrix' ),
		'id' => 'hendrix-footer-three-widget',
		'before_widget' => '<div id="footer-three" class="widget footer-widget">',
		'after_widget' => "</div>",
		'before_title' => '<h1 class="widget-title">',
		'after_title' => '</h1>',
	) );
	
}
add_action( 'widgets_init', 'hendrix_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function hendrix_scripts() {

	wp_enqueue_script( 'bootstrap', get_template_directory_uri() . '/js/bootstrap.js', array('jquery') );
	wp_enqueue_script( 'hendrix-custom-js', get_template_directory_uri() . '/js/custom.js', array('jquery', 'jquery-masonry', 'imagesloaded') );
	wp_enqueue_script( 'hendrix-ie-responsive-js', get_template_directory_uri() . '/js/ie-responsive.min.js', array('jquery') );
	wp_script_add_data( 'hendrix-ie-responsive-js', 'conditional', 'lt IE 9' );
	wp_enqueue_script( 'hendrix-ie-shiv', get_template_directory_uri() . "/js/html5shiv.min.js");
	wp_script_add_data( 'hendrix-ie-shiv', 'conditional', 'lt IE 9' );
	wp_enqueue_script( 'hendrix-navigation', get_template_directory_uri() . '/js/navigation.js', array(), '20151215', true );
	wp_enqueue_script( 'hendrix-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), '20151215', true );
	
	wp_enqueue_style( 'bootstrap', get_template_directory_uri() .'/assets/css/bootstrap.min.css', array(), false ,'screen' );
	wp_enqueue_style( 'font-awesome', get_template_directory_uri() .'/assets/font-awesome/css/font-awesome.min.css' );
	wp_enqueue_style( 'hendrix-ie-style', get_stylesheet_directory_uri() . "/assets/css/ie.css", array()  );
    wp_style_add_data( 'hendrix-ie-style', 'conditional', 'IE' );
	wp_enqueue_style('hendrix-google-fonts', '//fonts.googleapis.com/css?family=Lato:400,300,300italic,400italic,700,900,700italic');
	wp_enqueue_style( 'hendrix-style', get_stylesheet_uri() );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'hendrix_scripts' );

function hendrix_new_excerpt( $more ) {
	return '...';
}
add_filter('excerpt_more', 'hendrix_new_excerpt');

if(!is_user_logged_in()){
	add_filter( 'comment_form_defaults', 'hendrix_remove_textarea' );
}

function hendrix_remove_textarea($defaults)
{
    $defaults['comment_field'] = '';
    return $defaults;
}

add_filter( 'comment_form_default_fields', 'hendrix_comment_fields', 10 );
function hendrix_comment_fields( $fields ) {
 
	// get the current commenter if available
	$commenter = wp_get_current_commenter();
 
	// core functionality
	$req      = get_option( 'require_name_email' );
	$aria_req = ( $req ? " aria-required='true'" : '' );
	$html_req = ( $req ? " required='required'" : '' );
 
	// Change just the author field
	$fields = array(
	'comment_notes_after' => ' ',
	'comment_field' => '<div class="row"><div class="col-md-8"><p class="comment-form-comment"><textarea id="comment" name="comment" aria-required="true" placeholder="'.__( 'Your Message...', 'hendrix' ).'" rows="8" cols="37" wrap="hard"></textarea></p></div>',
	  
	'author' =>
		  '<div class="col-md-4"><p class="comment-form-author">' .
		  '<input id="author" placeholder="'. __('Your name *...', 'hendrix') .'" name="author" type="text" value="' . esc_attr( $commenter['comment_author'] ) .
		  '" size="30"' . $aria_req . ' />' . ( $req ? '<span style="color:red" class="required"></span>' : '' ) . '</p>',

	'email' =>
		  '<p class="comment-form-email">' .
		  '<input id="email" placeholder="'. __('Your email *...', 'hendrix') .'" name="email" type="text" value="' . esc_attr(  $commenter['comment_author_email'] ) .
		  '" size="30"' . $aria_req . ' />' . ( $req ? '<span style="color:red" class="required"></span>' : '' ) . '</p>',

	'url' =>
		 '<p class="comment-form-url">' .
		  '<input id="url" placeholder="'. __('Your website...', 'hendrix') .'" name="url" type="text" value="' . esc_attr( $commenter['comment_author_url'] ) .
		  '" size="30" /></p></div></div>'
	  
	  
	);
	return $fields;
 
}

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Implement the Custom Widget.
 */
require get_template_directory() . '/inc/widget.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Custom functions that act independently of the theme templates.
 */
require get_template_directory() . '/inc/extras.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
require get_template_directory() . '/inc/jetpack.php';
