/*! GraphApp 08-02-2014 */
"use strict";
/** jslint */
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*globa*/


/** 
* Defines the namespace for the application
* Takes care of drawning and navigation
* @param String		canvasHandler		Element that will receive the canvas stage
*/
var GraphApp = function (canvasHandler) {
	this.stage = new GraphApp.Stage(canvasHandler);
	this.theLayer = new GraphApp.Layer();

	this.graph = new GraphApp.Graph();
	this.graph.parent = this;
	this.canvasHandler = document.getElementById(canvasHandler);

	this.stage.add(this.theLayer);

	this.addShape = function (shape) {
		this.theLayer.add(shape);
		this.theLayer.draw();
	};

	return this;
};

;
;/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp*/

/* namespace GraphApp */
"use strict";

/** Defines the graph worked by the application. */
GraphApp.Graph = function () {
    this.nodes = []; // Node collection
    this.edges = []; // Edges collection
    this.colors = new GraphApp.Graph.Colors();

    this.getEdges = function () {
		return this.edges;
    };
    this.getNodes = function () {
		return this.nodes;
    };
    this.addNode = function (node) {
		if (node instanceof GraphApp.Graph.Node) {
			this.nodes.push(node);
		}
	};
	this.createNode = function (x, y) {
		var newNode =  new GraphApp.Graph.Node(x, y);
		newNode.parent = this;
		this.nodes.push(newNode);
		this.parent.addShape(newNode.shape);
	};

};
;/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  Kinetic, GraphApp */

"use strict";

GraphApp.Layer = function () {
	var layer = new Kinetic.Layer();
	return layer;
};

;"use strict";

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
;/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global Kinetic, GraphApp */
/** Defines the stage where the <canvas> element is constructed */

"use strict";
GraphApp.Stage = function (canvasHandler) {
	var stage = new Kinetic.Stage({
		container: canvasHandler,
		width: window.screen.availWidth,
		height: window.screen.availHeight,
		draggable: false
	});
	return stage;
};
;"use strict";

/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Defines a parent to all the styles. 
* A style is something that can be applied by a shape. 
* The shape decides how to use the attributes
*/
GraphApp.Graph.Style = function () {
	this.colors = new GraphApp.Graph.Colors();
};
;"use strict";

/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

GraphApp.Graph.Colors = function () {
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

;"use strict";

/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*g_lobal  GraphApp */

;"use strict";

/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Defines a default style to be used in the nodes shapes.
* A style is something that can be applied by a shape. 
* The shape decides how to use the attributes
* @prototype <GraphApp.Graph.Style>
*/
GraphApp.Graph.Style.Node = function () {
	this.radius = 12;
	this.strokeWidth = 2;
	return this;
};
GraphApp.Graph.Style.Node.prototype = new GraphApp.Graph.Style();