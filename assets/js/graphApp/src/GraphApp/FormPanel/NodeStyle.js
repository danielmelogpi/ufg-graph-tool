/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Deals with selecting and unselecting elements
* @param <Object> event    the dragging event
* @param <GraphApp.Node> | <GraphApp.Edge>  target     who was clicked
* @return void
*/

GraphApp.FormPanel.NodeStyle = function (elements, formPanelContainer) {
	"use strict";

	this.elements = elements;
	this.layoutDescriptor = undefined;
	this.parentElement = formPanelContainer;

	this.createDescriptor = function () {

		var panel = this;

		this.layoutDescriptor = [
			{
				label: "Cor de borda",
				element: "input",
				attr: {
					type: "text",
					"class": "form-control",
					placeholder: "Cor do traço"
				},
				events : {
					blur: panel.updateStroke,
					keyup: panel.updateStroke
				}

			},//end of item
			{
				label: "Cor do preenchimento",
				element: "input",
				attr: {
					type: "text",
					"class": "form-control",
					placeholder: "Cor do preenchimento"
				},
				events : {
					blur: panel.updateFill,
					keyup: panel.updateFill
				}

			},//end of item
			{
				label: "Raio",
				element: "input",
				attr: {
					type: "range",
					step: "0.2",
					min: "10",
					max: "40",
					"class": "form-control",
					placeholder: "Raio do vértice"
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

	this.updateFill = function () {
		// body...
	};




};

GraphApp.FormPanel.NodeStyle.prototype = new GraphApp.FormPanel();