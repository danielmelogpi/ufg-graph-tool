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