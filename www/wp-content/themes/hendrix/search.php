<?php
/**
 * The template for displaying search results pages.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#search-result
 *
 * @package Hendrix
 */

get_header(); ?>
<div id="primary" class="content-area">
    <main id="main" class="site-main" role="main">
        <div class="container">
        	<div class="white-background">
				<?php
                if ( have_posts() ) : ?>
        
                    <header class="page-header">
                        <h1 class="page-title single-title"><?php printf( esc_html__( 'Search Results for: %s', 'hendrix' ), '<span>' . get_search_query() . '</span>' ); ?></h1>
                    </header><!-- .page-header -->
                    
                    <div class="dashed-border"></div>
                    
                    <div class="row">
                        <div id="manson">
                    
                            <?php
                            /* Start the Loop */
                            while ( have_posts() ) : the_post();
                
                                /**
                                 * Run the loop for the search to output the results.
                                 * If you want to overload this in a child theme then include a file
                                 * called content-search.php and that will be used instead.
                                 */
                                get_template_part( 'template-parts/content', 'search' );
                
                            endwhile;
                
                        else :
                
                            get_template_part( 'template-parts/content', 'none' ); ?>
                    </div>
                </div>
               <?php
                endif; 
                 the_posts_pagination( array(
                        'mid_size' => 2,
                        'prev_text' => __('<span class="fa fa-chevron-left"></span>', 'hendrix'),  
                        'next_text' => __('<span class="fa fa-chevron-right"></span>', 'hendrix')
                    ) );
                ?>
            </div>
        </div>
    </main><!-- #main -->
</div><!-- #primary -->

<?php
get_footer();
