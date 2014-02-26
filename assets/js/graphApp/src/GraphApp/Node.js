/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global Kinetic, GraphApp */

/** Defines a node and it's properties. 
* This object retrieves the reference to Kinetic Js Circle, 
* that is the visual node */
GraphApp.Node = function (x, y) {
	"use strict";

	this.Iam = "GraphApp.Node";
	this.graph = undefined;
	this.style = new GraphApp.Graph.Style.Node();
	this.id = Math.random();
	this.selected  = false;
	this.isRemoved = false;
	this.nodesFromHere = [];
	this.nodesToHere = [];
	this.selectionMark = undefined;

	var colors = this.style.colors;
	this.shape = new Kinetic.Circle({
		x: x,
		y: y,
		radius: this.style.radius,
		fill: colors.CIRCLE_DEFAULT_FILL,
		draggable: true,
		stroke: colors.CIRCLE_DEFAULT_STROKE,
		strokeWidth: this.style.strokeWidth
	});
	this.shape.holder = this;

	this.actualLook = {
		radius: this.style.radius,
		stroke: colors.CIRCLE_DEFAULT_STROKE,
		fill: colors.CIRCLE_DEFAULT_FILL
	};
	this.backupPosition = {
		x: x,
		y: y
	};

	this.shape.on("dragstart dragmove dragend", function (e) {
		/** @TODO avoid dragging when not in navigation */
		var activeControl = this.holder.graph.app.activeControl;
		if (activeControl instanceof GraphApp.Control.Navigation) {
			var handler = new GraphApp.Handler.DragNode(e, this.holder);
			console.assert(handler.details.success);
		}
	});

	this.shape.on("click.selection", function (e) {
		var activeControl = this.holder.graph.app.activeControl;
		if (activeControl instanceof GraphApp.Control.Navigation) {
			var handler = new GraphApp.Handler.Selection(e, this.holder);
			handler.run();
		}
	});

};