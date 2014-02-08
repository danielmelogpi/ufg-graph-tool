/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp*/

/* namespace GraphApp */
"use strict";

/** 
@class GraphApp.Control.NodeDraw
Defines a control for node drawing. 
*/
GraphApp.Control.NodeDraw = function () {
	
	/* name of the control */
	this.nameControl = "NodeDraw";

	/* returns the name of the control */
	this.getName = function () {
		return this.name;
	};
};
GraphApp.Control.NodeDraw.prototype =  new GraphApp.Control();