/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global Kinetic, GraphApp , $*/

/** Defines an edge and it's properties.
* This object retrieves the reference to Kinetic Js Spline, 
* that is the visual node */
GraphApp.FollowLine = function (anchor) {
	"use strict";
	this.Iam = "GraphApp.FollowLine";
	this.anchor = anchor;
	this.lastDetectedMouse = undefined;
	this.shape = undefined;
	this.graph = anchor.graph;

	(function (followLine) {
		var x = followLine.anchor.shape.getX();
		var y = followLine.anchor.shape.getY();

		// COLOCAR STYLE ADEQUADO!
		followLine.shape = new Kinetic.Line({
			points: [x, y, x, y],
			stroke: "red",
			strokeWidth: 2,
			lineCap: "round",
			lineJoin: "round"
		});

		followLine.shape.holder = followLine;
		followLine.graph.app.addShape(followLine.shape);
	}
	)(this);

	// atualiza a follow line para a posição atual do mouse
	this.updateToMouse = function (evt) {
		console.debug("updating crap!");
		var followLine = evt.data[0];
		var mouse = new GraphApp.Input.Mouse(followLine.graph.app.stage);
		var mousePosition = mouse.getMousePosition();
		followLine.lastDetectedMouse = mousePosition;
		
		var points = followLine.shape.getPoints();
		console.log(points[1]);
		var x = mousePosition.x - 5;
		var y = mousePosition.y - 5;

		points[1] = {x: x, y: y};

		console.log(mousePosition);
		console.log(points[1]);
		followLine.shape.setPoints(points);
		followLine.graph.app.stage.draw();
	};

	this.startUpdate = function () {
		console.debug("starting update");
		$(this.graph.app.canvasHandler).children().on("mousemove.updatefollowline", [this], this.updateToMouse);
	};

	this.stopUpdate = function () {
		console.debug("stopping update");
		$(this.graph.app.canvasHandler).children().off("mousemove.updatefollowline");
		this.shape.remove();
		this.graph.stage.draw();
	};
};