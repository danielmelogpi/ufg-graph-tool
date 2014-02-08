/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp*/

/* namespace GraphApp */
"use strict";

/** 
@class GraphApp.Control.Zoom
Defines zoom actions over the stage
*/
GraphApp.Control.Zoom = function () {
	
	/* name of the control */
	this.nameControl = "Zoom";

	/* returns the name of the control */
	this.getName = function () {
		return this.name;
	};
	
};
GraphApp.Control.Zoom.prototype =  new GraphApp.Control();