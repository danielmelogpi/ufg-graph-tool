/*! GraphApp 08-02-2014 */
/** jslint */
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global Kinetic*/


/** 
* Defines the namespace for the application
* Takes care of drawning and navigation
* @param String		canvasHandler		ID of the element that will receive the canvas stage
*/
var GraphApp = function (canvasHandler) {
	"use strict";
	
	this.Iam = "GraphApp";
	this.stage = new GraphApp.Stage(canvasHandler);
	this.nodeLayer = new GraphApp.Layer();
	this.edgeLayer = new GraphApp.Layer();
	this.selectionLayer = new GraphApp.Layer();

	this.activeControl = new GraphApp.Control.Navigation();

	this.graph = new GraphApp.Graph();
	this.graph.app = this;
	this.graph.stage = this.stage;

	this.canvasHandler = document.getElementById(canvasHandler);

	this.stage.addLayer(this.edgeLayer);
	this.stage.addLayer(this.nodeLayer);
	this.stage.addLayer(this.selectionLayer);

	/** Adds a Kinetic form to the proper layer */
	this.addShape = function (shape) {
		if (shape instanceof Kinetic.Circle) {
			this.nodeLayer.addShape(shape);
		}
		else if (shape instanceof Kinetic.Spline) {
			this.edgeLayer.addShape(shape);
		}
		else if (shape instanceof Kinetic.Rect) {
			this.selectionLayer.addShape(shape);
		}
		else {
			console.error("There is no layer configured to such shape");
			return false;
		}
		this.stage.draw();
		return true;
	};

};

;/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp*/

/* namespace GraphApp */
"use strict";

/** 
@class GraphApp.Control
Defines that represents user interaction with the application. 
*/
GraphApp.Control = function () {
	
};
;"use strict";

/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global Kinetic, GraphApp */

/** Defines an edge and it's properties.
* This object retrieves the reference to Kinetic Js Spline, 
* that is the visual node */
GraphApp.Edge = function (nodeOrigin, nodeTarget) {
	this.Iam = "GraphApp.Edge";
	this.graph = undefined;

	this.origin = nodeOrigin;
	this.target = nodeTarget;
	this.curve_modified = false;
	this.selected  = false;
	this.id = Math.random();
	this.isRemoved = false;

	nodeOrigin.nodesFromHere.push(this);
	nodeTarget.nodesToHere.push(this);

	this.style = new GraphApp.Graph.Style.Edge();
	var colors = this.style.colors;

	//no inicio o ponto de controle da curvatura é o mesmo do final
	this.points = [	nodeOrigin.shape.getX(),
					nodeOrigin.shape.getY(),
					nodeTarget.shape.getX(),
					nodeTarget.shape.getY(),
					nodeTarget.shape.getX(),
					nodeTarget.shape.getY()  ];

	//flexibleLineAnimation

	this.shape = new Kinetic.Spline({
        points: this.points,
        tension: 0.5,
        stroke: colors.LINE_DEFAULT_STROKE,
        strokeWidth: 4,		//@TODO criar objeto de configurações
        draggable: false,
		id : Math.random(),
		lineCap: this.style.lineCap,
		lineJoin: this.style.lineJoin
	});
	this.shape.holder = this;

	//this.flexible = flexibleLineAnimation(line);

	this.actualLook = {
		strokeWidth: 4,
		stroke: colors.LINE_DEFAULT_STROKE
	};


	this.updatePoints = function () {
		if (this.curve_modified) {
			var points = [this.origin.shape.getX(),
					this.origin.shape.getY(),
					this.shape.getPoints()[1].x,
					this.shape.getPoints()[1].y,
					this.target.shape.getX(),
					this.target.shape.getY()];	
		}
		else {
			var points = [this.origin.shape.getX(),
					this.origin.shape.getY(),
					this.target.shape.getX(),
					this.target.shape.getY(),
					this.target.shape.getX(),
					this.target.shape.getY()];
		}
		this.points = points;
		this.shape.setPoints(points);
	};

/*
	this.shape.on('mouseover', function(){
		//this.setStrokeWidth(12);		//@TODO criar objeto de configurações
		if(!this.selected){
			//this.setStroke(colors.HOVER_DEFAULT_STROKE);
			stage.draw();
		}
		mouseToPointer();
	});
	this.shape.on('mouseout', function(){
		if(!this.selected){
			//this.setStroke(this.actualLook.stroke);
			stage.draw();
		}
		mouseToDefault();
	});

	this.shape.on("mousedown", function(evt){
		if(evt.altKey  && evt.ctrlKey){

			mouseIsDown = true;
			blockLastMouse = false;
			this.flexible.start();	
		}
	});

	this.shape.on("mouseup", function(){
		mouseIsDown = false;
		lastMouseForCurvingLine = getMousePos();
		blockLastMouse = true;
		//this.flexible.stop();
	});
	this.shape.on( "dblclick.restore-curve", restoreCurve);

	this.shape.on("click.selectToogle", selectionHandler);

	line.selectionRect = defaultSelectionRect(line);
	return  line;
};
*/
};
;/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp*/

/* namespace GraphApp */


/** Defines the graph worked by the application. */
GraphApp.Graph = function () {
	"use strict";
	this.Iam = "GraphApp.Graph";
	this.stage = undefined;
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
		var newNode =  new GraphApp.Node(x, y);
		newNode.graph = this;
		this.nodes.push(newNode);
		this.app.addShape(newNode.shape);
		return newNode;
	};

	this.createEdge = function (nodeOrigin, nodeTarget) {
		var newEdge =  new GraphApp.Edge(nodeOrigin, nodeTarget);
		newEdge.graph = this;
		this.edges.push(newEdge);
		this.app.addShape(newEdge.shape);
		return newEdge;
	};
};
;/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Defines a parent to classes especialized with dealing with the events actions
*/
GraphApp.Handler = function (event, target) {
	"use strict";
	/** Keeps the event beeing worked */
	this.event = event;
	this.target = target;
};
;/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  Kinetic, GraphApp */



GraphApp.Layer = function () {
	"use strict";
	this.Iam = "GraphApp.Layer";
	this.kineticLayer = new Kinetic.Layer();
	
	/** add a shape to Kinetics Layer */
	this.addShape = function (shape) {
		this.kineticLayer.add(shape);
	};
};

;/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
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

	this.shape.on("dragstart dragmove dragend", function () {
		if (this.holder.graph.app.activeControl instanceof GraphApp.Control.Navigation) {
			this.holder.nodesFromHere.forEach(function (edge) {
				edge.updatePoints();
			});
			this.holder.nodesToHere.forEach(function (edge) {
				edge.updatePoints();
			});
			this.holder.graph.stage.draw();
		}
	});

	//this.shape.on("click.selectToogle", selectionHandler);
//	this.shape.selectionRect = defaultSelectionRect(circle);

//	this.shape
};
;/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global Kinetic, GraphApp */
/** Defines the stage where the <canvas> element is constructed */


GraphApp.Stage = function (canvasHandler) {
	"use strict";
	this.Iam = "GraphApp.Stage";
	this.kineticStage = new Kinetic.Stage({
		container: canvasHandler,
		width: window.screen.availWidth,
		height: window.screen.availHeight,
		draggable: false
	});

	/** Adds a layer to the Kinetics Stage */
	this.addLayer = function (layer) {
		return this.kineticStage.add(layer.kineticLayer);
	};

	/** Refreshes the stage */
	this.draw = function () {
		return this.kineticStage.draw();
	};
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
;/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp*/

/* namespace GraphApp */
"use strict";

/** 
@class GraphApp.Control.Delete
Defines a control for deletion of shapes
*/
GraphApp.Control.Delete = function () {
	
	/* name of the control */
	this.nameControl = "Delete";

	/* returns the name of the control */
	this.getName = function () {
		return this.name;
	};
};
GraphApp.Control.Delete.prototype =  new GraphApp.Control();
;/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp*/

/* namespace GraphApp */
"use strict";

/** 
@class GraphApp.Control.EdgeDraw
Defines a control for edge drawing
*/
GraphApp.Control.EdgeDraw = function () {
	
	/* name of the control */
	this.nameControl = "EdgeDraw";

	/* returns the name of the control */
	this.getName = function () {
		return this.name;
	};
};
GraphApp.Control.EdgeDraw.prototype =  new GraphApp.Control();
;/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp*/

/* namespace GraphApp */
"use strict";

/** 
@class GraphApp.Control
Defines that represents user interaction with the application. 
*/
GraphApp.Control.Navigation = function () {
	
	/* name of the control */
	this.nameControl = "Navigation";

	/* returns the name of the control */
	this.getName = function () {
		return this.name;
	};
};
GraphApp.Control.Navigation.prototype =  new GraphApp.Control();
;/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
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

	/* returns the name of the control */
	this.getName = function () {
		return this.name;
	};
};
GraphApp.Control.NodeDraw.prototype =  new GraphApp.Control();
;/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp*/

/* namespace GraphApp */
"use strict";

/** 
@class GraphApp.Control.Zoom
Defines zoom actions over the stage
*/
GraphApp.Control.Zoom = function () {
	
	/* name of the control */
	this.nameControl = "Zoom";

	/* returns the name of the control */
	this.getName = function () {
		return this.name;
	};
	
};
GraphApp.Control.Zoom.prototype =  new GraphApp.Control();
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

GraphApp.Graph.Colors.prototype = {};
;"use strict";

/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Defines a default style to be used in the edge shapes.
* A style is something that can be applied by a shape. 
* The shape decides how to use the attributes
* @prototype <GraphApp.Graph.Style>
*/
GraphApp.Graph.Style.Edge = function () {
	this.radius = 12;
	this.strokeWidth = 2;
	this.lineCap = "round";
	this.lineJoin = "round";
};
GraphApp.Graph.Style.Edge.prototype = new GraphApp.Graph.Style();
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
};
GraphApp.Graph.Style.Node.prototype = new GraphApp.Graph.Style();
;/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Deals with selecting and unselecting elements
*/
GraphApp.Handler.Selection = function () {
	"use strict";
};
GraphApp.Handler.Selection.prototype = new GraphApp.Handler(undefined);
