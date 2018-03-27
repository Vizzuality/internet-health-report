<?php // Search filters ?>
<div class="row">
  <div class="column small-12">
    <form id="archive-filters" class="wrap c-explore-filters" method="get">
      <input type="hidden" name="lang" value="<?php echo(ICL_LANGUAGE_CODE); ?>"/>
      <div class="selectors">
        <select class="js-filter" name="issue" aria-label="<?php _e( 'Filter by issue', 'ihr-2018' ); ?>">
          <?php
            $selected_category = $_GET['issue'];
            if ($selected_category === "" || $selected_category === NULL) {
              echo "<option value=\"\" selected>". translate( 'All Issues', 'ihr-2018' ) ."</option>";
            } else {
              echo "<option value=\"\">". translate( 'All Issues', 'ihr-2018' ) ."</option>";
            }

            foreach(get_categories() as $category)
            if (strcasecmp($category->name, $selected_category) === 0) {
              echo "<option value=\"$category->name\" selected>$category->name</option>";
            } else {
              echo "<option value=\"$category->name\">$category->name</option>";
            }
          ?>
        </select>

        <?php foreach( $GLOBALS['my_query_filters'] as $key => $name ):
          // get the field's settings without attempting to load a value
          $field = get_field_object($name);

          $current_value = NULL;
          // set value if available
          if( isset($_GET[ $name ]) ) {

            //$field['value'] = explode(',', $_GET[ $name ]);
            $current_value = $_GET[ $name];

          }

          // create filter
        ?>
          <select class="js-filter" name="type" aria-label="<?php _e( 'Filter by type', 'ihr-2018' ); ?>">
            <?php
              if ($current_value === "" || $current_value === NULL) {
                echo "<option value=\"\" selected>". translate( 'All Types', 'ihr-2018' ) ."</option>";
              } else {
                echo "<option value=\"\">". translate( 'All Types', 'ihr-2018' ) ."</option>";
              }
              foreach($field['choices'] as $choice) {
                if (strcasecmp($current_value , $choice) === 0) {
                  echo "<option value=$choice selected>$choice</option>";
                } else {
                  echo "<option value=\"$choice\">$choice</option>";
                }
              }
            ?>
          </select>
        <?php
          endforeach;
        ?>
      </div>
      <div class="inputs">
        <input type="text" class="js-filter" name="s" value="<?php echo $_GET["s"] ?>" placeholder="<?php _e( 'Keyword search', 'ihr-2018' ); ?>" aria-label="<?php _e( 'Keyword search', 'ihr-2018' ); ?>">
        <button id="search-button" type="submit" class="js-search-button" aria-label="<?php _e('Search', 'ihr-2018' ); ?>">
          <svg class="c-icon -small"><use xlink:href="#icon-search"></use></svg>
        </button>
      </div>
    </form>
  </div>
</div>


