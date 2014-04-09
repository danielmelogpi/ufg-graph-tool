/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */


/**
* Deals with presenting a panel on the screen that allows edge customization
* FormPanels are ways for the user to interact with the application
* They have events binded to their elements that trigger an updateState function
* that can execute some sort of modification in the application
*/

GraphApp.FormPanel.EdgeStyle = function (elements, formPanelContainer, toogleButton) {
	"use strict";

	this.elements = elements;
	this.layoutDescriptor = undefined;
	this.parentElement = formPanelContainer;
	this.toogleButton = toogleButton;


	this.executeAction = function () {
		throw "method not implemented";
	};

	this.createDescriptor = function () {

		var panel = this;

		this.layoutDescriptor = [
			{
				label: "Cor",
				element: "input",
				attr: {
					type: "text",
					"class": "form-control color-chooser",
					placeholder: "Cor do traço",
					value: this.elements[0].shape.getStroke()
				},
				events : {
					blur: panel.updateStroke,
					keyup: panel.updateStroke
				}

			},//end of item
			{
				label: "Espessura",
				element: "input",
				attr: {
					type: "range",
					step: "0.2",
					min: "1",
					max: "10",
					"class": "form-control",
					placeholder: "Username",
					value: this.elements[0].shape.getStrokeWidth()
				},
				events : {
					blur: panel.updateStrokeWidth,
					change: panel.updateStrokeWidth
				}
			}, //end of item
		];// end of desc  array
	};

	
	this.updateStrokeWidth = function () {
		var el = this;
		el.panel.elements.forEach(function (edge) {
			edge.shape.setStrokeWidth(el.value);
		});
		try {
			el.panel.elements[0].graph.stage.draw();
		}
		catch (e) {
			console.error(e);
		}
	};
	

	this.updateStroke = function () {
		var el = this;
		el.panel.elements.forEach(function (edge) {
			edge.shape.setStroke(el.value);
		});
		try {
			el.panel.elements[0].graph.stage.draw();
		}
		catch (e) {
			console.error(e);
		}
	};
	

};

GraphApp.FormPanel.EdgeStyle.prototype = new GraphApp.FormPanel(undefined, undefined);