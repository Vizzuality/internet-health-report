<?php
/**
 * The template for displaying archive pages.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Hendrix
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
			<div class="container">
            	<div class="white-background">
                    <div class="row">
                        <?php
                        if ( have_posts() ) : ?>
                            <div class="col-md-12">
                                <header class="page-header">
                                    <?php
                                        the_archive_title( '<h1 class="page-title">', '</h1>' );
                                        the_archive_description( '<div class="taxonomy-description">', '</div>' );
                                    ?>
                                </header><!-- .page-header -->
                            </div>
                            <div class="clearfix"></div>
                            <div id="manson">
                                <?php
                                /* Start the Loop */
                                while ( have_posts() ) : the_post();
                    
                                    /*
                                     * Include the Post-Format-specific template for the content.
                                     * If you want to override this in a child theme, then include a file
                                     * called content-___.php (where ___ is the Post Format name) and that will be used instead.
                                     */
                                    get_template_part( 'template-parts/content', get_post_format() );
                    
                                endwhile;
                    
                    
                            else :
                
                            get_template_part( 'template-parts/content', 'none' ); ?>
                            </div>
                       <?php  endif; ?>
                        <div class="clearfix"></div>
                        <?php
                            the_posts_pagination( array(
                                'mid_size' => 2,
                                'prev_text' => __('<span class="fa fa-chevron-left"></span>', 'hendrix'),  
                                'next_text' => __('<span class="fa fa-chevron-right"></span>', 'hendrix')
                            ) ); 
                        ?>
                        
                    </div>
                </div>
			</div>
		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();
