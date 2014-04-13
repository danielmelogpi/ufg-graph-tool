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
	this.graph = new GraphApp.Graph();
	this.layer = new GraphApp.Layer();
	this.nodeLayer = new GraphApp.Layer();
	this.edgeLayer = new GraphApp.Layer();
	this.selectionLayer = new GraphApp.Layer();
	this.activeControl = new GraphApp.Control.Navigation();
	this.panels = {};

	/*flags to deal with event-data-bubling problems (like clicking in the canvas
	*	and not beeing able to stopPropagation in still in the node/edge ).
	* shame on me
	*/
	this.events = {
		"featureClicked" : false
	};

	
	this.graph.app = this;
	this.graph.stage = this.stage;

	this.stage.app = this;
		

	this.canvasHandler = document.getElementById(canvasHandler);
	
	/** is it possible to use 3 layers to preserve z-index without loosing click
	propagation ?  */
	this.stage.addLayer(this.layer);
	this.stage.addEventsToCanvas();
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
		else if (shape instanceof Kinetic.Line) {
			this.layer.addShape(shape);
		}
		else {
			console.warn("There is no layer configured to such shape.");
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
};
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global Kinetic, GraphApp */

/** Defines an edge and it's properties.
* This object retrieves the reference to Kinetic Js Spline, 
* that is the visual node */
GraphApp.Edge = function (nodeOrigin, nodeTarget) {
	"use strict";
	this.Iam = "GraphApp.Edge";
	this.graph = undefined;

	this.origin = nodeOrigin;
	this.target = nodeTarget;
	this.curveModified = false;
	this.selected  = false;
	this.id = Math.random();
	this.isRemoved = false;
	this.curving = false;
	this.selectionMark = undefined;

	nodeOrigin.edgesFromHere.push(this);
	nodeTarget.edgesToHere.push(this);

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
		console.log(handler);
		console.assert(handler.details.success);
	});

	this.shape.on("click.selection", function (e) {
		var activeControl = this.holder.graph.app.activeControl;
		if (activeControl instanceof GraphApp.Control.Navigation) {
			var handler = new GraphApp.Handler.Selection(e, this.holder);
			handler.run();
		}
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

};
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
		var style = new GraphApp.Graph.Style.FollowLine();
		
		followLine.shape = new Kinetic.Line({
			points: [x, y, x, y],
			stroke: style.stroke,
			strokeWidth: style.strokeWidth,
			lineCap: style.lineCap,
			lineJoin: style.lineJoin
		});

		followLine.shape.holder = followLine;
		followLine.graph.app.addShape(followLine.shape);
	}
	)(this);

	// atualiza a follow line para a posição atual do mouse
	this.updateToMouse = function (evt) {
		var followLine = evt.data[0];
		var mouse = new GraphApp.Input.Mouse(followLine.graph.app.stage);
		var mousePosition = mouse.getMousePosition();
		followLine.lastDetectedMouse = mousePosition;
		
		var points = followLine.shape.getPoints();
		
		/** @TODO the diference in position relatively to the mouse needs improvement */
		var x = mousePosition.x - 5;
		var y = mousePosition.y + 5;

		points[1] = {x: x, y: y};

		followLine.shape.setPoints(points);
		// followLine.graph.app.stage.draw();   // o efeito de luz no nodo já tem um draw
	};

	this.startUpdate = function () {
		$(this.graph.app.canvasHandler).children().on("mousemove.updatefollowline", [this], this.updateToMouse);
	};

	this.stopUpdate = function () {
		$(this.graph.app.canvasHandler).children().off("mousemove.updatefollowline");
		this.shape.remove();
		this.graph.stage.draw();
	};
};
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp, $ */

/**
* Deals with presenting a panel on the screen.
* FormPanels are ways for the user to interact with the application
* They have events binded to their elements that trigger an updateState function
* that can execute some sort of modification in the application
*/

GraphApp.FormPanel = function (elements, formPanelContainer, toogleButton) {
	"use strict";

	this.elements = elements;
	this.layoutDescriptor = undefined;
	this.parentElement = formPanelContainer;
	this.holderClass = "input-group input-group-sm";
	this.toogleButton = toogleButton;
	this.app = undefined;
	
	this.events = {
		afterDraw : function () {

			/*$(".color-chooser").colorPicker({
				onSelect: function (ui, color) {
					this.val(color);
					this.ui = ui;
				}
			});
			*/

		}
	};

	this.init = function () {
		//starts the panel things
		this.app = this.elements[0].graph.app;
		this.createDescriptor();
		this.drawPanel();
		
	};
	
	this.drawPanel = function () {
		this.clearPanel();
		//draws the description in the layout descriptor
		var descriptor = this.layoutDescriptor;
		var parentElement = $(this.parentElement);
		parentElement.html("");

		//for each item in the descriptor, creates a label and the form element
		for (var k in descriptor) {
			var holder = $("<div class='" + this.holderClass + "'>");
			parentElement.append(holder);

			var item = descriptor[k];
			var legend = $("<span class='input-group-addon'>" + item.label + "</span>");
			holder.append(legend);

			var formElement = $("<" + descriptor[k].element + ">");

			if (typeof item.attr !== "undefined") {
				//gives to the form element its attributes and appends it
				for (var i in item.attr) {
					formElement.attr(i, item.attr[i]);
				}
			}
			
			if (typeof item.events !== "undefined") {
				//binds the events
				for (var j in item.events) {
					formElement.on(j, item.events[j]);
				}
			}
			formElement[0].panel = this;
			holder.append(formElement);

		}

		this.app.panels.stylePanel = this;
		$(this.toogleButton).removeClass("invisible");
		$(this.toogleButton).click();
		this.events.afterDraw.call(null);


	};

	this.clearPanel = function () {
		$(this.parentElement).html("");
	};

	this.destroy = function () {
		delete this.app.panels.stylePanel;
		$(this.toogleButton).addClass("invisible");
		$(this.toogleButton).siblings()[0].click();
		$(this.parentElement).html("");

	};

	this.on = function (eventName, fn) {
		this.events[eventName] = fn;
	};

	this.off = function (eventName) {
		this.events[eventName] = function () {};
	};


};
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
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

	// given a position, creates a node there
	this.createNode = function (x, y) {
		var newNode =  new GraphApp.Node(x, y);
		newNode.graph = this;
		newNode.selectionMark = (new GraphApp.SelectedMark(newNode)).enableMark();
		this.nodes.push(newNode);
		this.app.addShape(newNode.shape);
		
		return newNode;
	};

	// creates an edge, given an <GraphApp.Node> as origin and target
	this.createEdge = function (nodeOrigin, nodeTarget) {
		var newEdge =  new GraphApp.Edge(nodeOrigin, nodeTarget);
		newEdge.graph = this;
		newEdge.selectionMark = (new GraphApp.SelectedMark(newEdge)).enableMark();
		this.edges.push(newEdge);
		this.app.addShape(newEdge.shape);
		return newEdge;
	};

};
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
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

	this.hasShift = function () {
		return this.event.shiftKey;
	};

	this.hasCtrl = function () {
		return this.event.ctrlKey;
	};

	this.hasAlt = function () {
		return this.event.altKey;
	};

};
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp */

/** Describe some kind of input from the user, like mouse or keyboard */
GraphApp.Input = function () {
	"use strict";
	this.stage = undefined;
};
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
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
	this.edgesFromHere = [];
	this.edgesToHere = [];
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
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global Kinetic, GraphApp */

/** Defines some kind of hightlight that shows that 
* something is selected on the graph stage
* that is the visual node 
* @param <GraphApp.Node> | <GraphApp.Edge> anchor	The element that is marked
*/
GraphApp.SelectedMark = function (anchor) {
	"use strict";
	this.Iam = "GraphApp.SelectedMark";
	this.anchor = anchor;
	this.shape = undefined;
	this.ascendent = "asc";
	this.descendent = "desc";
	//this.shape = new Kinetic.Rect;

	/** triggers the shapes genesis */
	this.enableMark = function () {
		var config = this.calculateConfig();
		this.createMarkShape(config);
		return this;
	};

	this.updateMarkConfig = function () {
		var config = this.calculateConfig();
		this.shape.setX(config.x);
		this.shape.setY(config.y);
		this.shape.setWidth(config.width);
		this.shape.setHeight(config.height);
	}

	/** Calcutes x, y, width and height for the selection mark (a Kinetic.Rect) *
	* @return {} object with parameters for the mark
	*/
	this.calculateConfig = function () {
		var padding = 4;
		
		var config = {};

		if (this.anchor instanceof GraphApp.Node) {
			//calculate based on circle nature
			var shapeX = this.anchor.shape.getX();
			var shapeY = this.anchor.shape.getY();
			var shapeWidth = this.anchor.shape.getWidth();
			var shapeHeight = this.anchor.shape.getHeight();

			config.x = shapeX - (shapeWidth / 2) - padding;
			config.y = shapeY - (shapeHeight / 2) - padding;
			config.width = shapeWidth + padding * 2;
			config.height = shapeHeight + padding * 2;

			return config;
		}
		else if (this.anchor instanceof GraphApp.Edge) {
			//calculate based on line nature
			var coord1 = this.smallerXPointSpline();
			var coord2 = this.greaterXPointSpline();

			config.width = Math.abs(coord2.getX() - coord1.getX()) + padding * 2;
			config.height =  Math.abs(coord2.getY() - coord1.getY()) + padding * 2;

			if (this.getSplineDirection(coord1, coord2) == this.ascendent) {
				config.x = coord1.getX() - padding;
				config.y = coord1.getY() - config.height - padding;
			}
			else {
				config.x = coord1.getX() - padding;
				config.y = coord1.getY() - padding;
			}

			return config;

		}
		else {
			return false;
		}

	};

	this.toogle = function () {
		this.shape.toogle(); //this toogle is not a Kinetic native. 
	};

	// Esses dois métodos poderiam ser unificados
	/** Determina se a origem ou o destino a linha tem maior valor de X */
	this.greaterXPointSpline = function () {
		var origin = this.anchor.origin.shape;
		var target = this.anchor.target.shape;

		if (origin.getX() > target.getX()) {
			return this.anchor.origin.shape;
		}
		else {
			return this.anchor.target.shape;
		}
	};

	/** Determina se a origem ou o destino a linha tem menor valor de X */
	this.smallerXPointSpline = function () {

		var origin = this.anchor.origin.shape;
		var target = this.anchor.target.shape;

		if (origin.getX() < target.getX()) {
			return this.anchor.origin.shape;
		}
		else {
			return this.anchor.target.shape;
		}

	};

	/** Retorna a direção da linha (ascendente ou descendente), imaginando
	* o palco como um plano cartesiano e a linha como uma reta de uma função de 
	* primeiro grau 
	* @param <Kinetic.Circle> a shape com menor X (seja origem ou destino da linha)
	* @param <Kinetic.Circle> a shape com maior X (seja origem ou destino da linha)
	* @return String    asc para ascendente ou desc para descendente
	*/
	this.getSplineDirection = function (smaller, greater) {
		if (smaller.getY() < greater.getY()) {
			return this.descendent;
		}
		return this.ascendent;
	};

	/**
	Creates the form that is a mark selection
	*/
	// @TODO correct style properly
	this.createMarkShape = function (config) {
		this.shape = new Kinetic.Rect({
			x: config.x,
			y: config.y,
			width: config.width,
			height: config.height,
			//fill: colors.SELECTION_RECT_FILL,
			//stroke: colors.SELECTION_RECT_STROKE,
			strokeWidth: 1,
			visible: false,
			dashArray: [3, 5]
		});

		this.shape.holder = this;
		this.anchor.graph.app.stage.addSelectionMark(this.shape);
		this.shape.toogle = this.toogleToShape();
	};

	/** returns a function that toogles the visibility of the mark */
	this.toogleToShape = function () {
		return function () {
			if (this.getVisible()) {
				this.hide();
				console.debug("hide selection");
			}
			else {
				this.show();
				console.debug("show selection");
			}
			this.getStage().draw();
		};
	};



};
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global Kinetic, GraphApp, $ */
/** Defines the stage where the <canvas> element is constructed */


GraphApp.Stage = function (canvasHandler) {
	"use strict";
	this.Iam = "GraphApp.Stage";
	this.canvasHandler = canvasHandler;
	this.kineticStage = new Kinetic.Stage({
		container: canvasHandler,
		width: window.screen.availWidth,
		height: window.screen.availHeight,
		draggable: false
	});
	this.layers = [];
	this.selectionMarks = [];
	this.zoomConfig = {
		max: 3,
		min: 0.2
	};

	/** Adds a layer to the Kinetics Stage */
	this.addLayer = function (layer) {
		this.layers.push(layer);
		return this.kineticStage.add(layer.kineticLayer);
	};

	/** Refreshes the stage */
	this.draw = function () {
		return this.kineticStage.draw();
	};

	// @TODO fork the layers
	this.addSelectionMark = function (shape) {
		this.app.addShape(shape);
		this.selectionMarks.push(shape.holder);
	};

	this.addEventsToCanvas = function () {
		var app = this.app;
		$(this.kineticStage.content).children().on("click.unselectEverything", function (event) {
			var handler = new GraphApp.Handler.StageClick(event, this); //this ?
			handler.setApp(app);
			handler.run();
		});
	};

	this.changeScaleTo = function (change) {
		var scale = this.kineticStage.getScale().x;
		var newScale = scale + change;
		
		if (newScale >= this.zoomConfig.min && newScale <= this.zoomConfig.max) {
			this.kineticStage.setScale(scale + newScale);
			this.draw();
		}


	};

	
};
"use strict";

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
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp*/

/* namespace GraphApp */


/** 
@class GraphApp.Control.Delete
Defines a control for deletion of shapes
*/
GraphApp.Control.Delete = function () {
	"use strict";
	/* name of the control */
	/* name of the control */
	this.nameControl = "Delete";
	this.Iam = "GraphApp.Control.Delete";
	this.app = null;

	/* returns the name of the control */
	this.getName = function () {
		return this.name;
	};

	this.enable = function () {
		this.app.graph.nodes.forEach(this.deleteNode);
		this.app.graph.edges.forEach(this.deleteEdge);
	};

	this.deleteNode = function (node) {
		node.shape.on("click.remove", function (e) {
			//recover reference for this node in the graph node array
			
			var holder = e.targetNode.holder;
			var graph = holder.graph;
			var shape = holder.shape;
			var nodeArray = holder.graph.nodes;
			var pos = nodeArray.indexOf(holder);

			nodeArray.splice(pos, 1);

			holder.edgesFromHere.forEach(function (edge) {
				//delete the references 
				var edgePos = graph.edges.indexOf(edge);
				graph.edges.splice(edgePos, 1);
				edge.shape.destroy();

				//remove this edge from the other end vertex
				var target = edge.target;
				var tPos = target.edgesToHere.indexOf(edge);
				target.edgesToHere.splice(tPos, 1);

			});

			holder.edgesToHere.forEach(function (edge) {
				//delete the references
				var edgePos = graph.edges.indexOf(edge);
				graph.edges.splice(edgePos, 1);
				edge.shape.destroy();

				//remove this edge from the other end vertex
				var origin = edge.origin;
				var tOrigin = origin.edgesFromHere.indexOf(edge);
				origin.edgesFromHere.splice(tOrigin, 1);
			});

			shape.destroy();
			graph.app.stage.draw();
		});
	};

	this.deleteEdge = function (edge) {
		edge.shape.on("click.remove", function (e) {
			var holder = e.targetNode.holder;
			var graph = holder.graph;
			var shape = holder.shape;
			var edgeArray = holder.graph.edges;
			var pos = edgeArray.indexOf(holder);

			edgeArray.splice(pos, 1);

			//delete reference from origin node
			var oPos = holder.origin.edgesFromHere.indexOf(holder);
			holder.origin.edgesFromHere.splice(oPos, 1);

			var tPos = holder.origin.edgesToHere.indexOf(holder);
			holder.origin.edgesFromHere.splice(tPos, 1);

			//remove references from GraphApp
			var gPos = graph.edges.indexOf(holder);
			graph.edges.splice(gPos, 1);

			shape.destroy();
		});
	};

	this.disable = function () {
		this.app.graph.nodes.forEach(this.removeEvent);
		this.app.graph.edges.forEach(this.removeEvent);
	};

	this.removeEvent = function (element) {
		element.shape.off("click.remove");
	};

};
GraphApp.Control.Delete.prototype =  new GraphApp.Control();
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp, Kinetic*/

/* namespace GraphApp */


/** 
@class GraphApp.Control.EdgeDraw
Defines a control for edge drawing
*/
GraphApp.Control.EdgeDraw = function () {
	"use strict";
	/* name of the control */
	this.Iam = "GraphApp.Control.EdgeDraw";
	this.nameControl = "EdgeDraw";
	this.app = undefined;
	this.operationNodes = [];
	this.followLine = undefined;
	this.lightEffect = undefined;
	this.lightEffectConf = {
		color: "#f00",
		resetBlur: 1,
		increaseBlurUnit: 1.2,
		blurLimit: 40
	};

	/* returns the name of the control */
	this.getName = function () {
		return this.name;
	};

	this.enable = function () {
		var control = this;
		this.app.graph.nodes.forEach(function (node) {
			node.shape.on("click.edgedraw", control.addToOperation);
			node.shape.setDraggable(false);
		});
	};

	this.addToOperation = function (evt) {
		var node = evt.targetNode;
		var control = node.holder.graph.app.activeControl;
		if (control.operationNodes.length === 0) {
			control.operationNodes.push(node.holder);
			control.followLine = new GraphApp.FollowLine(node.holder);
			control.followLine.startUpdate();
			control.initLightEffect();
		}
		else if (control.operationNodes.length === 1) {
			control.destroyLightEffect();
			control.operationNodes.push(node.holder);
			control.createEdge();
			control.operationNodes.length = 0;
			control.followLine.stopUpdate();
			control.followLine = undefined;
		}
		else { //in case of caos
			control.destroyLightEffect();
			control.operationNodes.length = 0;
			control.followLine.stopUpdate();
			control.followLine = undefined;
		}
	};

	this.initLightEffect = function () {
		var control = this;
		this.lightEffect = new Kinetic.Animation(function (/*frame*/) {
			
			var blur = control.operationNodes[0].shape.getShadowBlur();
			var conf = control.lightEffectConf;
			var newBlur = (blur !== undefined && blur < conf.blurLimit) ? blur + conf.increaseBlurUnit : conf.resetBlur;

			control.operationNodes[0].shape.setShadowColor(conf.color);
			control.operationNodes[0].shape.setShadowBlur(newBlur);
			control.operationNodes[0].graph.stage.draw();
			
		});

		this.lightEffect.start();
	};

	this.destroyLightEffect = function () {
		this.lightEffect.stop();
		this.operationNodes[0].shape.setShadowBlur(0);
	};

	this.createEdge = function () {
		console.assert(this.operationNodes.length === 2);
		this.app.graph.createEdge(this.operationNodes[0], this.operationNodes[1]);
	};


	this.disable = function () {
		var control = this;
		this.app.graph.nodes.forEach(function (node) {
			node.shape.off("click.edgedraw", control.addToOperation);
		});
	};
};
GraphApp.Control.EdgeDraw.prototype =  new GraphApp.Control();
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
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
		this.app.graph.nodes.forEach(function (node) {
			node.shape.setDraggable(true);
		});
	};

	this.disable = function () {
	};
};
GraphApp.Control.Navigation.prototype =  new GraphApp.Control();
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
		this.app.graph.nodes.forEach(function (node) {
			node.shape.setDraggable(false);
		});
	};

	this.disable = function () {
		$(this.app.canvasHandler).children().off("click.nodedraw");
	};

	this.createNode = function (event) {
		console.log("createNode");
		var control = event.data[0];
		var mouse = new GraphApp.Input.Mouse(control.app.stage);
		var mousePosition = mouse.getMousePosition();

		/** @TODO    Corrigir problemas quando o scale não é 1 */
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
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
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

	this.enable = function (app, factor) {
		
	};

	this.disable = function () {
	};
	
};
GraphApp.Control.Zoom.prototype =  new GraphApp.Control();
"use strict";

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
"use strict";

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
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Defines a default style to be used in the followLines.
* A style is something that can be applied by a shape. 
* The shape decides how to use the attributes
* @prototype <GraphApp.Graph.Style>
*/
GraphApp.Graph.Style.FollowLine = function () {
	"use strict";
	this.stroke = "red";
	this.strokeWidth = 2;
	this.lineCap = "round";
	this.lineJoin = "round";
};
GraphApp.Graph.Style.Edge.prototype = new GraphApp.Graph.Style();
"use strict";

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
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
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

	/** Executes a animation  that curves the line until the control point
	* reaches the mouse position 
	* A closure is used to preserve this object betwen the executions of the interval
	* @param handler   this exact instance of the object for when the setInterval is 
	* setted up
	*/
	this.curveToMousePosition = function (handler) {
		var mousePosition;
		try {
			var mouseInput = new GraphApp.Input.Mouse(handler.target.graph.stage, handler.event);
			mousePosition = mouseInput.getMousePosition();
		}
		catch (e) {
			console.debug(mousePosition);
		}

		if (!mousePosition.success) {
			return;
		}

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
	};

	/** Stops the curving animation execution */
	this.stop = function (event) {
		//event.data[0] is sent in mouseup.dragEdge event, attached to window
		if (event.data[0]) {
			clearInterval(event.data[0]);
			$(window).off("mouseup.dragEdge");
		}
	};

	/** Sets a function that executes the animation */
	this.run = function () {
		if (!this.hasCtrl()) {
			console.debug("to curve, use CTRL");
			return;
		}
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
		this.target.edgesFromHere.forEach(function (edge) {
			edge.updatePoints();
			edge.selectionMark.updateMarkConfig();
		});
		this.target.edgesToHere.forEach(function (edge) {
			edge.updatePoints();
			edge.selectionMark.updateMarkConfig();
		});
		this.target.selectionMark.updateMarkConfig();
		this.target.graph.stage.draw();
	}

	this.details.success = true;


}; //end of object
GraphApp.Handler.DragNode.prototype = new GraphApp.Handler(undefined);

/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Deals with selecting and unselecting elements
* @param <Object> event    the dragging event
* @param <GraphApp.Node> | <GraphApp.Edge>  target     who was clicked
* @return void
*/
GraphApp.Handler.Selection = function (event, target) {
	"use strict";
	this.event = event;
	this.target = target;
	this.details = {};

	this.run = function () {
		
		if (this.hasShift()) {
			this.target.selectionMark.toogle();
			this.showPanel();
		}
		else {
			if (this.event.targetNode.holder.id === this.target.id) {
				this.unselectEverythingButMe();
				this.showPanel();
			}
			else {
				this.unselectEverything();
			}
		}
		
		this.target.graph.stage.draw(); //tudo terminado, desenhamos novamente
		this.target.graph.app.events.featureClicked = true;
	};

	this.showPanel = function () {
		var list, PanelClass;
		if (this.target instanceof GraphApp.Node) {
			list = this.target.graph.nodes;
			PanelClass = GraphApp.FormPanel.NodeStyle;
		}
		else {
			list = this.target.graph.edges;
			PanelClass = GraphApp.FormPanel.EdgeStyle;
		}


		var selectedItems = list.filter(function (e) {
			return e.selectionMark.shape.isVisible();
		});

		var panel = new PanelClass(selectedItems, "#panel-attributes .list-group-item", "#toogle-attributes");
		panel.init();
	};

	this.unselectEverything = function () {
		this.target.graph.stage.selectionMarks.forEach(function (mark) {
			mark.shape.hide();
		});
		this.target.graph.panels.stylePanel.destroy();
	};

	this.unselectEverythingButMe = function () {
		var remainingElement;
		this.target.graph.stage.selectionMarks.forEach(function (mark) {
			if (mark.anchor.id !== this.target.id) {
				mark.shape.hide();
				remainingElement = mark.shape.holder;
			}
			else {
				mark.shape.show();
			}
		}, this);


	};


};

GraphApp.Handler.Selection.prototype = new GraphApp.Handler();
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Deals with clicks given in the stage. Do this work if I split the canvas?
* @param <Object> event    the click Event
* @param <GraphApp.Stage> the stage
* @return void
*/
GraphApp.Handler.StageClick = function (event, target) {
	"use strict";
	this.Iam = "GraphApp.Handler.StageClick";
	this.event = event;
	this.target = target;
	this.details = {};
	this.app = undefined;

	this.run = function () {
		if (!this.app.events.featureClicked) {
			this.unselectEverything();
		}
		this.app.events.featureClicked = false;
	};

	this.setApp = function (app) {
		this.app = app;
	};

	// unselects all the features if you click an empty area
	this.unselectEverything = function () {
		
		this.app.graph.edges.forEach(function (el) { //unselects edges
			el.selectionMark.shape.setVisible(false);
		});

		this.app.graph.nodes.forEach(function (el) { //unselects nodes
			el.selectionMark.shape.setVisible(false);
		});

		this.app.stage.draw();	//draw things

		if (this.app.panels.stylePanel) {
			this.app.panels.stylePanel.destroy();
		}
		
	};
};


GraphApp.Handler.StageClick.prototype = new GraphApp.Handler(undefined, undefined);

/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp, $ */

/**
* Deals with clicks on zoom elements.
* @param <Object> event    the click Event
* @param <HTMLelement> html elemento with attribute data-zoom-factor defined
* @return void
*/
GraphApp.Handler.Zoom = function (event, target) {
	"use strict";
	this.Iam = "GraphApp.Handler.Zoom";
	this.event = event;
	this.target = target;

	this.run = function () {
		var scale = $(this.target).data("zoom-scale");
		console.log(scale);
		if (Number(scale).toString() !== "NaN") {
			this.changeScaleTo(scale, this.app.stage);
		}
	};

	this.setApp = function (app) {
		this.app = app;
	};

	/** 
	* @param Number scale     how much to change
	* @param <GraphApp.Stage> stage    the stage 
	*/
	this.changeScaleTo = function (scale, stage) {
		stage.changeScaleTo(scale);
	};
};


GraphApp.Handler.Zoom.prototype = new GraphApp.Handler(undefined, undefined);

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
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */


/**
* Deals with presenting a panel on the screen that allows edge customization
* FormPanels are ways for the user to interact with the application
* They have events binded to their elements that trigger an updateState function
* that can execute some sort of modification in the application
*/

GraphApp.FormPanel.EdgeStyle = function (elements, formPanelContainer, toogleButton) {
	"use strict";

	this.elements = elements;
	this.layoutDescriptor = undefined;
	this.parentElement = formPanelContainer;
	this.toogleButton = toogleButton;


	this.executeAction = function () {
		throw "method not implemented";
	};

	this.createDescriptor = function () {

		var panel = this;

		this.layoutDescriptor = [
			{
				label: "Cor",
				element: "input",
				attr: {
					type: "text",
					"class": "form-control color-chooser",
					placeholder: "Cor do traço",
					value: this.elements[0].shape.getStroke()
				},
				events : {
					blur: panel.updateStroke,
					keyup: panel.updateStroke
				}

			},//end of item
			{
				label: "Espessura",
				element: "input",
				attr: {
					type: "range",
					step: "0.2",
					min: "1",
					max: "10",
					"class": "form-control",
					placeholder: "Username",
					value: this.elements[0].shape.getStrokeWidth()
				},
				events : {
					blur: panel.updateStrokeWidth,
					change: panel.updateStrokeWidth
				}
			}, //end of item
		];// end of desc  array
	};

	
	this.updateStrokeWidth = function () {
		var el = this;
		el.panel.elements.forEach(function (edge) {
			edge.shape.setStrokeWidth(el.value);
		});
		try {
			el.panel.elements[0].graph.stage.draw();
		}
		catch (e) {
			console.error(e);
		}
	};
	

	this.updateStroke = function () {
		var el = this;
		el.panel.elements.forEach(function (edge) {
			edge.shape.setStroke(el.value);
		});
		try {
			el.panel.elements[0].graph.stage.draw();
		}
		catch (e) {
			console.error(e);
		}
	};
	

};

GraphApp.FormPanel.EdgeStyle.prototype = new GraphApp.FormPanel(undefined, undefined);
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Deals with selecting and unselecting elements
* @param <Object> event    the dragging event
* @param <GraphApp.Node> | <GraphApp.Edge>  target     who was clicked
* @return void
*/

GraphApp.FormPanel.NodeStyle = function (elements, formPanelContainer, toogleButton) {
	"use strict";

	this.elements = elements;
	this.layoutDescriptor = undefined;
	this.parentElement = formPanelContainer;
	this.toogleButton = toogleButton;

	this.createDescriptor = function () {

		var panel = this;

		this.layoutDescriptor = [
			{
				label: "Cor de borda",
				element: "input",
				attr: {
					type: "text",
					"class": "form-control color-chooser",
					placeholder: "Cor do traço",
					value: this.elements[0].shape.getStroke()
				},
				events : {
					blur: panel.updateStroke,
					keyup: panel.updateStroke
				}

			},//end of item
			{
				label: "Cor do preenchimento",
				element: "input",
				attr: {
					type: "text",
					"class": "form-control color-chooser",
					placeholder: "Cor do preenchimento",
					value: this.elements[0].shape.getFill()
				},
				events : {
					blur: panel.updateFill,
					keyup: panel.updateFill
				}

			},//end of item
			{
				label: "Raio",
				element: "input",
				attr: {
					type: "range",
					step: "0.2",
					min: "4",
					max: "40",
					"class": "form-control",
					placeholder: "Raio do vértice",
					value: this.elements[0].shape.getRadius()
				},
				events : {
					blur: panel.updateRadius,
					change: panel.updateRadius
				}
			}, //end of item
		];// end of desc  array
	};

	this.updateStrokeWidth = function () {
		var el = this;
		el.panel.elements.forEach(function (edge) {
			edge.shape.setStrokeWidth(el.value);
		});
		try {
			el.panel.elements[0].graph.stage.draw();
		}
		catch (e) {
			console.error(e);
		}
	};
	

	this.updateStroke = function () {
		var el = this;
		el.panel.elements.forEach(function (element) {
			element.shape.setStroke(el.value);
		});
		try {
			el.panel.elements[0].graph.stage.draw();
		}
		catch (e) {
			console.error(e);
		}
	};

	this.updateFill = function () {
		var el = this;
		el.panel.elements.forEach(function (element) {
			element.shape.setFill(el.value);
		});
		try {
			el.panel.elements[0].graph.stage.draw();
		}
		catch (e) {
			console.error(e);
		}
	};


	this.updateRadius = function () {
		var el = this;
		el.panel.elements.forEach(function (element) {
			element.shape.setRadius(el.value);
			element.selectionMark.updateMarkConfig();
		});
		try {
			el.panel.elements[0].graph.stage.draw();
		}
		catch (e) {
			console.error(e);
		}
	};



};

GraphApp.FormPanel.NodeStyle.prototype = new GraphApp.FormPanel();