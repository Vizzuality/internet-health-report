<?php // Search filters ?>
	<div id="archive-filters">

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
			<select class="filter">
			<?php 
				//create_field( $field ); 
				foreach($field['choices'] as $choice) {
					if (strcasecmp($current_value , $choice) === 0) {
						echo "<option value=$choice selected>$choice</option>";
					}
					else {
						echo "<option value=\"$choice\">$choice</option>";
					}
				}
			?>
			</select>
		</div>
		
	<?php 
		endforeach; 
		$selected_category = $_GET['issue'];
	?>

		<div class="filter" data-filter="issue">
				<select class="filter">
				<?php 
					foreach(get_categories() as $category)
					if (strcasecmp($category->name, $selected_category) === 0) {
						echo "<option value=\"$category->name\" selected>$category->name</option>";
					} 
					else {
						echo "<option value=\"$category->name\">$category->name</option>";
					}
				?>
				</select>
		</div>
		<div class="search-bar">
			<input type="text" class="search-text" value=<?php echo $_GET["s"] ?>>
			<input id="search-button" type="button" class="search-button"> 
		</div>
	</div>

	
