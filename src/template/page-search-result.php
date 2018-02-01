<?php
/*
 Template Name: Search Page
 */

get_header(); 
get_template_part('template-parts/search-bar');


?>
<div id="primary" class="content-area l-main">
		<main id="main" class="site-main">
    		<?php
            $wpb_all_query = new WP_Query(array('post_type'=>'post', 'post_status'=>'publish', 'posts_per_page'=>-1));

    		if ( $wpb_all_query->have_posts() ) :

                echo "<div class='wrap'><div class='row'>";

    			/* Start the Loop */
    			while ( $wpb_all_query->have_posts() ) : $wpb_all_query->the_post();

    				/*
    				 * Include the Post-Format-specific template for the content.
    				 * If you want to override this in a child theme, then include a file
    				 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
    				 */

    				get_template_part( 'template-parts/content', get_post_format() );

    			endwhile;

    			the_posts_navigation();

                echo "</div></div>";

    		else :
                echo "<div class='wrap'><div class='row'>";
    			get_template_part( 'template-parts/content', 'none' );
                echo "</div></div>";
    		endif;
    		?>
      </div>
		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_sidebar();
get_footer();