<?php
/**
 * Template part for displaying page content in page.php
 * - Introduction
 * - Issues
 * - Participate
 * - Explore
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package ihr-2018
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
  <div class="wrap">
    <div class="row">
      <div class="column small-12">
      	<header class="entry-header">
      		<?php the_title( '<h2 class="entry-title">', '</h2>' ); ?>
      	</header><!-- .entry-header -->
      </div>
    </div>
  </div>

	<div class="entry-content">
		<?php
			the_content();

			wp_link_pages( array(
				'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'ihr-2018' ),
				'after'  => '</div>',
			) );
		?>
	</div><!-- .entry-content -->

	<?php if ( get_edit_post_link() ) : ?>
		<footer class="entry-footer">
			<?php
				edit_post_link(
					sprintf(
						wp_kses(
							/* translators: %s: Name of current post. Only visible to screen readers */
							__( 'Edit <span class="screen-reader-text">%s</span>', 'ihr-2018' ),
							array(
								'span' => array(
									'class' => array(),
								),
							)
						),
						get_the_title()
					),
					'<span class="edit-link">',
					'</span>'
				);
			?>
		</footer><!-- .entry-footer -->
	<?php endif; ?>
</article><!-- #post-<?php the_ID(); ?> -->


