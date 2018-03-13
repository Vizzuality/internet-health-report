<div class="l-tabs">
  <div class="wrap">
    <div class="column small-12 medium-10 medium-offset-1">
      <ul class="c-tabs">
        <?php
          $counter = 0;
          // Determine active tab
          if ($isRoot) {
            $current_id = $mypages[0]->ID;
          } else {
            $current_id = get_the_ID();
          }

          foreach( $mypages as $page ) {
            //Draw tabs and show the chosen child page as active
            if($current_id == $page->ID) {
              $page_content_to_show = $page;
              ?>
                <li role="presentation" class="text -btn2 -active"><a href="<?php echo get_page_link( $page->ID ); ?>"><?php echo $page->post_title; ?></a></li>
              <?php
            } else {
              ?>
                <li role="presentation" class="text -btn2"><a href="<?php echo get_page_link( $page->ID ); ?>" ><?php echo $page->post_title; ?></a></li>
              <?php
            }

            $counter++;
          }
        ?>
      </ul>
    </div>
  </div>
</div>
<div class="l-tab-content">
  <div class="wrap">
    <div class="row">
      <div class="column small-12 medium-8">
        <p>
          <?php
            if(!empty($page_content_to_show)) {
              $child_content = $page_content_to_show->post_content;

              echo $child_content;
              $page_content_to_show = "";
            }
          ?>
        </p>
      </div>
    </div>
     <?php if (is_page([93])): ?>
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
      <p><?php _e('If you believe your name is missing from this list, just let us know.','ihr-2018' ) ?></p>
      <?php if( have_rows('credits') ): ?>
        <ul>
          <?php while( have_rows('credits') ): the_row(); ?>   
          <li><?php the_sub_field('name'); ?></li>         
          <?php endwhile; ?>
        </ul>  
      <?php endif; ?>  
    <?php endif; ?>
    </div>
  </div>
</div>
<?php if (is_page([97])): ?>
<div id="primary" class="content-area l-main">
    <main id="main" class="site-main">
        <?php

        if ( have_posts() ) :

          echo "<div class='wrap'><div class='row'>";
          if ( is_home() && ! is_front_page() ) : ?>
            <header>
              <h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
            </header>

          <?php
          endif;

          /* Start the Loop */
          while ( have_posts() ) : the_post();

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
<?php endif; ?>
