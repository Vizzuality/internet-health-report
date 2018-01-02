<?php
/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package ihr-2018
 *
 * EXAMPLE OF TAB: https://studiofreya.com/wordpress/how-to-show-child-pages-as-tabs/
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main l-home">

      <ul class="c-home-index">
        <li><a class="item-1" href="#item-1"></a></li>
        <li><a class="item-2" href="#item-2"></a></li>
        <li><a class="item-3" href="#item-3"></a></li>
        <li><a class="item-4" href="#item-4"></a></li>
        <li><a class="item-5" href="#item-5"></a></li>
        <li><a class="item-6" href="#item-6"></a></li>
      </ul>

      <div class="wrap">
        <div class="c-home-slide">
          <div class="row">
            <div class="column small-12 medium-7">
              <div class="slide-content">
                <h1 class="title -main"><?php echo get_post()->post_title; ?></h1>
                <p> <?php echo get_post()->post_content; ?></p>
                <a class="text -link -dark" href="#">
                  <svg class="c-icon -small"><use xlink:href="#icon-download"></use></svg>
                  Download report
                </a>
              </div>
            </div>
            <div class="column small-12 medium-5">
              <div class="slide-visualization">
                <p>visualization here</p>
              </div>
            </div>
          </div>
        </div>

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
            get_template_part( 'template-parts/home-slides' );
          }
  			?>
      </div>

		</main><!-- #main -->
	</div><!-- #primary -->


<?php
get_footer();


