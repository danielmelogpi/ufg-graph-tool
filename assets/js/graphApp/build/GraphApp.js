/*! GraphApp 13-02-2014 */
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
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp*/

/* namespace GraphApp */
"use strict";

/** 
@class GraphApp.Control
Defines that represents user interaction with the application. 
*/
GraphApp.Control = function () {
	
};"use strict";

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
	this.curveModified = false;
	this.selected  = false;
	this.id = Math.random();
	this.isRemoved = false;
	this.curving = false;

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

	/** Isso pode ser abstraido para um objeto? precisa? */
	this.updatePoints = function () {
		if (this.curveModified) {
			this.points = [this.origin.shape.getX(),
					this.origin.shape.getY(),
					this.shape.getPoints()[1].x,
					this.shape.getPoints()[1].y,
					this.target.shape.getX(),
					this.target.shape.getY()];
		}
		else {
			this.points = [this.origin.shape.getX(),
					this.origin.shape.getY(),
					this.target.shape.getX(),
					this.target.shape.getY(),
					this.target.shape.getX(),
					this.target.shape.getY()];
		}
		this.shape.setPoints(this.points);
	};

	this.shape.on("mousedown", function (event) {
		var handler = new GraphApp.Handler.DragEdge(event, this.holder);
		handler.run();
		console.assert(handler.details.success);
	});

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
*/
	/*this.shape.on("mousedown", function(evt){
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
//};
/**/
};/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
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
};/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Defines a parent to classes especialized with dealing with the events actions
*/
GraphApp.Handler = function (event, target) {
	"use strict";
	/** Keeps the event beeing worked */
	this.event = event;
	this.target = target;
	this.details = {};
};/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp */

/** Describe some kind of input from the user, like mouse or keyboard */
GraphApp.Input = function () {
	"use strict";
	this.stage = undefined;
};/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
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
		var handler = new GraphApp.Handler.DragNode(e, this.holder);
		console.assert(handler.details.success);
	});

};/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
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
};"use strict";

/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Defines a parent to all the styles. 
* A style is something that can be applied by a shape. 
* The shape decides how to use the attributes
*/
GraphApp.Graph.Style = function () {
	this.colors = new GraphApp.Graph.Colors();
}; /*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
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
GraphApp.Control.Delete.prototype =  new GraphApp.Control();/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
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
GraphApp.Control.EdgeDraw.prototype =  new GraphApp.Control();/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
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
GraphApp.Control.Navigation.prototype =  new GraphApp.Control();/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
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
GraphApp.Control.NodeDraw.prototype =  new GraphApp.Control();/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
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
GraphApp.Control.Zoom.prototype =  new GraphApp.Control();"use strict";

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

GraphApp.Graph.Colors.prototype = {};"use strict";

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
GraphApp.Graph.Style.Edge.prototype = new GraphApp.Graph.Style();"use strict";

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
GraphApp.Graph.Style.Node.prototype = new GraphApp.Graph.Style();/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
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
			var edgeOrigin = handler.target.origin;
			var edgeTarget = handler.target.target
			var points = [];
			points[0] = edgeOrigin.shape.getX();
			points[1] = edgeOrigin.shape.getY();
			points[2] = mousePosition.x;
			points[3] = mousePosition.y;
			points[4] = edgeTarget.shape.getY();
			points[5] = edgeTarget.shape.getY();

			handler.target.shape.setPoints([10, 20, 12, 22, 14, 20]);
			handler.target.graph.stage.draw();	
			this.stop();
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
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Deals with dragging a node. 
* @param <GraphApp.Node> target     who was dragged
* @param <Object> event    the dragging event
* @return void
*/
GraphApp.Handler.DragNode = function (event, target) {
	"use strict";
	this.event = event;
	this.target = target;
	this.details = {};

	if (!(target instanceof GraphApp.Node)) {
		this.details.success = false;
		this.details.message = "O tipo de objeto alvo não é o aceito por este handler.";
		console.error(this.details);
	}

	/** @TODO   provavelmente isso aqui pode ser otimizado para o firefox */
	if (this.target.graph.app.activeControl instanceof GraphApp.Control.Navigation) {
		this.target.nodesFromHere.forEach(function (edge) {
			edge.updatePoints();
		});
		this.target.nodesToHere.forEach(function (edge) {
			edge.updatePoints();
		});
		this.target.graph.stage.draw();
	}

	this.details.success = true;

}; //end of object
GraphApp.Handler.DragNode.prototype = new GraphApp.Handler(undefined);
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Deals with selecting and unselecting elements
*/
GraphApp.Handler.Selection = function (event, target) {
	"use strict";
	

};
GraphApp.Handler.Selection.prototype = new GraphApp.Handler();
 /*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp */

/** Behaviors related to the mouse (cursor), como posicionamento e estado */
GraphApp.Input.Mouse = function (stage) {
	"use strict";
	this.stage = stage;
  
	//isso não funciona esse escopo.. o objeto do mouse tem problemas
	this.getMousePosition = function () {
		var mouse = {
				success: false,
				x: 0,
				y: 0
			};

		try {
			var stageState = {
				pointerX: this.stage.kineticStage.getPointerPosition().x,
				pointerY: this.stage.kineticStage.getPointerPosition().y,
				positionX: this.stage.kineticStage.getPosition().x,
				positionY: this.stage.kineticStage.getPosition().y,
				scaleX: this.stage.kineticStage.getScaleX(),
				scaleY: this.stage.kineticStage.getScaleY()
			};

			mouse =  {
				x: (stageState.pointerX - stage.positionX) / stageState.scaleX,
				y: (stageState.pointerY - stage.positionY) / stageState.scaleY,
				success: true
			};
			return mouse;
		}
		catch (e) {
			console.debug("O mouse não pode ser capturado");
			return mouse;
		}
	};
};
GraphApp.Input.Mouse.prototype = new GraphApp.Input();