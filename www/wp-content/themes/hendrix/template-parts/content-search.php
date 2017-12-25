<?php
/**
 * Template part for displaying results in search pages.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Hendrix
 */

?>
<div class="item col-md-6">
    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
        <?php if(has_post_thumbnail()){ ?>
            <div class="img-container">
                <a href="<?php the_permalink('') ?>" title="<?php the_title(); ?>"><?php the_post_thumbnail('hendrix-large-thumbnails'); ?></a>
            </div>
        <?php } ?>
        
        <header class="entry-header">
            <?php
                if ( is_single() ) {
                    the_title( '<h1 class="entry-title">', '</h1>' );
                } else {
                    the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
                }
    
            if ( 'post' === get_post_type() ) : ?>
            <div class="entry-meta">
                <?php hendrix_posted_on(); ?>
            </div><!-- .entry-meta -->
            <?php
            endif; ?>
        </header><!-- .entry-header -->
    
        <div class="entry-content">
            <?php the_excerpt(); ?>
			<?php
            wp_link_pages( array(
                'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'hendrix' ),
                'after'  => '</div>',
            ) );
            ?>
            <p class="rmore-wrapper"><a href="<?php the_permalink('') ?>" class="read_more"><?php _e( 'Read More', 'hendrix' ); ?></a></p>
        </div><!-- .entry-content -->
    </article><!-- #post-## -->
</div>