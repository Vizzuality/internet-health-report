<?php
/*
 Template Name: Home Page
 */

get_header(); ?>

<!-- Homepage Visualizations -->
<script>
<?php
  $args = array(
    'suppress_filters' => false,
    'posts_per_page' => -1,
    'post_type' => 'post',
    'post_status' => 'publish',
    'meta_query' => array(
      array(
        'key' => 'home_item',
        'value' => '1',
        'compare' => '!='
      )));
    $postslist = get_posts($args);
    if (!empty($postslist)):
      echo 'window.POSTS = [';
      foreach( $postslist as $post ):
        $reactions = reaction_count($post->ID);
        $category = get_the_category($post->ID)[0];
        echo '{';

        echo 'issue: ' . json_encode($category ->cat_name) . ',';
        echo 'color: ' . json_encode(get_field('color', 'category_' . $category->term_id)) . ',';
        echo 'type: ' . json_encode(get_post_meta($post->ID, 'type', true)) . ',';
        echo 'title: ' . json_encode($post->post_title ). ',';
        echo 'url: ' . json_encode(get_permalink($post)) . ',';
        echo 'highlighted: ' . json_encode(get_field('highlighted', $post->ID)) . ',';
        echo 'image: ' . json_encode(get_field('image', $post->ID)) . ',';
        // The next line is off until finding a faster approach
        //echo 'commentsCount: ' . (comments_count($post->ID) ? comments_count($post->ID) : 0). ',';
        echo 'reactionsCount: ' . ($reactions['total_reactions'] ? $reactions['total_reactions'] : 0) . ',';
        echo 'reactions: [';
        echo json_encode($reactions['reaction_0']) . ',';
        echo json_encode($reactions['reaction_1']);
        echo ']';

        echo '},';
      endforeach;

      echo '];';
    else:
      echo 'window.POSTS = []';
    endif;
?>
</script>
<!-- End Homepage Visualizations -->

  <?php
    // To create posts list within the category
    $args = array(
      'suppress_filters' => false,
      'posts_per_page' => 10,
      'order'          => 'ASC',
      'meta_key'       => 'order',
      'orderby'        => 'meta_value_num',
      'post_status'    => 'publish',
      'post_type'      => 'post',
      'meta_query' => array(
        array(
          'key' => 'home_item',
          'value' => 1, 'compare' => '=')));
    $postslist = get_posts($args);
  ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main l-home">
      <div class="wrap">

      <ul class="c-home-index">
        <li class="home-index-item"><a class="item-1" href="#non-category"></a></li>
        <li class="home-index-item"><a class="item-2" href="#<?php esc_html_e( 'privacy-and-security', 'ihr-2018' ); ?>"></a></li>
        <li class="home-index-item"><a class="item-3" href="#<?php esc_html_e( 'openness', 'ihr-2018' ); ?>"></a></li>
        <li class="home-index-item"><a class="item-4" href="#<?php esc_html_e( 'digital-inclusion', 'ihr-2018' ); ?>"></a></li>
        <li class="home-index-item"><a class="item-5" href="#<?php esc_html_e( 'web-literacy', 'ihr-2018' ); ?>"></a></li>
        <li class="home-index-item"><a class="item-6" href="#<?php esc_html_e( 'decentralization', 'ihr-2018' ); ?>"></a></li>
      </ul>

      <?php
        $counter = 0;
        foreach ( $postslist as $post ) :
          setup_postdata( $post );
          if ( $counter == 0 ) :
      ?>

        <div class="c-home-slide">
          <div class="row">
            <div class="column small-12 medium-7" id="non-category">
              <div class="slide-content js-visualization" data-issue="">
                <h1 class="title -main"><?php echo $post->post_title; ?></h1>
                <p> <?php echo $post->post_content; ?></p>
                <button class="text -btn1 download-tooltip-trigger">
                  <?php esc_html_e( 'Download report', 'ihr-2018' ); ?>
                  <svg class="c-icon -small"><use xlink:href="#icon-download"></use></svg>
                </button>
                <?php renderDownloadOptions() ?>
                <a href="<?php echo get_permalink( get_page_by_path( 'introduction/readme' ) ) ?>" class="text -btn1"><?php esc_html_e( 'Why this report?', 'ihr-2018' ); ?></a>
              </div>
            </div>
          </div>
        </div>

      <?php else : ?>

        <div class="c-home-slide">
          <div class="row">
            <div class="column small-12 medium-7">
              <div class="slide-content js-visualization"
                id="<?php echo esc_html_e( sanitize_title(get_the_category()[0]->cat_name), 'ihr-2018' ); ?>"
                data-issue="<?php echo get_the_category()[0]->cat_name ?>"
              >
                <div class="c-tag" style="background-color:<?php echo the_field('color', 'category_' . get_the_category()[0]->term_id);?>">
                  <?php echo get_the_category()[0]->cat_name ?>
                </div>

                <h1>
                  <a href="<?php echo get_category_link(get_the_category()[0]); ?>">
                    <?php echo $post->post_title; ?>
                  </a>
                </h1>
                <p><?php echo $post->post_content; ?></p>
              </div>
            </div>
          </div>
        </div>

      <?php
            endif;
          $counter++;
          wp_reset_postdata();
        endforeach;
      ?>

      </div>
		</main><!-- #main -->
	</div><!-- #primary -->


<?php
get_footer();


