<?php
/**
 * The template for displaying 404 pages (not found).
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package Hendrix
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
			<div class="container">
            	<div class="white-background">
                    <div class="row">
                        <div class="col-md-12">
                        
                            <section class="error-404 not-found">
                                <header class="page-header">
                                    <h1 class="page-title single-title"><?php esc_html_e( 'Oops! That page can&rsquo;t be found.', 'hendrix' ); ?></h1>
                                </header><!-- .page-header -->
                                
                                <div class="dashed-border"></div>
                                
                                <div class="page-content">
                                    <p><?php esc_html_e( 'It looks like nothing was found at this location. Maybe try one of the links below or a search?', 'hendrix' ); ?></p>
                
                                    <?php
                                        get_search_form();
                                    ?>
                                   
                                    <?php
                                        the_widget( 'WP_Widget_Tag_Cloud' );
                                    ?>
                
                                </div><!-- .page-content -->
                            </section><!-- .error-404 -->
                            
                        </div>
                    </div>
                </div>
			</div>
		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();
