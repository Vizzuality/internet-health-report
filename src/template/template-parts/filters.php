<?php
  /**
   * Function to build filter selectors
   */
  function buildSelect($tax){
    $terms = get_terms($tax);
    $x = '<select name="'. $tax .'">';
    $x .= '<option value="">Select '. ucfirst($tax) .'</option>';
    foreach ($terms as $term) {
       $x .= '<option value="' . $term->slug . '">' . $term->name . '</option>';
    }
    $x .= '</select>';
    return $x;
  }
?>


<!-- Get the categories and draw selectors -->
<form  method="post" action="">
  <?php  $taxonomies = get_object_taxonomies('post');
    foreach($taxonomies as $tax){
      echo buildSelect($tax);
    }
  ?>
  <input type="submit"/>
</form>

