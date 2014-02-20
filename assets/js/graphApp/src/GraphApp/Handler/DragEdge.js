/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp, $,Kinetic */

/**
* Deals with dragging a node. 
* @param <GraphApp.Edge>   target     who was dragged
* @param <Object> event    the dragging event
* @return void
*/
GraphApp.Handler.DragEdge = function (event, target) {
	"use strict";
	this.event = event;
	this.target = target;
	this.interval = undefined;
	console.debug(graphApp.stage.kineticStage.getPointerPosition());


	/** Executes a animation  that curves the line until the control point
	* reaches the mouse position 
	* A closure is used to preserve this object betwen the executions of the interval
	* @param handler   this exact instance of the object for when the setInterval is 
	* setted up
	*/
	this.curveToMousePosition = function (handler) {
		/** CODIGO PERIGOSO */
		var animation = new Kinetic.Animation(function () {
			var mouseInput = new GraphApp.Input.Mouse(handler.target.graph.stage, handler.event);
			var mousePosition = mouseInput.getMousePosition();

			/** @TODO é necessário fazer o calculo de animação. 
			Como ele é demorado para alinhar, vou fazer depois */
			target.curveModified = true;
			var actualPoints = handler.target.shape.getPoints();
			var edgeOrigin = handler.target.origin;
			var edgeTarget = handler.target.target;
			var points = [];
			points[0] = edgeOrigin.shape.getX();
			points[1] = edgeOrigin.shape.getY();
			points[2] = mousePosition.x;
			points[3] = mousePosition.y;
			points[4] = edgeTarget.shape.getX();
			points[5] = edgeTarget.shape.getY();
			
			handler.target.shape.setPoints(points);
			handler.target.graph.stage.draw();	
			this.stop();
		},
		handler.target.graph.stage);
		animation.start();

	};

	/** Stops the curving animation execution */
	this.stop = function (event) {
		//event.data[0] is sent in mouseup.dragEdge event, attached to window
		if (event.data[0]) {
			clearInterval(event.data[0]);
			console.debug("Stopping interval '" + event.data[0] + "'");
			$(window).off("mouseup.dragEdge");
		}
	};

	/** Sets a function that executes the animation */
	this.run = function () {
		var curveMousePosition = this.curveToMousePosition;
		var thisHandler = this;
		this.interval = setInterval(function () {
			curveMousePosition(thisHandler);
		}, 50);
		var interval = this.interval;
		$(window).on("mouseup.dragEdge", [interval], this.stop);
	};
	
	this.details.success = true;

}; //end of object
GraphApp.Handler.DragEdge.prototype = new GraphApp.Handler(undefined);
