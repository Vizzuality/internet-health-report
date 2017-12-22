<?php
/**
 * Template part for displaying a single post:
 * - Block detail
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package ihr-2018
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?> >
  <div class="wrap">
    <div class="l-block-detail">
      <div class="row">
        <div class="column small-10 small-offset-1">
          <div class="c-tag" style="background-color:<?php echo the_field('color', 'category_' . get_the_category()[0]->term_id);?>">
            <?php echo get_the_category()[0]->cat_name ?>
          </div>
        </div>
      </div>

      <div class="column small-10 small-offset-1">
        <div class="c-post">
          <h1 class="post-title">
            <?php echo the_title(); ?>
          </h1>
          <div class="post-content">
            <?php echo get_post_field('post_content'); ?>
          </div>
        </div><!-- .entry-content -->
      </div>
    </div>

    <?php
      if ( comments_open() || get_comments_number() ) :
        comments_template();
      endif;
    ?>

</article><!-- #post-<?php the_ID(); ?> -->
