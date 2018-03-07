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
        <a href="<?php echo get_bloginfo( 'url' ); ?>/category/<?php echo get_the_category()[0]->slug; ?>">
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
      /**
       *  Temporary place for the code to count and list reactions/comments
       */ 


      // Get table name
      global $wpdb;
      $table = $wpdb->prefix . "postmeta";

      // Get number of reactions
      $reaction_count = $wpdb->get_results("SELECT sum(meta_value) as total_reactions FROM $table where meta_key like '_reaction_buttons%' and post_id = " . get_the_ID());
      $reaction_order = $wpdb->get_results("SELECT meta_key, meta_value FROM $table where meta_key like '_reaction_buttons%' and post_id = " . get_the_ID() . " order by meta_value desc" );
      $reaction_names = explode(',', get_option('reaction_buttons_button_names'));

      $reaction_0 = (int) substr($reaction_order[0]->meta_key, -1);
      $reaction_1 = (int) substr($reaction_order[1]->meta_key, -1);


      echo '<div>Number of reactions: ' . $reaction_count[0]->total_reactions . "</div>";
      echo '<div>Most used: ' . $reaction_names[$reaction_0] . "</div>";
      echo '<div>Second most used: ' . $reaction_names[$reaction_1] . "</div>";


      echo do_shortcode('[reaction_buttons]');
    ?>

<div id="coral_talk_stream"></div>
<script src="https://talk.mofoprod.net/static/embed.js" async onload="
  Coral.Talk.render(document.getElementById('coral_talk_stream'), {
    talk: 'https://talk.mofoprod.net/'
  });
"></script>



</article><!-- #post-<?php the_ID(); ?> -->
