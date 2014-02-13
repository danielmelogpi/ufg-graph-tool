 /*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp */

/** Behaviors related to the mouse (cursor), como posicionamento e estado */
GraphApp.Input.Mouse = function (stage) {
	"use strict";
	this.stage = stage;
  
	//isso não funciona esse escopo.. o objeto do mouse tem problemas
	this.getMousePosition = function () {
		var mouse = {
				success: false,
				x: 0,
				y: 0
			};

		try {
			var stageState = {
				pointerX: this.stage.kineticStage.getPointerPosition().x,
				pointerY: this.stage.kineticStage.getPointerPosition().y,
				positionX: this.stage.kineticStage.getPosition().x,
				positionY: this.stage.kineticStage.getPosition().y,
				scaleX: this.stage.kineticStage.getScaleX(),
				scaleY: this.stage.kineticStage.getScaleY()
			};

			mouse =  {
				x: (stageState.pointerX - stage.positionX) / stageState.scaleX,
				y: (stageState.pointerY - stage.positionY) / stageState.scaleY,
				success: true
			};
			return mouse;
		}
		catch (e) {
			console.debug("O mouse não pode ser capturado");
			return mouse;
		}
	};
};
GraphApp.Input.Mouse.prototype = new GraphApp.Input();