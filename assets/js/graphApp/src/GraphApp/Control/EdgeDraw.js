/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp*/

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

	/* returns the name of the control */
	this.getName = function () {
		return this.name;
	};

	this.enable = function () {
		var control = this;
		this.app.graph.nodes.forEach(function (node) {
			node.shape.on("click.edgedraw", control.addToOperation);
		});
	};

	this.addToOperation = function (evt) {
		var node = evt.targetNode;
		var control = node.holder.graph.app.activeControl;
		if (control.operationNodes.length === 0) {
			control.operationNodes.push(node.holder);
		}
		else if (control.operationNodes.length === 1) {
			control.operationNodes.push(node.holder);
			control.createEdge();
			control.operationNodes.length = 0;
		}
		else { //in case of caos
			control.operationNodes.length = 0;
		}
	};

	this.createEdge = function () {
		console.assert(this.operationNodes.length === 2);
		this.app.graph.createEdge(this.operationNodes[0], this.operationNodes[1]);
	};


	this.disable = function () {
		
	};
};
GraphApp.Control.EdgeDraw.prototype =  new GraphApp.Control();