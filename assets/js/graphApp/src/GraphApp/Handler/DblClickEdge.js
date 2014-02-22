/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp,Kinetic */

/**
* Deals with dblclicking an edge when navigating. 
* @param <GraphApp.Edge>   target     who was dragged
* @param <Object> event    the dragging event
* @return void
*/
GraphApp.Handler.DblClickEdge = function (event, target) {
	"use strict";
	this.event = event;
	this.target = target;

	/** 
	* Executes an animation that restores the control point of the edge to
	* the original position
	*/
	this.restoreCurve = function () {
		/** CODIGO PERIGOSO */
		var handler = this;
		var animation = new Kinetic.Animation(function () {
			//console.debug("animation");
			target.curveModified = false; //curve is no longer modified
			
			var edgeOrigin = handler.target.origin;
			var edgeTarget = handler.target.target;
			var points = [];
			points[0] = edgeOrigin.shape.getX();
			points[1] = edgeOrigin.shape.getY();
			points[2] = edgeTarget.shape.getX(); //control point matches the end
			points[3] = edgeTarget.shape.getY();
			points[4] = edgeTarget.shape.getX();
			points[5] = edgeTarget.shape.getY();
			
			handler.target.shape.setPoints(points);
			handler.target.graph.stage.draw();
			//handler.stop();
		},
		this.target.graph.stage);
		animation.start();

	};

	/** Stops the curving animation execution */
	this.stop = function (event) {
		//console.debug("stopping");
	};

	/** Sets a function that executes the animation */
	this.run = function () {
		//console.debug("running");
		this.restoreCurve();
	};
	
	this.details.success = true;

}; //end of object
GraphApp.Handler.DblClickEdge.prototype = new GraphApp.Handler(undefined);
