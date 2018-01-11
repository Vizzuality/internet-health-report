/**
 * File search.js.
 *
 * Function to make the search button work
 */

(function($) {
    
    $('#search-button').on('click', function() {
        // vars
        var url = window.location.protocol + "//" + window.location.host + "/";
            args = {};

        // loop over filters
        $('#archive-filters .filter').each(function(){
            
            // vars
            var filter = $(this).data('filter'),
                vals = [];
            
            
            // find checked inputs
            $(this).find('input:selected').each(function(){
    
                vals.push( $(this).val() );
    
            });
            
            
            // append to args
            args[ filter ] = vals.join(',');
            
        });

        var searchText = $('#archive-filters .search-bar .search-text');
        args['s'] = searchText.val();

        // update url
        url += '?';
        
        
        // loop over args
        $.each(args, function( name, value ){
            
            url += name + '=' + value + '&';
            
        });
        
        
        // remove last &
        url = url.slice(0, -1);

        window.location = url;
        //window.open(url);

    });

})(jQuery);