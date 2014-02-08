/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp*/

/* namespace GraphApp */
"use strict";

/** 
@class GraphApp.Control.EdgeDraw
Defines a control for edge drawing
*/
GraphApp.Control.EdgeDraw = function () {
	
	/* name of the control */
	this.nameControl = "EdgeDraw";

	/* returns the name of the control */
	this.getName = function () {
		return this.name;
	};
};
GraphApp.Control.EdgeDraw.prototype =  new GraphApp.Control();