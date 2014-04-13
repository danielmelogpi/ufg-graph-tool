/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp, $ */

/**
* Deals with clicks on zoom elements.
* @param <Object> event    the click Event
* @param <HTMLelement> html elemento with attribute data-zoom-factor defined
* @return void
*/
GraphApp.Handler.Zoom = function (event, target) {
	"use strict";
	this.Iam = "GraphApp.Handler.Zoom";
	this.event = event;
	this.target = target;

	this.run = function () {
		var scale = $(this.target).data("zoom-scale");
		console.log(scale);
		if (Number(scale).toString() !== "NaN") {
			this.changeScaleTo(scale, this.app.stage);
		}
	};

	this.setApp = function (app) {
		this.app = app;
	};

	/** 
	* @param Number scale     how much to change
	* @param <GraphApp.Stage> stage    the stage 
	*/
	this.changeScaleTo = function (scale, stage) {
		stage.changeScaleTo(scale);
	};
};


GraphApp.Handler.Zoom.prototype = new GraphApp.Handler(undefined, undefined);
