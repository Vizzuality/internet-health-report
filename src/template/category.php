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
    $args = array( 'order'=> 'ASC', 'orderby' => 'order', 'category' => get_the_category()[0]->term_id );
    $postslist = get_posts( $args );
  ?>

  <div id="primary" class="content-area categories">
    <main id="main" class="site-main l-main">
      <div class="wrap">
        <div class="row">
          <div class="column small-12">
            <header class="page-header">
              <a href="#" class="c-tag" style="background-color:<?php echo the_field('color', 'category_' . get_the_category()[0]->term_id);?>"><?php echo single_cat_title( '', true); ?></a>
              <h2><?php echo the_archive_description();?></h2>
            </header><!-- .page-header -->
          </div>
        </div>
      </div>

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
                get_template_part( 'template-parts/content', get_post_format() );

              endforeach;
              wp_reset_postdata();
              the_posts_navigation();

            ?>
        </div>
      </div>
    </div>

    </main><!-- #main -->
  </div><!-- #primary -->

<?php
// get_sidebar();
get_footer();
