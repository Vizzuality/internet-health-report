<?php
/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package ihr-2018
 */

get_header(); ?>

	<div id="primary" class="content-area categories">
		<main id="main" class="site-main l-main">

		<?php

		if ( have_posts() ) : ?>
      <div class="wrap">
        <div class="row">
          <div class="column small-12">
      			<header class="page-header">

              <a href="#" class="text -btn2" style="<?php echo get_field('color', 'category_' . $category_id) ?>"><?php echo single_cat_title( '#', true); ?></a>
      				<h2><?php echo the_archive_description();?></h2>
      			</header><!-- .page-header -->
          </div>
        </div>
      </div>

			<?php
        echo "<div class='l-cards-grid'><div class='wrap'><div class='row'>";
    			/* Start the Loop */
    			while ( have_posts() ) : the_post();

    				/*
    				 * Include the Post-Format-specific template for the content.
    				 * If you want to override this in a child theme, then include a file
    				 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
    				 */
    				get_template_part( 'template-parts/content', get_post_format() );

    			endwhile;
        echo "</div></div></div>";

			the_posts_navigation();

		else :

			get_template_part( 'template-parts/content', 'none' );

		endif; ?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
// get_sidebar();
get_footer();
