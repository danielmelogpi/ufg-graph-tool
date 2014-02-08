"use strict";
/** jslint */
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*globa*/


/** 
* Defines the namespace for the application
* Takes care of drawning and navigation
* @param String		canvasHandler		Element that will receive the canvas stage
*/
var GraphApp = function (canvasHandler) {
	this.stage = new GraphApp.Stage(canvasHandler);
	this.theLayer = new GraphApp.Layer();

	this.graph = new GraphApp.Graph();
	this.graph.parent = this;
	this.canvasHandler = document.getElementById(canvasHandler);

	this.stage.add(this.theLayer);

	this.addShape = function (shape) {
		this.theLayer.add(shape);
		this.theLayer.draw();
	};

	return this;
};
