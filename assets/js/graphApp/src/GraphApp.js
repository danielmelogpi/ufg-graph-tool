/** jslint */
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global Kinetic*/


/** 
* Defines the namespace for the application
* Takes care of drawning and navigation
* @param String		canvasHandler		ID of the element that will receive the canvas stage
*/
var GraphApp = function (canvasHandler) {
	"use strict";
	
	this.Iam = "GraphApp";
	this.stage = new GraphApp.Stage(canvasHandler);
	this.nodeLayer = new GraphApp.Layer();
	this.edgeLayer = new GraphApp.Layer();
	this.selectionLayer = new GraphApp.Layer();

	this.activeControl = new GraphApp.Control.Navigation();

	this.graph = new GraphApp.Graph();
	this.graph.app = this;
	this.graph.stage = this.stage;

	this.canvasHandler = document.getElementById(canvasHandler);

	this.stage.addLayer(this.edgeLayer);
	this.stage.addLayer(this.nodeLayer);
	this.stage.addLayer(this.selectionLayer);

	/** Adds a Kinetic form to the proper layer */
	this.addShape = function (shape) {
		if (shape instanceof Kinetic.Circle) {
			this.nodeLayer.addShape(shape);
		}
		else if (shape instanceof Kinetic.Spline) {
			this.edgeLayer.addShape(shape);
		}
		else if (shape instanceof Kinetic.Rect) {
			this.selectionLayer.addShape(shape);
		}
		else {
			console.error("There is no layer configured to such shape");
			return false;
		}
		this.stage.draw();
		return true;
	};

	/** changes the application control to other one */
	this.changeControlTo = function (control) {
		if (control instanceof GraphApp.Control) {
			this.activeControl.disable();
			this.activeControl = control;
			control.app = this;
			control.enable();
			return true;
		}
		return false;
	};

};
