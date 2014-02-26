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