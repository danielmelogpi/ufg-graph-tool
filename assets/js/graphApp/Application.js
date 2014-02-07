"use strict";
/** jslint */
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global Kinetic, $ */



/** Defines the namespace for the application
* Takes care of drawning and navigation
* @param String		canvasHandler		Elemento que receberá o palco
*/
var GraphApplication = function (canvasHandler) {
	this.stage = new GraphApplication.Stage(canvasHandler);
	this.theLayer = new GraphApplication.Layer();

	this.graph = new GraphApplication.Graph();
	this.graph.parent = this;
	this.canvasHandler = document.getElementById(canvasHandler);

	this.stage.add(this.theLayer);

	this.addShape = function (shape) {
		this.theLayer.add(shape);
		this.theLayer.draw();
	};

	return this;
};



/** Defines the stage where the <canvas> element is constructed */
GraphApplication.Stage = function (canvasHandler) {
	var stage = new Kinetic.Stage({
		container: canvasHandler,
		width: window.screen.availWidth,
		height: window.screen.availHeight,
		draggable: false
	});
	return stage;
};

GraphApplication.Layer = function () {
	var layer = new Kinetic.Layer();
	return layer;
};


/** Defines the graph worked by the application. */
GraphApplication.Graph = function () {
    this.nodes = []; // Node collection
    this.edges = []; // Edges collection
    this.colors = new GraphApplication.Graph.Colors();

    this.getEdges = function () {
		return this.edges;
    };
    this.getNodes = function () {
		return this.nodes;
    };
    this.addNode = function (node) {
		if (node instanceof GraphApplication.Graph.Node) {
			this.nodes.push(node);
		}
	};
	this.createNode = function (x, y) {
		var newNode =  new GraphApplication.Graph.Node(x, y);
		newNode.parent = this;
		this.nodes.push(newNode);
		this.parent.addShape(newNode.shape);
	};

};

/** Defines a node and it's properties. 
* This object retrieves the reference to Kinetic Js Circle, 
* that is the visual node */
GraphApplication.Graph.Node = function (x, y) {
	
	this.style = new GraphApplication.Graph.Style.Node();

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

GraphApplication.Graph.Colors = function () {
	this.SELECTED_ITEM_FILL = "#c73028";
	this.SELECTED_ITEM_STROKE = "#df6861";

	this.HOVER_DEFAULT_FILL = "#7AFAF8";
	this.HOVER_DEFAULT_STROKE = "#48D4D1";

	this.LINE_DEFAULT_STROKE = "#000";
	this.CIRCLE_DEFAULT_FILL = "#000";
	this.CIRCLE_DEFAULT_STROKE = "#000";

	this.SELECTION_RECT_FILL = "transparent";
	this.SELECTION_RECT_STROKE = "#c73028";
};

GraphApplication.Graph.Style = function () {
	this.colors = new GraphApplication.Graph.Colors();
};

GraphApplication.Graph.Style.Node = function () {
	this.radius = 12;
	this.strokeWidth = 2;
	return this;
};
GraphApplication.Graph.Style.Node.prototype = new GraphApplication.Graph.Style();



$(document).ready(
	(function () {
		window.graphApp = new GraphApplication("graph-app");
		console.log(window.graphApp);
	})
);