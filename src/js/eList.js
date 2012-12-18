/*

	jQuery plugin that can be used to make list selections via an interactive widget
	from a given object collection.

	The plugin is development with hopes to make it
	more integretable with knockout binding.
*/


(function($){

	// define the basic jquery plugin

	$.fn.eList = function(params) {

		// check if params is not a query string under which case
		// we are doing initial eList initialization

		if(typeof params !== "string"){

			return this.each(function(index,element){
				// initialize the container
				init.initContainer(element);
			});
		}
		else{
			// Do something else with the request given with the string
			// for the given jquery object

			// Probalby call a methods object with the name of the param
			//return queries[params];
		}
	};

	/*
		The default options used by the plugin
	*/

	var defaultInitOptions = {
		
	};

	/*
		The initialization namespace for the eList plugin
		Contains function that are used to process options
		and initialize lists
	*/

	var init =  {

		/*
			Initialize a list container by adding the
			base container class
		*/

		initContainer:function(containerElement) {
			var $listContainer = $(containerElement);
			$listContainer.addClass("elist-lists-container");
		},

		/*
			Process the options object and  extend with default
			options
		*/

		processOptions: function(options){
					
		}
	};

	/*
		The utility namespace for the eList plugin containing utility methods
	*/

	var utility = {

	};

})(jQuery);