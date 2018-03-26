<div class="l-tabs">
  <ul class="c-tabs -only-mobile">
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
  <div class="wrap -only-tablet">
    <div class="row">
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
  </div>
</div>
