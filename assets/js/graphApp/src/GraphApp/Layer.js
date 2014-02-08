/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  Kinetic, GraphApp */



GraphApp.Layer = function () {
	"use strict";
	this.Iam = "GraphApp.Layer";
	this.kineticLayer = new Kinetic.Layer();
	
	/** add a shape to Kinetics Layer */
	this.addShape = function (shape) {
		this.kineticLayer.add(shape);
	};
};
