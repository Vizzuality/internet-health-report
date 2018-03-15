<?php
/*
 Template Name: What is this
 */

get_header(); 

?>

<div id="primary" class="content-area">
    <main id="main" class="site-main l-main" style="padding-bottom: 10px;">

      <?php
        // Defines active tab
        $current = get_the_ID();

        // Get parent page info.
        $parent = $post->post_parent;

        // Determine wheter we are in the section's root
        if ($parent == 0) {
          $section_root = true;
        } else {
          $section_root = false;
        };

        // Get the current post info
        $current_post = get_post($parent);
        $parent_title = $current_post->post_title;
        $content = $current_post->post_content;

        // Draw section header
        ?>
          <div class="wrap">
            <div class="l-section-header">
              <div class="row">
                <div class="column small-12 medium-8">
                  <h2><?php echo $parent_title; ?></h2>
                  <p><?php echo $content; ?></p>
                </div>
              </div>
            </div>
          </div>
        <?php

        // Determine active section to ask for children
        if ($section_root) {
          $active_page = $current;
        } else {
          $active_page = $parent;
        }

        // Determine pages
        $mypages = get_pages( array( 'child_of' => $active_page, 'sort_column' => 'menu_order', 'sort_order' => 'asc' ) );

        // Draw tabs
        if(count($mypages) > 0) {
          // Declare global var with pages to be available in the template
          set_query_var( 'mypages', $mypages );
          set_query_var( 'isRoot', $section_root );
          // Get tabs template
          get_template_part( 'template-parts/tab' );
        }

      ?>
      <div class="l-tab-content" style="padding-top: 0;">
        <div class="wrap">
          <h3><?php _e('Issues','ihr-2018' ) ?></h3>
          <div class="l-categories">
            <div class="row">
              <?php $exclude_category = '';
                if(is_category()) {
                  $exclude_category = get_the_category()[0]->cat_ID;
                }
                $args = array(
                'hide_empty' => 0,
                'exclude'    => $exclude_category);
                $categories = get_categories($args);
                foreach($categories as $category){
              ?>
              <a href="<?php echo get_category_link($category->term_id) ?>" class="column small-12 medium-4 l-category-card" >
                <div class="c-category-card" data-image="<?php echo get_field('image', 'category_' . $category->term_id) ?>" data-color="<?php echo get_field('color', 'category_' . $category->term_id) ?>" <?php post_class(); ?> style="background-color:<?php echo get_field('color', 'category_' . $category->term_id) ?>">
                  <h4 class="category-name">#<?php echo $category->name ?></h4>
                  <p class="text -box1"><?php echo $category->description ?></p>
                </div>
              </a>
              <?php }?>
            </div>
          </div>
          <div class="what-credits row">
            <h3><?php _e('Credits','ihr-2018' ) ?></h3>
            <h4><?php _e('If you believe your name is missing from this list, just let us know.','ihr-2018' ) ?></h4>
            <?php if( have_rows('credits') ): ?>
              <ul>
                <?php while( have_rows('credits') ): the_row(); ?>   
                  <li><?php the_sub_field('name'); ?></li>         
                <?php endwhile; ?>
              </ul>  
            <?php endif; ?>
        </div>
      </div>

    </main><!-- #main -->
</div><!-- #primary -->



<?php
get_sidebar();
get_footer();