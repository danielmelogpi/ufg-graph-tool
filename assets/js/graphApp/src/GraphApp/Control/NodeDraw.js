/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp, $*/

/* namespace GraphApp */
/* Depends of jquery on $*/

/** 
@class GraphApp.Control.NodeDraw
Defines a control for node drawing. 
*/
GraphApp.Control.NodeDraw = function () {
	"use strict";
	/* name of the control */
	this.nameControl = "NodeDraw";
	this.app = undefined;

	/* returns the name of the control */
	this.getName = function () {
		return this.name;
	};

	this.enable = function () {
		$(this.app.canvasHandler).children().on("click.nodedraw", [this], this.createNode);
	};

	this.disable = function () {
		$(this.app.canvasHandler).children().off("click.nodedraw");
	};

	this.createNode = function (event) {
		console.log("createNode");
		var control = event.data[0];
		var mouse = new GraphApp.Input.Mouse(control.app.stage);
		var mousePosition = mouse.getMousePosition();

		/** @TODO 	Corrigir problemas quando o scale não é 1 */
		var x = mousePosition.x / control.app.stage.kineticStage.getScaleX();
		var y = mousePosition.y / control.app.stage.kineticStage.getScaleY();

		control.app.graph.createNode(x, y);
/*
	var circle = defaultCircle(mousePos.x/stage.getScaleX(), mousePos.y/stage.getScaleY());
	stage.getLayers()[0].add(circle);
	stage.getLayers()[0].add(circle.selectionRect);
	refreshStage();*/
	};



};
GraphApp.Control.NodeDraw.prototype =  new GraphApp.Control();