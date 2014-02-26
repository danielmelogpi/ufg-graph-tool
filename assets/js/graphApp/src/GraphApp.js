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
	this.graph = new GraphApp.Graph();
	this.layer = new GraphApp.Layer();
	this.nodeLayer = new GraphApp.Layer();
	this.edgeLayer = new GraphApp.Layer();
	this.selectionLayer = new GraphApp.Layer();
	this.activeControl = new GraphApp.Control.Navigation();

	
	this.graph.app = this;
	this.graph.stage = this.stage;

	this.stage.app = this;
	this.stage.addEventsToCanvas();

	this.canvasHandler = document.getElementById(canvasHandler);
	
	/** is it possible to use 3 layers to preserve z-index without loosing click
	propagation ?  */
	this.stage.addLayer(this.layer);
	//this.stage.addLayer(this.edgeLayer);
	//this.stage.addLayer(this.nodeLayer);
	//this.stage.addLayer(this.selectionLayer);

	/** Adds a Kinetic form to the proper layer */
	this.addShape = function (shape) {
		if (shape instanceof Kinetic.Circle) {
			this.layer.addShape(shape);
		}
		else if (shape instanceof Kinetic.Spline) {
			this.layer.addShape(shape);
		}
		else if (shape instanceof Kinetic.Rect) {
			this.layer.addShape(shape);
		}
		else if (shape instanceof Kinetic.Line) {
			this.layer.addShape(shape);
		}
		else {
			console.warn("There is no layer configured to such shape.");
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
