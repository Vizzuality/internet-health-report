<div class="l-categories">
  <div class="row">
    <?php
        $exclude_category = '';

        if(is_category()) {
            $exclude_category = get_the_category()[0]->cat_ID;
        }

        $args = array(
                'hide_empty' => 0,
                'exclude'    => $exclude_category
        );
        $categories = get_categories($args);

        foreach($categories as $category){

            ?>
            <a href="<?php echo get_category_link($category->term_id) ?>" class="column small-12 medium-4 l-category-card" >
                <div class="c-category-card" data-image="<?php echo get_field('image', 'category_' . $category->term_id) ?>" data-color="<?php echo get_field('color', 'category_' . $category->term_id) ?>" <?php post_class(); ?> style="background-color:<?php echo get_field('color', 'category_' . $category->term_id) ?>">
                    <h4 class="category-name">#<?php echo $category->name ?></h4>
                    <p class="category-description"><?php echo $category->description ?></p>
                </div>
            </a>
        <?php }
    ?>
  </div>
</div>
