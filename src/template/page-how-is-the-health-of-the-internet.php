<?php
/*
 Template Name: How is the health of the internet
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="l-main site-main">

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
      <div class='l-cards-grid'>
        <div class='wrap'>
          <div class='row'>
            <div class="column small-12">
              <div class="intro-buttons-container">
              <?php
                $spotlight_args = array(
                  'post_parent' => $parent,
                  'post_type'   => 'page', 
                  'numberposts' => -1,
                  'post_status' => 'published',
                  'meta_key' => '_wp_page_template',
                  'meta_value' => 'page-trending-topics.php'      
                );
                $spotlight = get_children($spotlight_args);

                $what_is_this_args = array(
                  'post_parent' => $parent,
                  'post_type'   => 'page', 
                  'numberposts' => -1,
                  'post_status' => 'published',
                  'meta_key' => '_wp_page_template',
                  'meta_value' => 'page-what-is-this.php'      
                );
                $what_is_this = get_children($what_is_this_args);
              ?>
                <a href="<?php echo esc_url( get_permalink( array_values($what_is_this)[0]->ID ) ); ?>" class="intro-buttons"><?php esc_html_e( 'README', 'ihr-2018' ); ?></a>
                <a href="<?php echo esc_url( get_permalink( array_values($spotlight)[0]->ID ) ); ?>" class="intro-buttons"><?php esc_html_e( '2018 Spotlights', 'ihr-2018' ); ?></a>
              </div>
            </div>
          </div>
        </div>
      </div>
		</main><!-- #main -->
	</div><!-- #primary -->


<?php
get_footer();


