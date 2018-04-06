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
  $args = array(
    'posts_per_page' => -1,
    'order'=> 'ASC',
    'meta_key' => 'order',
    'orderby' => 'meta_value_num',
    'category' => get_the_category()[0]->term_id,
    'meta_query' => array(
       array(
         'key' => 'home_item',
          'value' => 1,
          'compare' => '!=')) );
  $itemsNav = get_posts($args);
  $items = array();
  foreach ( $itemsNav as $item ) {
    $items[] += $item->ID;
  }

  $current = array_search( get_the_ID(), $items );
  $prevID = $items[$current-1];
  $nextID = $items[$current+1];
?>


<article id="post-<?php the_ID(); ?>" <?php post_class(); ?> >
  <div class="wrap">
    <div class="l-block-detail">

      <div class="c-post-controls">
        <a
          href="<?php echo get_category_link(get_the_category()[0]); ?>"
          title="<?php esc_html_e( 'Go back to issue', 'ihr-2018' ) ?>"
          class="js-close-button"
        >
          <svg class="c-icon"><use xlink:href="#icon-close_normal"></use></svg>
        </a>

        <?php if ( !empty( $nextID ) ): ?>
        <a href="<?php echo get_permalink( $nextID ); ?>"
         title="<?php echo esc_html_e( 'Next article: ', 'ihr-2018' ) . get_the_title( $nextID ); ?>">
           <svg class="c-icon"><use xlink:href="#icon-next_normal"></use></svg>
         </a>
        <?php endif;
        if ( !empty( $prevID ) ): ?>
        <a href="<?php echo get_permalink( $prevID ); ?>"
          title="<?php echo esc_html_e( 'Previous article: ', 'ihr-2018' ) . get_the_title( $prevID ); ?>">
          <svg class="c-icon -rotate"><use xlink:href="#icon-next_normal"></use></svg>
        </a>
        <?php endif; ?>
      </div>

      <div class="row">
        <div class="column small-10 small-offset-1">
          <div class="c-tag" style="background-color:<?php echo the_field('color', 'category_' . get_the_category()[0]->term_id); ?>">
            <a href="<?php echo get_category_link(get_the_category()[0]); ?>"><?php echo get_the_category()[0]->cat_name ?></a>
          </div>
        </div>
      </div>

      <div class="column small-10 small-offset-1">
        <div class="c-post">
          <h1 class="post-title">
            <?php echo the_title(); ?>
          </h1>
          <span class="post-date">
            <?php esc_html_e( 'April 2018', 'ihr-2018' ); ?>
          </span>
          <div class="post-content">
            <?php the_content(); ?>
          </div>
          <?php get_template_part('template-parts/reactions-bar'); ?>
        </div><!-- .entry-content -->
      </div>
    </div>

<div id="coral_talk_stream"></div>
<script src="https://talk.mofoprod.net/static/embed.js" async onload="
  Coral.Talk.render(document.getElementById('coral_talk_stream'), {
    talk: 'https://talk.mofoprod.net/'
  });
"></script>



</article><!-- #post-<?php the_ID(); ?> -->
