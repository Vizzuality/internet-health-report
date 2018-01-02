<?php
  $counter = 0;
  // Determine active tab
  if ($isRoot) {
    $current_id = $mypages[0]->ID;
  } else {
    $current_id = get_the_ID();
  }

  foreach( $mypages as $page ) {
    ?>
      <div class="c-home-slide -active" >
        <div class="row">
          <div class="column small-12 medium-5">
            <div class="slide-content">
              <h3><?php echo $page->post_title; ?></h3>
              <p> <?php echo $page->post_content; ?></p>
            </div>
          </div>
          <div class="column small-12 medium-7">
            <div class="slide-visualization">
              <p>visualization here</p>
            </div>
          </div>
        </div>
      </div>

    <?php
    $counter++;
  }
?>


