<?php
/**
 * The template for displaying:
 * - EXPLORE page
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
            <div class="column small-12 medium-8">
              <h2><?php echo get_post()->post_title; ?></h2>
              <p><?php echo  get_post()->post_content; ?></p>
            </div>
          </div>
        </div>

      </div>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();


