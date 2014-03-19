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
	};

	this.showPanel = function () {
		var selectedItems = this.target.graph.edges.filter(function (e) {
			return e.selectionMark.shape.isVisible();
		});

		var panel = new GraphApp.FormPanel.EdgeStyle(selectedItems, "#panel-attributes .list-group-item");
		panel.init();
	};

	this.unselectEverything = function () {
		this.target.graph.stage.selectionMarks.forEach(function (mark) {
			mark.shape.hide();
		});
	};

	this.unselectEverythingButMe = function () {
		this.target.graph.stage.selectionMarks.forEach(function (mark) {
			if (mark.anchor.id !== this.target.id) {
				mark.shape.hide();
			}
			else {
				mark.shape.show();
			}
		}, this);
	};


};
GraphApp.Handler.Selection.prototype = new GraphApp.Handler();
