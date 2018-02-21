<?php
/**
 * The template for displaying category pages:
 * - Issues pages
 *
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package ihr-2018
 */

get_header(); ?>
  <?php
    // To create posts list within the category
    $args = array('posts_per_page' => -1, 'order'=> 'ASC', 'orderby' => 'order', 'category' => get_the_category()[0]->term_id,
      'meta_query' => array( array( 'key' => 'home_item', 'value' => 1, 'compare' => '!=')) );
      
    $postslist = get_posts( $args );
  ?>

  <div id="primary" class="content-area categories">
    <main id="main" class="site-main l-main">
      <div class="wrap">
        <div class="row">
          <div class="column small-12 medium-8">
            <header class="page-header">
              <a href="#" class="c-tag" style="background-color:<?php echo the_field('color', 'category_' . get_the_category()[0]->term_id);?>"><?php echo single_cat_title( '', true); ?></a>
              <h2><?php echo the_archive_description();?></h2>
              <p><?php echo the_field('summary', 'category_' . get_the_category()[0]->term_id);?></p>
            </header><!-- .page-header -->
          </div>
        </div>
      </div>

      <?php if ( have_posts() ) : ?>
        <div class='l-cards-grid'>
          <div class='wrap'>
            <div class='row'>
              <?php
                /* Start the Loop */
                foreach ( $postslist as $post ) :
                  setup_postdata( $post );
                  /*
                   * Include the Post-Format-specific template for the content.
                   * If you want to override this in a child theme, then include a file
                   * called content-___.php (where ___ is the Post Format name) and that will be used instead.
                   */
                  get_template_part( 'template-parts/content');
                  wp_reset_postdata();
                endforeach;
              ?>
          </div>
        </div>
      </div>
    <?php else :?>
      <div class='l-cards-grid'>
          <div class='wrap'>
            <div class='row'>
              <p>No post available</p>
            </div>
        </div>
      </div>
    <?php endif; ?>

    </main><!-- #main -->
  </div><!-- #primary -->

<?php
// get_sidebar();
get_footer();
