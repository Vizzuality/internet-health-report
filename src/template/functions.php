<?php
/**
 * ihr-2018 functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package ihr-2018
 */

if ( ! function_exists( 'ihr_2018_setup' ) ) :
  /**
   * Sets up theme defaults and registers support for various WordPress features.
   *
   * Note that this function is hooked into the after_setup_theme hook, which
   * runs before the init hook. The init hook is too late for some features, such
   * as indicating support for post thumbnails.
   */
  function ihr_2018_setup() {
    /*
     * Make theme available for translation.
     * Translations can be filed in the /languages/ directory.
     * If you're building a theme based on ihr-2018, use a find and replace
     * to change 'ihr-2018' to the name of your theme in all the template files.
     */
    load_theme_textdomain( 'ihr-2018', get_template_directory() . '/languages' );

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
    add_theme_support( 'post-thumbnails' );

    // This theme uses wp_nav_menu() in one location.
    register_nav_menus( array(
      'menu-1' => esc_html__( 'Primary', 'ihr-2018' ),
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

    // Set up the WordPress core custom background feature.
    add_theme_support( 'custom-background', apply_filters( 'ihr_2018_custom_background_args', array(
      'default-color' => 'ffffff',
      'default-image' => '',
    ) ) );

    // Add theme support for selective refresh for widgets.
    add_theme_support( 'customize-selective-refresh-widgets' );

    /**
     * Add support for core custom logo.
     *
     * @link https://codex.wordpress.org/Theme_Logo
     */
    add_theme_support( 'custom-logo', array(
      'height'      => 250,
      'width'       => 250,
      'flex-width'  => true,
      'flex-height' => true,
    ) );

    /**
     * Prevent WP to automatically add p tag
     * @link https://codex.wordpress.org/Function_Reference/wpautop#Disabling_the_filter
     */
    remove_filter( 'the_content', 'wpautop' );
    remove_filter( 'the_excerpt', 'wpautop' );
  }
endif;
add_action( 'after_setup_theme', 'ihr_2018_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function ihr_2018_content_width() {
  $GLOBALS['content_width'] = apply_filters( 'ihr_2018_content_width', 640 );
}
add_action( 'after_setup_theme', 'ihr_2018_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function ihr_2018_widgets_init() {
  register_sidebar( array(
    'name'          => esc_html__( 'Sidebar', 'ihr-2018' ),
    'id'            => 'sidebar-1',
    'description'   => esc_html__( 'Add widgets here.', 'ihr-2018' ),
    'before_widget' => '<section id="%1$s" class="widget %2$s">',
    'after_widget'  => '</section>',
    'before_title'  => '<h2 class="widget-title">',
    'after_title'   => '</h2>',
  ) );
}
add_action( 'widgets_init', 'ihr_2018_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function ihr_2018_scripts() {
	wp_enqueue_style( 'ihr-2018-style', get_stylesheet_uri() );

  wp_enqueue_script( 'ihr-2018-script', get_template_directory_uri() . '/js/script.js', array(), false, true );

	wp_enqueue_script( 'ihr-2018-navigation', get_template_directory_uri() . '/js/navigation.js', array(), false, true );

  wp_enqueue_script( 'ihr-2018-js-app', get_template_directory_uri() . '/js/app.js', array(), false, true );

  if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
    wp_enqueue_script( 'comment-reply' );
  }
}

add_action( 'wp_enqueue_scripts', 'ihr_2018_scripts' );

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
  require get_template_directory() . '/inc/jetpack.php';
}

// List of filters allowed
function register_query_vars( $vars ) {
  $vars[] = 'type';
  $vars[] = 'issue';
    return $vars;
}
add_filter( 'query_vars', 'register_query_vars' );

// array of filters (field key => field name)
$GLOBALS['my_query_filters'] = array(
  //'field_1' => 'issue',
  'field_2' => 'type'
);


// action
add_action('pre_get_posts', 'my_pre_get_posts', 10, 1);

function my_pre_get_posts( $query ) {
  // bail early if is in admin
  if( is_admin() ) return;


  // bail early if not main query
  // - allows custom code / plugins to continue working
  if( !$query->is_main_query() ) return;


  // get meta query
  $meta_query = $query->get('meta_query');

  // loop over filters
  foreach( $GLOBALS['my_query_filters'] as $key => $name ) {
    // continue if not found in url
    if( empty($_GET[ $name ]) ) {

      continue;

    }

    // get the value for this filter
    // eg: http://www.website.com/events?city=melbourne,sydney
    $value = explode(',', $_GET[ $name ]);

    // append meta query
      $meta_query[] = array(
            'key'   => $name,
            'value'   => $value,
            'compare' => 'IN',
        );
  }

  // update meta query
  $query->set('meta_query', $meta_query);

  if( !empty($_GET[ 'issue' ]) ) {
    $query->set('category__in', get_cat_ID($_GET[ 'issue' ]));
  }
}

/*
 * Changes the link to /explore so that it goes to the search page
 */

add_filter( 'wp_get_nav_menu_items','nav_items', 11, 3 );

function nav_items( $items, $menu, $args ) 
{
    if( is_admin() )
        return $items;

    foreach( $items as $item ) 
    {
        if( 'Explore' == $item->post_title)
            $item->url = get_bloginfo( 'url' ) . '?s=';

    }
    return $items;
}


/*
 * Custom WYSIWYG styles
 */
/*
Plugin Name: Custom Styles
Plugin URI: http://www.speckygeek.com
Description: Add custom styles in your posts and pages content using TinyMCE WYSIWYG editor. The plugin adds a Styles dropdown menu in the visual post editor.
Based on TinyMCE Kit plug-in for WordPress
http://plugins.svn.wordpress.org/tinymce-advanced/branches/tinymce-kit/tinymce-kit.php

Found at: https://code.tutsplus.com/tutorials/adding-custom-styles-in-wordpress-tinymce-editor--wp-24980
*/
/**
 * Apply styles to the visual editor
 */

/**
 * Add "Styles" drop-down
 */
add_filter( 'mce_buttons_2', 'tuts_mce_editor_buttons' );

function tuts_mce_editor_buttons( $buttons ) {
    array_unshift( $buttons, 'styleselect' );
    return $buttons;
}

/**
 * Add styles/classes to the "Styles" drop-down
 */
add_filter( 'tiny_mce_before_init', 'tuts_mce_before_init' );

function tuts_mce_before_init( $settings ) {

  $style_formats = array(
      array(
          'title' => 'Black button',
          'selector' => 'a',
          'classes' => 'btn -secondary'
          ),
      array(
          'title' => 'White button',
          'selector' => 'a',
          'classes' => 'btn -primary',
      ),
      array(
          'title' => 'Raw button',
          'selector' => 'a',
          'classes' => 'btn -raw',
      ),
      array(
          'title' => 'Button box',
          'block' => 'div',
          'classes' => '',
          'wrapper' => true
      ),
  );

  $settings['style_formats'] = json_encode( $style_formats );

  return $settings;
}

/* Learn TinyMCE style format options at http://www.tinymce.com/wiki.php/Configuration:formats */




