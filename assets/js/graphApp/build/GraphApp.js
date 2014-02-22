/*! GraphApp 22-02-2014 */
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
	this.layer = new GraphApp.Layer();
	this.nodeLayer = new GraphApp.Layer();
	this.edgeLayer = new GraphApp.Layer();
	this.selectionLayer = new GraphApp.Layer();

	this.activeControl = new GraphApp.Control.Navigation();

	this.graph = new GraphApp.Graph();
	this.graph.app = this;
	this.graph.stage = this.stage;

	this.canvasHandler = document.getElementById(canvasHandler);
	
	/** is it possible to use 3 layers to preserve z-index without loosing click
	propagation ?  */
	this.stage.addLayer(this.layer);
	//this.stage.addLayer(this.edgeLayer);
	//this.stage.addLayer(this.nodeLayer);
	//this.stage.addLayer(this.selectionLayer);

	/** Adds a Kinetic form to the proper layer */
	this.addShape = function (shape) {
		if (shape instanceof Kinetic.Circle) {
			this.layer.addShape(shape);
		}
		else if (shape instanceof Kinetic.Spline) {
			this.layer.addShape(shape);
		}
		else if (shape instanceof Kinetic.Rect) {
			this.layer.addShape(shape);
		}
		else {
			console.error("There is no layer configured to such shape");
			return false;
		}
		this.stage.draw();
		return true;
	};

	/** changes the application control to other one */
	this.changeControlTo = function (control) {
		if (control instanceof GraphApp.Control) {
			this.activeControl.disable();
			this.activeControl = control;
			control.app = this;
			control.enable();
			return true;
		}
		return false;
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
	
	this.enable = function () {
		console.error("Enable method not implemented!");
	};
	this.disable = function () {
		console.error("Disable method not implemented!");
	};
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

	this.shape.on("mousedown.dragedge", function (event) {
		var activeControl = this.holder.graph.app.activeControl;
		
		if (!(activeControl instanceof GraphApp.Control.Navigation)) {
			return;	//this shall not continue if we are not navigating
		}
		var handler = new GraphApp.Handler.DragEdge(event, this.holder);
		handler.run();
		console.assert(handler.details.success);
	});

	this.shape.on("dblclick.restorecurve",  function (event) {
		var activeControl = this.holder.graph.app.activeControl;
		if (!(activeControl instanceof GraphApp.Control.Navigation)) {
			return;	//this shall not continue if we are not navigating
		}
		var handler = new GraphApp.Handler.DblClickEdge(event, this.holder);
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
		/** @TODO avoid dragging when not in navigation */
		var activeControl = this.holder.graph.app.activeControl;
		if (activeControl instanceof GraphApp.Control.Navigation) {
			var handler = new GraphApp.Handler.DragNode(e, this.holder);
			console.assert(handler.details.success);
		}
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
	this.layers = [];

	/** Adds a layer to the Kinetics Stage */
	this.addLayer = function (layer) {
		this.layers.push(layer);
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

	this.enable = function () {
	};

	this.disable = function () {
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
/*global  GraphApp,Kinetic */

/**
* Deals with dblclicking an edge when navigating. 
* @param <GraphApp.Edge>   target     who was dragged
* @param <Object> event    the dragging event
* @return void
*/
GraphApp.Handler.DblClickEdge = function (event, target) {
	"use strict";
	this.event = event;
	this.target = target;

	/** 
	* Executes an animation that restores the control point of the edge to
	* the original position
	*/
	this.restoreCurve = function () {
		console.debug("restoring edge");
		var handler = this;
		var animation = new Kinetic.Animation(function () {
			//console.debug("animation");
			target.curveModified = false; //curve is no longer modified
			
			var edgeOrigin = handler.target.origin;
			var edgeTarget = handler.target.target;
			var points = [];
			points[0] = edgeOrigin.shape.getX();
			points[1] = edgeOrigin.shape.getY();
			points[2] = edgeTarget.shape.getX(); //control point matches the end
			points[3] = edgeTarget.shape.getY();
			points[4] = edgeTarget.shape.getX();
			points[5] = edgeTarget.shape.getY();
			
			handler.target.shape.setPoints(points);
			handler.target.graph.stage.draw();
			//handler.stop();
		},
		this.target.graph.stage);
		animation.start();

	};

	/** Stops the curving animation execution */
	this.stop = function (event) {
		//console.debug("stopping");
	};

	/** Sets a function that executes the animation */
	this.run = function () {
		//console.debug("running");
		this.restoreCurve();
	};
	
	this.details.success = true;

}; //end of object
GraphApp.Handler.DblClickEdge.prototype = new GraphApp.Handler(undefined);
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp, $,Kinetic */

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
	console.debug("drag edge");

	/** Executes a animation  that curves the line until the control point
	* reaches the mouse position 
	* A closure is used to preserve this object betwen the executions of the interval
	* @param handler   this exact instance of the object for when the setInterval is 
	* setted up
	*/
	this.curveToMousePosition = function (handler) {
		/** CODIGO PERIGOSO */
		var animation = new Kinetic.Animation(function () {
			var mouseInput = new GraphApp.Input.Mouse(handler.target.graph.stage, handler.event);
			var mousePosition = mouseInput.getMousePosition();

			/** @TODO é necessário fazer o calculo de animação. 
			Como ele é demorado para alinhar, vou fazer depois */
			target.curveModified = true;
			var edgeOrigin = handler.target.origin;
			var edgeTarget = handler.target.target;
			var points = [];
			points[0] = edgeOrigin.shape.getX();
			points[1] = edgeOrigin.shape.getY();
			points[2] = mousePosition.x;
			points[3] = mousePosition.y;
			points[4] = edgeTarget.shape.getX();
			points[5] = edgeTarget.shape.getY();
			handler.target.shape.setPoints(points);
			handler.target.graph.stage.draw();
			this.stop();
		},
		handler.target.graph.stage);
		animation.start();

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
		console.log("running");
		var curveMousePosition = this.curveToMousePosition;
		var thisHandler = this;
		this.interval = setInterval(function () {
			curveMousePosition(thisHandler);
		}, 10);
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

	/** @TODO   provavelmente isso aqui pode ser otimizado para o firefox . 
	Sem isso fica mais fluido o movimento de drag
	*/
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

	/** For some reason, I can only take mouse positions 
	until this point. Weird . I decided to take everything I need them..*/
	this.stagePointerPosition = stage.kineticStage.getPointerPosition();
	this.stagePosition = stage.kineticStage.getPosition();
	this.stageScale = this.stage.kineticStage.getScale();
  
	//isso não funciona esse escopo.. o objeto do mouse tem problemas
	this.getMousePosition = function () {
		var mouse = {
				success: false,
				x: 0,
				y: 0
			};

		try {
			var stageState = {
				pointerX: this.stagePointerPosition.x,
				pointerY: this.stagePointerPosition.y,
				positionX: this.stagePosition.x,
				positionY: this.stagePosition.y,
				scaleX: this.stageScale.x,
				scaleY: this.stageScale.y
			};

			mouse =  {
				x: (stageState.pointerX - stageState.positionX) / stageState.scaleX,
				y: (stageState.pointerY - stageState.positionY) / stageState.scaleY,
				success: true
			};
			return mouse;
		}
		catch (e) {
			console.debug("O mouse não pode ser capturado");
			console.error(e);
			return mouse;
		}
	};
};
GraphApp.Input.Mouse.prototype = new GraphApp.Input();