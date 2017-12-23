<ul class="nav nav-tabs">
<?php
    $counter = 0;

    foreach( $mypages as $page ) {

        //show first page as active if no child page is chosen
        if(!isset($active_page) && $counter <1) {
            $active_page = $page->ID;
        }

        //show the chosen child page as active
        if($active_page == $page->ID) {
            $page_content_to_show = $page;
        ?>
        <li role="presentation" class="active"><a href="<?php echo get_page_link( $page->ID ); ?>"><?php echo $page->post_title; ?></a></li>
        <?php
        } else {
        ?>
        <li role="presentation"><a href="<?php echo get_page_link( $page->ID ); ?>" ><?php echo $page->post_title; ?></a></li>
        <?php
        }

        $counter++;
    }

    if(!empty($page_content_to_show)) {
      $child_content = $page_content_to_show->post_content;
      $child_content = apply_filters('the_content', $child_content);

      echo $child_content;
      $page_content_to_show = "";
    }
?>
</ul>

