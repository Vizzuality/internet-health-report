<?php
/**
 * Template part for displaying a single post
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package ihr-2018
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <header class="entry-header">
        <?php echo get_the_category()[0]->cat_name?>
    </header><!-- .entry-header -->

    <div class="entry-content">
        <h1 class="post-title">
            <?php echo the_title(); ?>
        </h1>

        <h5>
            @<?php echo get_the_author(); ?>
        </h5>

        <div class="post-content">
            <?php echo get_post_field('post_content'); ?>
        </div>


    </div><!-- .entry-content -->

    <footer class="entry-footer">
    </footer><!-- .entry-footer -->
</article><!-- #post-<?php the_ID(); ?> -->
