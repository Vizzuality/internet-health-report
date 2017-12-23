<?php
/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package ihr-2018
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main">

			<?php
        // Defines active tab
        $active_page = get_the_ID();
        // Get parent page info
        $parent = $post->post_parent;
        // Include parent page template into current page
        // include( locate_template( 'parent-tab.php' ) );

        if(!isset($parent)) {
          $parent = $post->ID;
        }

        $content_post = get_post($parent);
        $title = $content_post->post_title;

        if($title) {
        ?>
        <h1><?php echo $title; ?></h1>
        <?php
        }

        $content = $content_post->post_content;
        $content = apply_filters('the_content', $content);
        echo $content;

        $mypages = get_pages( array( 'child_of' => $parent, 'sort_column' => 'menu_order', 'sort_order' => 'desc' ) );

        if(count($mypages) > 0) {
           ///show tabs here
           set_query_var( 'mypages', $mypages );
           get_template_part( 'template-parts/tab' );
        }

			?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();
