/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global $, GraphApp, graphApp*/


$(document).ready(
	function () {
		"use strict";
		window.graphApp = new GraphApp("graph-app");
		window.n1 = graphApp.graph.createNode(80, 30);
		//window.n2 = graphApp.graph.createNode(112, 120);
		//window.n3 = graphApp.graph.createNode(60, 51);
		window.n4 = graphApp.graph.createNode(110, 220);
		// window.n5 = graphApp.graph.createNode(15, 2);
		window.n6 = graphApp.graph.createNode(331, 130);
		window.n7 = graphApp.graph.createNode(200, 240);
		
		window.n8 = graphApp.graph.createNode(10, 300);
		window.ed = graphApp.graph.createEdge(window.n1, window.n7);

		eventsToControlButtons();
	}
);

/** Adiciona eventos aos botoões que alternam o controle ativo */
function eventsToControlButtons() {
	"use strict";
	$("#navigationControl").click(function () {
		graphApp.changeControlTo(new GraphApp.Control.Navigation());
	});

	$("#nodeControl").click(function () {
		graphApp.changeControlTo(new GraphApp.Control.NodeDraw());
	});

	$("#edgeControl").click(function () {
		graphApp.changeControlTo(new GraphApp.Control.EdgeDraw());
	});

}
