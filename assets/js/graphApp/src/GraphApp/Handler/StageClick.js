/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Deals with clicks given in the stage. Do this work if I split the canvas?
* @param <Object> event    the click Event
* @param <GraphApp.Stage> the stage
* @return void
*/
GraphApp.Handler.StageClick = function (event, target) {
	"use strict";
	this.Iam = "GraphApp.Handler.StageClick";
	this.event = event;
	this.target = target;
	this.details = {};
	this.app = undefined;

	this.run = function () {
		console.log(this);
		this.unselectEverything();
	};

	this.setApp = function (app) {
		this.app = app;
	};

	// unselects all the features if you click an empty area
	this.unselectEverything = function () {
		if (!this.app.events.featureClicked) {
			this.app.graph.edges.forEach(function (el) { //unselects edges
				el.selectionMark.shape.setVisible(false);
			});

			this.app.graph.nodes.forEach(function (el) { //unselects nodes
				el.selectionMark.shape.setVisible(false);
			});

			this.app.stage.draw();	//draw things	
		}
		this.app.events.featureClicked = false;
	};

};


GraphApp.Handler.StageClick.prototype = new GraphApp.Handler(undefined, undefined);