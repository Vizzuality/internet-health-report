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
        <a
          href="<?php echo get_bloginfo( 'url' ); ?>/category/<?php echo get_the_category()[0]->slug; ?>"
          title="<?php esc_html_e( 'Go back to issue', 'ihr-2018' ) ?>"
          class="js-close-button"
        >
          <svg class="c-icon -medium"><use xlink:href="#icon-close_normal"></use></svg>
        </a>

        <?php if ( !empty( $nextID ) ): ?>
        <a href="<?php echo get_permalink( $nextID ); ?>"
         title="<?php echo esc_html_e( 'Next article: ', 'ihr-2018' ) . get_the_title( $nextID ); ?>">
           <svg class="c-icon -medium"><use xlink:href="#icon-next_normal"></use></svg>
         </a>
        <?php endif;
        if ( !empty( $prevID ) ): ?>
        <a href="<?php echo get_permalink( $prevID ); ?>"
          title="<?php echo esc_html_e( 'Previous article: ', 'ihr-2018' ) . get_the_title( $prevID ); ?>">
          <svg class="c-icon -medium -rotate"><use xlink:href="#icon-next_normal"></use></svg>
        </a>
        <?php endif; ?>
      </div>

      <div class="row">
        <div class="column small-10 small-offset-1">
          <div class="c-tag" style="background-color:<?php echo the_field('color', 'category_' . get_the_category()[0]->term_id); ?>">
            <a href="<?php echo get_bloginfo( 'url' ); ?>/category/<?php echo get_the_category()[0]->slug; ?>"><?php echo get_the_category()[0]->cat_name ?></a>
          </div>
        </div>
      </div>

      <div class="column small-10 small-offset-1">
        <div class="c-post">
          <h1 class="post-title">
            <?php echo the_title(); ?>
          </h1>
          <div class="post-content">
            <?php the_content(); ?>
          </div>
        </div><!-- .entry-content -->
      </div>
    </div>

    <?php // get_template_part( 'template-parts/social-bar');?>

    <?php
      $reactions = reaction_count(get_the_ID());


      echo '<div>Number of reactions: ' . $reactions['total_reactions'] . "</div>";
      echo '<div>Most used: ' . $reactions['reaction_0'] . "</div>";
      echo '<div>Second most used: ' . $reactions['reaction_1'] . "</div>";

      echo '<div>Number of comments: '. comments_count(get_the_ID()) .'</div>';

      echo do_shortcode('[reaction_buttons]');
    ?>

<div id="coral_talk_stream"></div>
<script src="https://talk.mofoprod.net/static/embed.js" async onload="
  Coral.Talk.render(document.getElementById('coral_talk_stream'), {
    talk: 'https://talk.mofoprod.net/'
  });
"></script>



</article><!-- #post-<?php the_ID(); ?> -->
