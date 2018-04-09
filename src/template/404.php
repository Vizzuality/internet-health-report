<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package ihr-2018
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main">
			<div class="wrap">
				<div class="row">
					<div class="column small-12">
						<section class="error-404 not-found">
							<header class="page-header">
								<h1 class="page-title title -main"><?php esc_html_e( 'Oops! That page can&rsquo;t be found.', 'ihr-2018' ); ?></h1>
							</header><!-- .page-header -->

							<div class="page-content">
								<p><?php esc_html_e( 'It looks like nothing was found at this location.', 'ihr-2018' ); ?></p>
								<a href="https://internethealthreport.org/2018" class="btn -primary">
									<?php esc_html_e( 'Start again', 'ihr-2018' ); ?>
								</a>
								</div><!-- .widget -->
							</div><!-- .page-content -->
						</section><!-- .error-404 -->
					</div>
				</div>
			</div>
			
		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();
