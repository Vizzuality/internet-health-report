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
		<main id="main" class="site-main">

		<?php
		if ( have_posts() ) : ?>
      <div class="wrap">
        <div class="row">
          <div class="column small-12">
      			<header class="page-header">
              <a href="#" class="text -btn2"><?php echo single_cat_title( '#', true); ?></a>
              <h2><?php echo get_field('description', 'category_' . $category->term_id) ?></h2>

      				<!-- <?php

      					the_archive_title();
      					the_archive_description( '<h2>', '</h2>' );

      				?> -->

              <?php the_meta() ?>
              <?php echo get_post_custom() ?>
              <?php echo get_post_custom_values() ?>

      			</header><!-- .page-header -->
          </div>
        </div>
      </div>

			<?php
        echo "<div class='wrap'><div class='row'><div class='column small-12'>";
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
get_sidebar();
get_footer();
