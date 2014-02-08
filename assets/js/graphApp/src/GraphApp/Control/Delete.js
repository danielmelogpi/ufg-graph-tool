/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp*/

/* namespace GraphApp */
"use strict";

/** 
@class GraphApp.Control.Delete
Defines a control for deletion of shapes
*/
GraphApp.Control.Delete = function () {
	
	/* name of the control */
	this.nameControl = "Delete";

	/* returns the name of the control */
	this.getName = function () {
		return this.name;
	};
};
GraphApp.Control.Delete.prototype =  new GraphApp.Control();