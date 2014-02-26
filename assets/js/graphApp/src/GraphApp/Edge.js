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