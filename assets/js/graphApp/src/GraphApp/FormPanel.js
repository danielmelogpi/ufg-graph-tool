/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp, $ */

/**
* Deals with presenting a panel on the screen.
* FormPanels are ways for the user to interact with the application
* They have events binded to their elements that trigger an updateState function
* that can execute some sort of modification in the application
*/

GraphApp.FormPanel = function (elements, formPanelContainer) {
	"use strict";

	this.elements = elements;
	this.layoutDescriptor = undefined;
	this.parentElement = formPanelContainer;
	this.holderClass = "input-group input-group-sm";

	this.init = function () {
		//starts the panel things
		this.createDescriptor();
		this.drawPanel();
		this.bindEvents();
	};
	
	this.drawPanel = function () {
		this.clearPanel();
		//draws the description in the layout descriptor
		var descriptor = this.layoutDescriptor;
		

		//for each item in the descriptor, creates a label and the form element
		for (var k in descriptor) {
			var holder = $("<div class='" + this.holderClass + "'>");
			$(this.parentElement).append(holder);

			var item = descriptor[k];
			var legend = $("<span class='input-group-addon'>" + item.label + "</span>");
			holder.append(legend);

			var formElement = $("<" + descriptor[k].element + ">");

			if (typeof item.attr !== "undefined") {
				//gives to the form element its attributes and appends it
				for (var i in item.attr) {
					formElement.attr(i, item.attr[i]);
				}
			}
			
			if (typeof item.events !== "undefined") {
				//binds the events
				for (var j in item.events) {
					formElement.on(j, item.events[j]);
				}
			}
			formElement[0].panel = this;
			
			holder.append(formElement);
		}

	};

	this.clearPanel = function () {
		$(this.parentElement).html();
	};

	this.bindEvents = function () {
		//binds the form with events, so that changin it cause updates in the page
		throw "method not implemented";
	};


	this.executeAction = function () {
		throw "method not implemented";
	};

};