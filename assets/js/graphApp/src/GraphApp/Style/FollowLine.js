/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Defines a default style to be used in the followLines.
* A style is something that can be applied by a shape. 
* The shape decides how to use the attributes
* @prototype <GraphApp.Graph.Style>
*/
GraphApp.Graph.Style.FollowLine = function () {
	"use strict";
	this.stroke = "red";
	this.strokeWidth = 2;
	this.lineCap = "round";
	this.lineJoin = "round";
};
GraphApp.Graph.Style.Edge.prototype = new GraphApp.Graph.Style();