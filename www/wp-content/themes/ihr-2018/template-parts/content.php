<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package ihr-2018
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <a class="single-post" href="<?php echo get_permalink() ?>">
	<header class="entry-header">
        <?php echo the_field('type')?> // <?php echo get_the_category()[0]->cat_name?>
	</header><!-- .entry-header -->

	<div class="entry-content">
        <div class="post-title">
            <?php echo the_title(); ?>
        </div>

        <div class="post-image">
            <img src="<?php the_field( 'image') ?>"
        </div>

	</div><!-- .entry-content -->

	<footer class="entry-footer">
	</footer><!-- .entry-footer -->
    </a>
</article><!-- #post-<?php the_ID(); ?> -->
