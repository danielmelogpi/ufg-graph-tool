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
		actionsToTabs();

		//window.panel = new GraphApp.FormPanel.EdgeStyle(graphApp.graph.edges, $("#panel-attributes .list-group-item"));
		//window.panel.init();
	}
);

/** Adiciona eventos aos botoões que alternam o controle ativo */
function eventsToControlButtons() {
	"use strict";
	$("#navigationControl").click(function () {
		graphApp.changeControlTo(new GraphApp.Control.Navigation());
		var button = $(this);
		deactiveVisualControls();
		button.addClass("btn-info");
	});

	$("#nodeControl").click(function () {
		graphApp.changeControlTo(new GraphApp.Control.NodeDraw());
		var button = $(this);
		deactiveVisualControls();
		button.addClass("btn-info");
	});

	$("#edgeControl").click(function () {
		graphApp.changeControlTo(new GraphApp.Control.EdgeDraw());
		var button = $(this);
		deactiveVisualControls();
		button.addClass("btn-info");
	});

	$("#deleteControl").click(function () {
		graphApp.changeControlTo(new GraphApp.Control.Delete());
		var button = $(this);
		deactiveVisualControls();
		button.addClass("btn-info");
	});

	//this buttons actualy use handlers classes, since they don't stay active

	$("#zoomPlusControl, #zoomMinusControl").click(function (event) {
		var handler = new GraphApp.Handler.Zoom(event, event.target);
		handler.setApp(graphApp);
		handler.run();
	});
}

function deactiveVisualControls() {
	"use strict";
	$("#draw-panel .panel-body button").each(function () {
		$(this).removeClass("btn-info");
	});
}

function actionsToTabs() {
	"use strict";
	$("#toogle-console, #toogle-attributes").click(function () {
		var me = $(this);
		me.siblings().each(function () {
			var sib = $(this);
			$("#" + sib.data("show")).hide();
			sib.removeClass("active");
		});
		me.addClass("active");
		$("#" + me.data("show")).show();
	});
}