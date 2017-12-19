<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package ihr-2018
 */

?>

<div class="column small-12 medium-6 large-4">
  <article class="c-single-post" id="post-<?php the_ID(); ?>">
    <span class="color-border" <?php post_class(); ?> style="background-color:<?php the_field('color', 'category_' . get_the_category()[0]->term_id)?>;"></span>
  	<header class="single-post-header">
          <?php echo the_field('type')?> // <?php echo get_the_category()[0]->cat_name?>
  	</header><!-- .entry-header -->

  	<div class="single-post-content">
          <div class="single-post-title">
              <a href="<?php echo get_permalink() ?>"><?php echo the_title(); ?></a>
          </div>

          <div class="single-post-image">
              <img src="<?php the_field( 'image') ?>"
          </div>

  	</div><!-- .entry-content -->

  	<footer class="single-post-footer"></footer><!-- .entry-footer -->
  </article><!-- #post-<?php the_ID(); ?> -->
</div>
