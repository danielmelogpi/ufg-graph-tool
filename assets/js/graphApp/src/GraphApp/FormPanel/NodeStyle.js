/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Deals with selecting and unselecting elements
* @param <Object> event    the dragging event
* @param <GraphApp.Node> | <GraphApp.Edge>  target     who was clicked
* @return void
*/

GraphApp.FormPanel.NodeStyle = function (elements, formPanelContainer, toogleButton) {
	"use strict";

	this.elements = elements;
	this.layoutDescriptor = undefined;
	this.parentElement = formPanelContainer;
	this.toogleButton = toogleButton;

	this.createDescriptor = function () {

		var panel = this;

		this.layoutDescriptor = [
			{
				label: "Cor de borda",
				element: "input",
				attr: {
					type: "text",
					"class": "form-control",
					placeholder: "Cor do traço",
					value: this.elements[0].shape.getStroke()
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
					placeholder: "Cor do preenchimento",
					value: this.elements[0].shape.getFill()
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
					min: "4",
					max: "40",
					"class": "form-control",
					placeholder: "Raio do vértice",
					value: this.elements[0].shape.getRadius()
				},
				events : {
					blur: panel.updateRadius,
					change: panel.updateRadius
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
		el.panel.elements.forEach(function (element) {
			element.shape.setStroke(el.value);
		});
		try {
			el.panel.elements[0].graph.stage.draw();
		}
		catch (e) {
			console.error(e);
		}
	};

	this.updateFill = function () {
		var el = this;
		el.panel.elements.forEach(function (element) {
			element.shape.setFill(el.value);
		});
		try {
			el.panel.elements[0].graph.stage.draw();
		}
		catch (e) {
			console.error(e);
		}
	};


	this.updateRadius = function () {
		var el = this;
		el.panel.elements.forEach(function (element) {
			element.shape.setRadius(el.value);
			element.selectionMark.updateMarkConfig();
		});
		try {
			el.panel.elements[0].graph.stage.draw();
		}
		catch (e) {
			console.error(e);
		}
	};



};

GraphApp.FormPanel.NodeStyle.prototype = new GraphApp.FormPanel();