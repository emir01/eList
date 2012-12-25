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
		collection: [1, 2, 3, 4,5,6,7,8,9,10,11,12,13,14,15],

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
			var init = this;
			var $listContainer = $(containerElement);

			$listContainer.addClass("elist-lists-container");

			// Create and process the list wrappers

			var $collectionListWrapper = ui.listWrapper("main");
			var $subsetListWrapper = ui.listWrapper("subset");

			init.processList($collectionListWrapper, options.collection, options.namingFunction);
			init.processList($subsetListWrapper, options.subset, options.namingFunction);

			// compose the list container elements

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
		},

		/*
			Process a list wrapper for the given list collection and adds all the initial list elements

			wrapper:        The list wrapper element that wraps around a single ui for a given collection.
			collection:     The actual collection object containing the data.
			namingFunction: The function that we can use to extract the display name for any given data item.

		*/ 
		processList: function(wrapper, collection, namingFunction){
			// get the ul element
			var $ul = ui.list();

			for(var i = 0; i < collection.length; i++){
				var dataItem = collection[i];
				var dataItemDisplayName = namingFunction(dataItem);

				var $listItem = ui.item(dataItemDisplayName);

				// add the list item to the ul
				$ul.append($listItem);
			}

			// after adding all the items we are going to add the list item to the wrapper
			wrapper.append($ul);
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
			Create an UL list container element to be used as the list for the collections
		*/ 
		list:function(){
			var $list = $("<ul></ul>");

			$list.addClass("elist-list");
			return $list;
		},

		/*
			 Create a single list item

			 itemDisplayValue: The data display value for a given data item.
		*/

		item:function(itemDisplayValue){
			var $listItem = $("<li></li>");
			$listItem.html(itemDisplayValue);

			return $listItem;
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