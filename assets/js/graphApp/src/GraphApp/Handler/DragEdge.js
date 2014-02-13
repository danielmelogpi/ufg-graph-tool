/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp, $ */

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
	console.log(this.target);


	/** Executes a animation  that curves the line until the control point
	* reaches the mouse position 
	* A closure is used to preserve this object betwen the executions of the interval
	* @param handler   this exact instance of the object for when the setInterval is 
	* setted up
	*/
	this.curveToMousePosition = function (handler) {
		console.log("curving");

		/** CODIGO PERIGOSO */
		var animation = new Kinetic.Animation(function (frame) {
			var mouseInput = new GraphApp.Input.Mouse(handler.target.graph.stage);
			var mousePosition = mouseInput.getMousePosition();
			
			target.curveModified = true;
			var actualPoints = handler.target.shape.getPoints();

			handler.target.shape.setPoints([10, 20, 12, 22, 14, 20]);
			console.debug(handler);
		},
		handler.target.graph.stage);
		animation.start();
/** CODIGO PERIGOSO */

		console.debug(animation);
	};

	/** Stops the curving animation execution */
	this.stop = function (event) {
		//event.data[0] is sent in mouseup.dragEdge event, attached to window
		if (event.data[0]) {
			clearInterval(event.data[0]);
			console.debug(event.data[0]);
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
