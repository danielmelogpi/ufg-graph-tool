/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global Kinetic, GraphApp, $ */
/** Defines the stage where the <canvas> element is constructed */


GraphApp.Stage = function (canvasHandler) {
	"use strict";
	this.Iam = "GraphApp.Stage";
	this.canvasHandler = canvasHandler;
	this.kineticStage = new Kinetic.Stage({
		container: canvasHandler,
		width: window.screen.availWidth,
		height: window.screen.availHeight,
		draggable: false
	});
	this.layers = [];
	this.selectionMarks = [];

	/** Adds a layer to the Kinetics Stage */
	this.addLayer = function (layer) {
		this.layers.push(layer);
		return this.kineticStage.add(layer.kineticLayer);
	};

	/** Refreshes the stage */
	this.draw = function () {
		return this.kineticStage.draw();
	};

	// @TODO fork the layers
	this.addSelectionMark = function (shape) {
		this.app.addShape(shape);
		this.selectionMarks.push(shape.holder);
	};

	this.addEventsToCanvas = function () {
		var app = this.app;
		$(this.kineticStage.content).children().on("click.unselectEverything", function (event) {
			var handler = new GraphApp.Handler.StageClick(event, this); //this ?
			handler.setApp(app);
			handler.run();
		});
	};


	
};