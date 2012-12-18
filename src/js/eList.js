/*

	jQuery plugin that can be used to make list selections via an interactive widget
	from a given object collection.

	The plugin is development with hopes to make it
	more integretable with knockout binding.
*/


(function($){

	// define the basic jquery plugin

	$.fn.eList = function(action, params) {

		// check if params is not a query string under which case
		// we are doing initial eList initialization

		if(typeof action !== "string"){

			// if the action is not a string then the 
			// action should be the options object
			return init.mainInit(this, action);
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

		- collection:         The collection containing all the objects 
							  that will be used in the subset creation

		- subset:             The subset collection that will be populated 
						      from the main collection object

		- comparisonFunction: The function used to compare two objects for equality

		- namingFunction:     The function used to get the display name for a given 
							  object that will be shown on the widget UI
	    =========================================================================
	*/

	var defaultInitOptions = {
		collection: [1, 2, 3, 4],

		subset: [],

		comparisonFunction: function(x, y){
			return x == y;
		},

		namingFunction: function(element){
			return element;
		}
	};	

	/*
		The initialization namespace for the eList plugin
		Contains function that are used to process options
		and initialize lists
		=========================================================================
	*/

	var init =  {

		/*
			The main initialization function

			jqueryObject: The 'this' jquery context object from the custom plugin
			options:      The options object for the initialization process
		*/

		mainInit: function(jqueryObject, options){
			var init = this;

			var processedOptions = init.processOptions(options)

			return jqueryObject.each(function(index, element){
				// initialize the container
				init.initContainer(element, processedOptions);

			});
		},

		/*
			Initialize a list container by adding the
			base container class

			containerElement: The element that is to be the top level collections list
							  container

		    options:          The options used to initializer the collections widget.
		*/

		initContainer:function(containerElement, options) {
			var $listContainer = $(containerElement);

			$listContainer.addClass("elist-lists-container");

			var $collectionListWrapper = ui.listWrapper("main");
			var $subsetListWrapper = ui.listWrapper("subset");

			// compose the lists 
			$listContainer.append($subsetListWrapper);
			$listContainer.append($collectionListWrapper);

			$listContainer.append(ui.clear());
		},

		/*
			Process the options object and  extend with default
			options.
		*/

		processOptions: function(options){

			if(typeof options === "undefined"){
				return defaultInitOptions;
			}

			var extendedOptions = $.extend(defaultInitOptions, options);
			return extendedOptions;
		}
	};

	/*
		The UI construction namespace for the eList plugin containing ui construction methods
		and functionality
		=========================================================================
	*/

	var ui = {

		/*
			Create the list manager toolbar item
		*/
		toolbar:function(){

		},

		/*
			Create a wrapper around a collection list

			type: The type of collection the wrapper
				  will be wrapping
		*/
		listWrapper:function(type){

			var $listWrapper = $("<div></div>");

			$listWrapper.addClass("elist-collection-wrapper");

			if(type === "main"){
				$listWrapper.addClass("elist-main-collection-wrapper");
			}

			if(type ==="subset"){
				$listWrapper.addClass("elist-subset-collection-wrapper");
			}

			return $listWrapper;
		},

		/*
			 Create a single list item
		*/

		item:function(){

		},

		/*
			 Create a clear div element
		*/

		clear:function(){
			var $clearDiv = $("<div></div>");
			$clearDiv.addClass("elist-clear");

			return $clearDiv;
		}
	};

	/*
		The utility namespace for the eList plugin containing utility methods
		=========================================================================
	*/

	var utility = {

	};

})(jQuery);