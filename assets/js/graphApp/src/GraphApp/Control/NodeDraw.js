/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp*/

/* namespace GraphApp */
"use strict";

/** 
@class GraphApp.Control.NodeDraw
Defines a control for node drawing. 
*/
GraphApp.Control.NodeDraw = function () {
	
	/* name of the control */
	this.nameControl = "NodeDraw";
	this.app = undefined;

	/* returns the name of the control */
	this.getName = function () {
		return this.name;
	};

	this.enable = function () {
		this.app.stage.kineticStage.on("click.nodedraw", this.createNode);
	};

	this.disable = function () {
		this.app.stage.kineticStage.off("click.NodeDraw");
	};

	this.createNode = function () {
		console.log("createNode");
	};



};
GraphApp.Control.NodeDraw.prototype =  new GraphApp.Control();