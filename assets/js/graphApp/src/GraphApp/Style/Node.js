"use strict";

/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Defines a default style to be used in the nodes shapes.
* A style is something that can be applied by a shape. 
* The shape decides how to use the attributes
* @prototype <GraphApp.Graph.Style>
*/
GraphApp.Graph.Style.Node = function () {
	this.radius = 12;
	this.strokeWidth = 2;
};
GraphApp.Graph.Style.Node.prototype = new GraphApp.Graph.Style();