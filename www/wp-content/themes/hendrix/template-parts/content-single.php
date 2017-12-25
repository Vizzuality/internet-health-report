<?php
/**
 * Template part for displaying posts.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Hendrix
 */

?>
    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    	
        <header class="entry-header">
            <?php
                if ( is_single() ) {
                    the_title( '<h1 class="entry-title single-title">', '</h1>' );
                } else {
                    the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
                }
            ?>
        </header><!-- .entry-header -->
        
    	<div class="dashed-border"></div>
        
        <?php
		if ( 'post' === get_post_type() ) : ?>
		<div class="entry-meta">
			<?php hendrix_posted_on(); ?>
		</div><!-- .entry-meta -->
		<?php
		endif; ?>
        
		<?php if(has_post_thumbnail()){ ?>
            <div class="img-container">
                <a href="<?php the_permalink('') ?>" title="<?php the_title(); ?>"><?php the_post_thumbnail('full'); ?></a>
            </div>
        <?php } ?>
    
        <div class="entry-content">
            <?php the_content(); ?>
			<?php
            wp_link_pages( array(
                'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'hendrix' ),
                'after'  => '</div>',
            ) );
            ?>
            
        </div><!-- .entry-content -->
    
    </article><!-- #post-## -->
	<div class="dashed-border"></div>