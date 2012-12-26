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
		collection: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],

		subset: [1, 4, 6, 2],

		comparisonFunction: function(x, y){
			return x == y;
		},

		namingFunction: function(element){
			return element;
		}
	};

	/*
		A small enumeration object that can be used to distinguish between 
		the lists that are currently beeing processed by any of the functions in the plugin
	*/

	var listTypesEnum = {
		main: "main",
		subset: "subset"
	}

	/*
		Contains all the keys used to store and retrieve data on the dom elements
		using the jQuery .data() functionality
	*/

	var dataKeys = {
		initialCollection:"elist-initialCollection",
		initialSubset:"elist-initialSubset"
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

			// Make the debug calls to print out the initial passed in lists
			debug.printCollectionToDom(processedOptions.collection, "Initial Collection objects: ", processedOptions.namingFunction);
			debug.printCollectionToDom(processedOptions.subset, "Initial Subset objects: ", processedOptions.namingFunction);

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

			var $collectionListWrapper = ui.listWrapper(listTypesEnum.main);
			var $subsetListWrapper = ui.listWrapper(listTypesEnum.subset);

			//  we are going to set the initial collections as data elements on the 
			// list wrappers which will be used throught the initialization process
			// and later on in the several plugin functions
			$collectionListWrapper.data();

			// Do the major processing and UI for each of the seperate collection lists
			init.processListUI($collectionListWrapper, options, listTypesEnum.main);
			init.processListUI($subsetListWrapper, options, listTypesEnum.subset);

			
			// add the lists to the wrapper element for the given container
			// displayed on the actual UI
			$listContainer.append($subsetListWrapper);
			$listContainer.append($collectionListWrapper);

			$listContainer.append(ui.clear());
		},

		/*
			Process the options object and  extend with default
			options.

			options: The options object that we are going to process and extend with default plugin
					 defined options.
		*/

		processOptions: function(options){

			if(typeof options === "undefined"){
				return defaultInitOptions;
			}

			var extendedOptions = $.extend(defaultInitOptions, options);
			return extendedOptions;
		},

		/*
			Process a list wrapper for the given list collection and adds all the initial list elements.

			wrapper:   The list wrapper element that wraps around a single ui for a given collection.

			options:   The options object passed for the initialization. Will be used to get to the actual collection
					   that is being processed as well if necessary to aditional initialization functions

			whichList: Flag that tells us which list we are currently processing.
		*/ 

		processListUI: function(wrapper, options, whichList){
			// get the ul element
			var $ul = ui.list();

			var collection = [];

			// Get the list we are actually currently processing from the options
			if(whichList === listTypesEnum.main){
				collection = options.collection;
			} else{
				collection = options.subset;
			}

			if(whichList === listTypesEnum.main){
				collection = utility.getExclusionList(options.collection, options.subset, options.comparisonFunction);
			}

			// get the naming function used to extract
			// the simple html display string for the items
			var namingFunction = options.namingFunction;

			for(var i = 0; i < collection.length; i++){
				var dataItem = collection[i];
				var dataItemDisplayName = namingFunction(dataItem);

				var $listItem = ui.item(dataItemDisplayName);

				// add the list item to the ul
				$ul.append($listItem);
			}

			// after adding all the items we are going to add the list item to the wrapper
			wrapper.append($ul);
		},
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

			if(type === listTypesEnum.main){
				$listWrapper.addClass("elist-main-collection-wrapper");
			}

			if(type === listTypesEnum.subset){
				$listWrapper.addClass("elist-subset-collection-wrapper");
			}

			return $listWrapper;
		},

		/*
			Create an UL list container element to be used as the list for the collections
		*/ 

		list: function(){
			var $list = $("<ul></ul>");

			$list.addClass("elist-list");
			return $list;
		},

		/*
			 Create a single list item

			 itemDisplayValue: The data display value for a given data item.
			 whichList: To which initial list will the item belong to.
			 */

		item: function(itemDisplayValue, whichList){
			var $listItem = $("<li></li>");

			// crete the elements that will store the display text/html
			// and the icons used to change list composition

			var $displayContainer = $("<div></div>").addClass("item-display-wrapper");
			var $iconContainer = $("<div></div>").addClass("item-icon-wrapper");;

			// compose the value display and icon elements
			$displayContainer.html(itemDisplayValue);
			$listItem.append($displayContainer);

			$listItem.append($iconContainer);

			// because we are going to probably use floats
			// we are going to append a clear div to the li dom element

			$listItem.append(this.clear());

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

		/*
			Function that returns the first list without the data items that are in the 
			second list based on provided comparison function.

			originalList:  The list that will be processed and returned without the items 
						   that are in the exclusionList

		    exclusionList: The list containing the items that will be removed from the original list
		    			   based on the equality comparison function

		    equalityComparison : The equality comparison function is used to determine if two data item
		    					  objects are equal
	    */
		getExclusionList: function(originalList, exclusionList, equalityComparison){
			var filteredCollection = [];

			for (var i = originalList.length - 1; i >= 0; i--) {
				var item = originalList[i];
				var itemIsPresentInExclusionList = false;

				/*
					For each item in the original list we are going to iterate
					through the exclusion list and try compare those data items
					using the equality comparion function. If the item is found it 
					will not be added in the filtered collectoin
				*/

				for (var j = exclusionList.length - 1; j >= 0; j--) {
					var exclusionListItem = exclusionList[j];

					var itemsAreEqual = equalityComparison(item, exclusionListItem);

					if(itemsAreEqual){
						itemIsPresentInExclusionList = true;
						break;
					}
				};

				if(!itemIsPresentInExclusionList){
					filteredCollection.push(item);
				}
			}

			var originalOrderCollection = [];

			// before returning the filtered collection reverse it
			// so we get the original item order
			for (var k = filteredCollection.length - 1; k >= 0; k--) {
				var item = filteredCollection[k];
				originalOrderCollection.push(item);
			};

			return originalOrderCollection;
		}
	};

	/*
		Debug and test related functionality
		=========================================================================
	*/

	var debug = {
		/*
			Print a object collection to the dom using the provided dispay function.
			Can be used to print out the initialization collection to the dom for testing
			and debug purposes

			collection: The collection that will be displayed on the dom.
			name : The name for the given collection we are going to print
			displayFunction: The function used to get the display string for each of the data items in the collection
		*/
		printCollectionToDom: function(collection, name, displayFunction){

			// Make sure the dom has the element used to print dom debug information
			var $domPrintWrapper = $(".elist-debug-printWrapper");

			// if there is no such wrapper we are going to add it to the dom
			if($domPrintWrapper.size() === 0){
				// we are going to create the dom print wrapper where we can print the lists
				var $printDebugWrapper = $("<div></div>").addClass("elist-debug-printWrapper");
				$("body").append($printDebugWrapper);

				// redo the selection
				$domPrintWrapper = $(".elist-debug-printWrapper");
			}

			// create the individual list dom element wrapper
			var $listWrapper = $("<div></div>").addClass("printed-list-wrapper");

			// create the label for the name of the list and the collection wrapper
			var $label = $("<div></div>").addClass("list-name");
			
			var $list = $("<div></div>").addClass("list");
			

			// set the values for the elements
			$label.html(name);

			// add the items one by one to the debug list wrapper
			// we are going to use a debug ul dom element

			var $ul = $("<ul></ul>");
			$list.append($ul);

			var listSize = collection.length;
			for (var i = 0; i < listSize; i++) {
				var dataItem = collection[i];
				var displayValue = displayFunction(dataItem);

				var $li = $("<li></li>");
				$li.html(displayValue);

				$ul.append($li);
			};

			// compose the elements
			$listWrapper.append($label);
			$listWrapper.append($list);
			$domPrintWrapper.append($listWrapper)
		}
	};

})(jQuery);