"use strict";

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