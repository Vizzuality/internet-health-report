<?php // Search filters ?>
	<div id="archive-filters">

		<div>
				<select class="js-filter" data-filter="issue">
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
		<div>
			<select class="js-filter" data-filter="<?php echo $name; ?>">
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
			<input type="text" class="js-filter" data-filter="s" value=<?php echo $_GET["s"] ?>>
			<button id="search-button" type="button" class="js-search-button">Search</button>
		</div>
	</div>


