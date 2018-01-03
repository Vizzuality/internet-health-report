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

<?php
  //To create prev/next navigation
  $itemsNav = get_posts( 'orderby=order&sort_order=asc&category=' . get_the_category()[0]->term_id );
  $items = array();
  foreach ( $itemsNav as $item ) {
    $items[] += $item->ID;
  }

  $current = array_search( get_the_ID(), $items );
  $nextID = $items[$current-1];
  $prevID = $items[$current+1];
?>


<article id="post-<?php the_ID(); ?>" <?php post_class(); ?> >
  <div class="wrap">
    <div class="l-block-detail">

      <div class="c-post-controls">
        <a href="<?php get_permalink(); ?>/category/<?php echo get_the_category()[0]->slug; ?>">
          <svg class="c-icon -medium"><use xlink:href="#icon-close_normal"></use></svg>
        </a>

        <?php if ( !empty( $nextID ) ): ?>
        <a href="<?php echo get_permalink( $nextID ); ?>"
         title="<?php echo get_the_title( $nextID ); ?>">
           <svg class="c-icon -medium"><use xlink:href="#icon-next_normal"></use></svg>
         </a>
        <?php endif;
        if ( !empty( $prevID ) ): ?>
        <a href="<?php echo get_permalink( $prevID ); ?>"
          title="<?php echo get_the_title( $prevID ); ?>">
          <svg class="c-icon -medium -rotate"><use xlink:href="#icon-next_normal"></use></svg>
        </a>
        <?php endif; ?>
      </div>

      <div class="row">
        <div class="column small-10 small-offset-1">
          <div class="c-tag" style="background-color:<?php echo the_field('color', 'category_' . get_the_category()[0]->term_id); ?>">
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

    <div class="l-social">
      <div class="wrap">

        <div class="c-social -left -share">
          <div class="reactions">
            <a href="#"><svg class="c-icon -small"><use xlink:href="#icon-facebook"></use></svg></a>
            <a href="#"><svg class="c-icon -small"><use xlink:href="icon-instagram"></use></svg></a>
            <a href="#"><svg class="c-icon -small"><use xlink:href="icon-twitter"></use></svg></a>
          </div>
          <div class="reactions">
            <span class="text -btn3">Share this</span>
          </div>
        </div>

        <div class="c-social -right -reactions">
          <div class="reactions">
            <svg class="c-icon -small"><use xlink:href="#icon-comment_icon"></use></svg>
            <span class="figure text -btn3">1,986</span>
            <span class="text -btn3">Comments</span>
          </div>
          <div id="reactions-switcher" class="reactions">
            <div class="reactions-panel">
              <span class="text -btn3">51 <svg class="c-icon -small"><use xlink:href="#icon-comment_icon"></use></svg></span>
              <span class="text -btn3">55 <svg class="c-icon -small"><use xlink:href="#icon-comment_icon"></use></svg></span>
              <span class="text -btn3">140 <svg class="c-icon -small"><use xlink:href="#icon-comment_icon"></use></svg></span>
              <span class="text -btn3">107 <svg class="c-icon -small"><use xlink:href="#icon-comment_icon"></use></svg></span>
              <span class="text -btn3">101 <svg class="c-icon -small"><use xlink:href="#icon-comment_icon"></use></svg></span>
            </div>
            <svg class="c-icon -small"><use xlink:href="#icon-comment_icon"></use></svg>
            <span class="figure text -btn3">355</span>
            <span class="text -btn3">Reactions</span>
          </div>
          <button class="btn-add-reaction" style="background-color:<?php echo the_field('color', 'category_' . get_the_category()[0]->term_id); ?>">+</button>
        </div>

      </div>
    </div>

    <?php
      if ( comments_open() || get_comments_number() ) :
        comments_template();
      endif;
    ?>

</article><!-- #post-<?php the_ID(); ?> -->
