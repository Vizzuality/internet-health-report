<?php
/**
 * The template for displaying all single posts:
 * - Block detail
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package ihr-2018
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main">

		<?php

  		while ( have_posts() ) : the_post();

  			get_template_part( 'template-parts/single-content', get_post_type() );

  		endwhile; // End of the loop.
		?>

		</main><!-- #main -->
	</div><!-- #primary -->

  <div class="l-related-posts">
    <?php
      $tags = wp_get_post_tags($post->ID);

      if ($tags) {
        $tag_ids = array();
        foreach($tags as $individual_tag) $tag_ids[] = $individual_tag->term_id;
        $args=array(
          'tag__in' => $tag_ids,
          'post__not_in' => array($post->ID),
          'posts_per_page'=>3, // Number of related posts to display.
          'caller_get_posts'=>1
        );

        $args['meta_query'] = array(
          array(
            'key' => 'home_item',
            'value' => 1,
            'compare' => '!='
          )
        );

        $my_query = new wp_query( $args );

        if ($my_query->have_posts()) {
    ?>


      <div class="l-cards-grid">
        <div class="wrap">
          <div class="row">
            <?php
              $orig_post = $post;
              global $post;

              while( $my_query->have_posts() ) {
                $my_query->the_post();
                get_template_part( 'template-parts/content');
              }

              $post = $orig_post;
              wp_reset_query();
            ?>
          </div>
        </div>
      </div>
    <?php
        }
      }
    ?>
  </div>

<?php
get_footer();
