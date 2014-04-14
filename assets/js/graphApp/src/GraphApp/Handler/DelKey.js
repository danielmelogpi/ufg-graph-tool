/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Deals with hitting the del key. When we have selected elements, they must be deleted
* They are suposed to be setted by the GraphApp.window object
* @param <Object> event    the click Event
* @param <GraphApp> the application
* @return void
*/
GraphApp.Handler.DelKey = function (event, app) {
	"use strict";
	this.Iam = "GraphApp.Handler.DelKey";
	this.event = event;
	this.app = app;
	//this.target = target;	this one doesnt have a meaninfull target

	this.run = function () {
		console.debug("running delkey handler");
		
		if (this.app.activeControl instanceof GraphApp.Control.Navigation) {
			console.debug("deleting");
			var nodes = this.app.graph.nodes.filter(function (e) {
				return e.selectionMark.shape.isVisible();
			});

			var edges = this.app.graph.edges.filter(function (e) {
				return e.selectionMark.shape.isVisible();
			});

			var delControl = new GraphApp.Control.Delete();
			delControl.app = this.app;

			nodes.forEach(function (node) {
				delControl.deleteNode(node);
			});

			edges.forEach(function (edge) {
				delControl.deleteEdge(edge);
			});
			
			this.app.stage.draw();
		}

	};

};


GraphApp.Handler.DelKey.prototype = new GraphApp.Handler(undefined, undefined);
