<?php
/**
 * Template part for displaying posts:
 * - Each block detail in the grid on the homepage
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package ihr-2018
 */
?>

<?php
  $importance = get_post_meta($post->ID, 'importance', true);
  $type = 'type-' . get_post_meta($post->ID, 'type', true);

  if ($importance == 1) : $columns = 'large-' . 12;
  elseif ($importance == 2) : $columns = 'medium-' . 6 . ' large-' . 8;
  else : $columns = 'medium-' . 6 . ' large-' . 4; endif;

?>

<div class="column small-12 <?php echo $columns ?> l-card">
  <a href="<?php echo get_permalink() ?>" class="c-single-post <?php echo $type ?>" id="post-<?php the_ID(); ?>">
    <span class="color-border" <?php post_class(); ?> style="background-color:<?php the_field('color', 'category_' . get_the_category()[0]->term_id)?>;"></span>

    <div class="visited" style="border-bottom-color:<?php the_field('color', 'category_' . get_the_category()[0]->term_id)?>;"></div>

  	<header class="single-post-header">
      <p class="text -link -secondary"><?php echo get_the_category()[0]->cat_name?> // <?php echo the_field('type')?></p>
  	</header><!-- .entry-header -->

  	<div class="single-post-content">
      <div class="single-post-body">
        <div class="single-post-title">
          <p class="text -box1"><?php echo the_title(); ?></p>
        </div>
        <span class="comments">
          <svg></svg>
          <span class="text">381</span>
        </span>
        <span class="reactions">
          <svg></svg>
          <span class="text">34 Reactions</span>
        </span>
      </div>

      <?php
        $image = get_post_meta($post->ID, 'image', true);
        if ($image) { ?>
          <div class='single-post-image' style='background-image:url(<?php the_field('image')?>)'></div>
        <?php }
      ?>
  	</div><!-- .entry-content -->
  </a><!-- #post-<?php the_ID(); ?> -->
</div>
