<?php
/**
 * Template part for displaying a single post
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package ihr-2018
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
  <div class="wrap">
    <div class="row">
      <div class="column small-12 medium-8">
        <header class="entry-header">
            <?php echo get_the_category()[0]->cat_name?>
        </header><!-- .entry-header -->
      </div>
    </div>
  </div>

  <div class="wrap">
    <div class="row">
      <div class="column small-12">
        <div class="entry-content">
          <h1 class="post-title">
            <?php echo the_title(); ?>
          </h1>
          <div class="post-content">
            <?php echo get_post_field('post_content'); ?>
          </div>
        </div><!-- .entry-content -->
      </div>
    </div>
  </div>
</article><!-- #post-<?php the_ID(); ?> -->
