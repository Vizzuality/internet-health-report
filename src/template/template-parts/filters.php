

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

<form role="search" method="GET" id="searchform" action="<?php echo get_permalink(); ?>">
  <fieldset>

    <input type="text" name="search" value="" placeholder="search&hellip;" maxlength="50">
    <button type="submit">Search</button>
  </fieldset>
</form>



