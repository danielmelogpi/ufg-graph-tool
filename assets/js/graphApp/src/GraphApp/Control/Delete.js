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