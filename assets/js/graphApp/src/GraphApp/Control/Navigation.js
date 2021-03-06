/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp*/

/* namespace GraphApp */
"use strict";

/** 
@class GraphApp.Control
Defines that represents user interaction with the application. 
*/
GraphApp.Control.Navigation = function () {
	
	/* name of the control */
	this.nameControl = "Navigation";

	/* returns the name of the control */
	this.getName = function () {
		return this.name;
	};

	this.enable = function () {
		this.app.graph.nodes.forEach(function (node) {
			node.shape.setDraggable(true);
		});
	};

	this.disable = function () {
	};
};
GraphApp.Control.Navigation.prototype =  new GraphApp.Control();