"use strict";

/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global Kinetic, GraphApp */

/** Defines a node and it's properties. 
* This object retrieves the reference to Kinetic Js Circle, 
* that is the visual node */
GraphApp.Graph.Node = function (x, y) {
	
	this.style = new GraphApp.Graph.Style.Node();

	var colors = this.style.colors;
	this.shape = new Kinetic.Circle({
		x: x,
		y: y,
		radius: this.style.radius,
		fill: colors.CIRCLE_DEFAULT_FILL,
		draggable: true,
		stroke: colors.CIRCLE_DEFAULT_STROKE,
		strokeWidth: this.style.strokeWidth,
		id : Math.random(),
		selected : false,
		isRemoved: false
	});

	this.actualLook = {
		radius: this.style.radius,
		stroke: colors.CIRCLE_DEFAULT_STROKE,
		fill: colors.CIRCLE_DEFAULT_FILL
	};
	this.backupPosition = {
		x: x,
		y: y
	};

	this.shape.on("dragstart dragmove", function () {
		// activateNavigation ();
		// if(actualControl == "navigation"){
		// 	handleMovementEffect(this);
		// 	//updateMyEdges(this);
		// }
	});

//	this.shape.on("click.selectToogle", selectionHandler);
//	this.shape.selectionRect = defaultSelectionRect(circle);

//	this.shape
};