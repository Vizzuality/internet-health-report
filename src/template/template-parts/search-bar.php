<?php // Search filters ?>
	<div id="archive-filters">

		<div class="filter" data-filter="issue">
				<select class="filter-select">
				<?php
					$selected_category = $_GET['issue'];
					if ($selected_category === "" || $selected_category === NULL) {
						echo "<option value=\"\" selected>All Issues</option>";
					} else {
						echo "<option value=\"\">All Issues</option>";
					}

					foreach(get_categories() as $category)
					if (strcasecmp($category->name, $selected_category) === 0) {
						echo "<option value=\"$category->name\" selected>$category->name</option>";
					} else {
						echo "<option value=\"$category->name\">$category->name</option>";
					}
				?>
				</select>
		</div>

	<?php foreach( $GLOBALS['my_query_filters'] as $key => $name ): 

		// Get the ID of a post. This is a hack to use the get_field_object,
		// as is requires the id of a post
		$temp_post_id = get_posts("numberposts=1")[0]->ID;

		// get the field's settings without attempting to load a value
		$field = get_field_object($name, $temp_post_id);
		
		$current_value = NULL;
		// set value if available
		if( isset($_GET[ $name ]) ) {
			
			//$field['value'] = explode(',', $_GET[ $name ]);
			$current_value = $_GET[ $name];
			
		}

		// create filter
		?>
		<div class="filter" data-filter="<?php echo $name; ?>">
			<select class="filter-select">
			<?php 
				if ($current_value === "" || $current_value === NULL) {
					echo "<option value=\"\" selected>All {$name}s</option>";
				} else {
					echo "<option value=\"\">All {$name}s</option>";
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
		</div>
		
	<?php 
		endforeach; 
	?>
		<div class="search-bar">
			<input type="text" class="search-text" value=<?php echo $_GET["s"] ?>>
			<input id="search-button" type="button" class="search-button"> 
		</div>
	</div>

	
