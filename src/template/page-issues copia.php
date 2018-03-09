<?php
/**
 * The template for displaying:
 * - ISSUES page
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package ihr-2018
 *
 *
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main l-main">

      <div class="wrap">
        <div class="l-section-header">
          <div class="row">
            <div class="column small-12 medium-10">
              <h2 style="padding-bottom:30px; margin-top:-30px;"><?php echo get_post()->post_title; ?></h2>
              <p><?php echo  get_post()->post_content; ?></p>
            </div>
          </div>
        </div>
      <div class="row">
        <?php
        $issues_cat_ID = get_cat_ID( 'Issue' ); 
        $issues_cats   = get_categories( "parent=$news_cat_ID" );
        $issues_query  = new WP_Query;

        foreach ( $issues_cats as $issues_cat ) :
            $issues_query->query( array(
                'cat'                 => $issues_cat->term_id,
                'posts_per_page'      => 1,
                'no_found_rows'       => true,
                'ignore_sticky_posts' => true,
        )); ?>
        
        <div class="column small-12 medium-3 c-issue-card">
        <p><?php echo esc_html( $issues_cat->name ) ?></p>

          <?php while ( $issues_query->have_posts() ) : $issues_query->the_post() ?>

            <div >
                <?php the_title() ?>
                <!-- do whatever you else you want that you can do in a normal loop -->
            </div>  

          <?php endwhile ?>
        </div>

        <?php endforeach ?></div>

        <div class="l-explore">
          <div class="row">
          <!-- <?php get_template_part('template-parts/filters'); ?> -->
          </div>
        </div>
      </div>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();


