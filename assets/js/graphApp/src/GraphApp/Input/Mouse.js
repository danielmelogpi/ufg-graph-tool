 /*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp */

/** Behaviors related to the mouse (cursor), como posicionamento e estado */
GraphApp.Input.Mouse = function (stage) {
	"use strict";
	this.stage = stage;

	this.getMousePosition = function () {
		var mouse = {
				x: 0,
				y: 0
			};

		try {
			var stageState = {
				pointerX: this.stage.getPointerPosition().x,
				pointerY: this.stage.getPointerPosition().y,
				positionX: this.stage.getPosition().x,
				positionY: this.stage.getPosition().y,
				scaleX: this.stage.getScaleX(),
				scaleY: this.stage.getScaleY()
			};

			mouse =  {
				x: (stageState.pointerX - stage.positionX) / stageState.scaleX,
				y: (stageState.pointerY - stage.positionY) / stageState.scaleY,
			};
			return mouse;
		}
		catch (e) {
			console.error(e);
			return mouse;
		} 
	};
};
GraphApp.Input.Mouse.prototype = new GraphApp.Input();