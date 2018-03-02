<?php
/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package ihr-2018
 *
 */

get_header(); ?>

  <?php
    // To create posts list within the category
    $args = array(
      'order'=> 'DES',
      'meta_key' => 'order',
      'orderby' => 'meta_value_num',
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
        <li><a class="item-1" href="#item-1"></a></li>
        <li><a class="item-2" href="#item-2"></a></li>
        <li><a class="item-3" href="#item-3"></a></li>
        <li><a class="item-4" href="#item-4"></a></li>
        <li><a class="item-5" href="#item-5"></a></li>
        <li><a class="item-6" href="#item-6"></a></li>
      </ul>

      <?php
        $counter = 0;
        foreach ( $postslist as $post ) :
          setup_postdata( $post );
          if ( $counter == 0 ) :
      ?>

        <div class="c-home-slide">
          <div class="row">
            <div class="column small-12 medium-7">
              <div class="slide-content">
                <h1 class="title -main"><?php echo $post->post_title; ?></h1>
                <p> <?php echo $post->post_content; ?></p>
                <a class="text -link -dark" href="#">
                  <svg class="c-icon -small"><use xlink:href="#icon-download"></use></svg>
                  <?php esc_html_e( 'Download report', 'ihr-2018' ); ?></p>
                </a>
              </div>
            </div>
            <div class="column small-12 medium-5">
              <div class="slide-visualization">
                <p><?php esc_html_e( 'Visualizations here.', 'ihr-2018' ); ?></p></p>
              </div>
            </div>
          </div>
        </div>

      <?php else : ?>

        <div class="c-home-slide">
          <div class="row">
            <div class="column small-12 medium-7">
              <div class="slide-content">
                <div class="c-tag" style="background-color:<?php echo the_field('color', 'category_' . get_the_category()[0]->term_id);?>">
                  <?php echo get_the_category()[0]->cat_name ?>
                </div>

                <h1><?php echo $post->post_title; ?></h1>
                <p> <?php echo $post->post_content; ?></p>
              </div>
            </div>
            <div class="column small-12 medium-5">
              <div class="slide-visualization">
                <p><?php esc_html_e( 'Visualizations here.', 'ihr-2018' ); ?></p>
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


