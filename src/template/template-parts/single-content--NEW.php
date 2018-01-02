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

<!-- <?php
  // To create prev/next navigation
  $postlistnav = get_posts( 'orderby=order&sort_order=asc&category=' . get_the_category()[0]->term_id );
  $posts = array();
  foreach ( $postlistnav as $post ) {
    $posts[] += $post->ID;
  }

  $current = array_search( get_the_ID(), $posts );
  $prevID = $posts[$current-1];
  $nextID = $posts[$current+1];
?> -->

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?> >
  <div class="wrap">
    <div class="l-block-detail">
      <div class="c-post-controls">
        <a href="#">
          <svg class="c-icon -medium"><use xlink:href="#icon-close_normal"></use></svg>
        </a>

        <?php if ( !empty( $nextID ) ): ?>
        <a href="<?php echo get_permalink( $nextID ); ?>"
         title="<?php echo get_the_title( $nextID ); ?>">
           <svg class="c-icon -medium  -rotate"><use xlink:href="#icon-next_normal"></use></svg>
         </a>
        <?php endif;
        if ( !empty( $prevID ) ): ?>
        <a href="<?php echo get_permalink( $prevID ); ?>"
          title="<?php echo get_the_title( $prevID ); ?>">
          <svg class="c-icon -medium"><use xlink:href="#icon-next_normal"></use></svg>
        </a>
        <?php endif; ?>

      </div>
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
