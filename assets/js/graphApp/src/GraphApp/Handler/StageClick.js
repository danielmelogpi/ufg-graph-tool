/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Deals with selecting and unselecting elements
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

	this.run = function () {
		console.log(this);
	};

};
GraphApp.Handler.StageClick.prototype = new GraphApp.Handler(undefined, undefined);