 /*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp */

/** Behaviors related to the mouse (cursor), como posicionamento e estado */
GraphApp.Input.Mouse = function (stage) {
	"use strict";
	this.stage = stage;

	/** For some reason, I can only take mouse positions 
	until this point. Weird . I decided to take everything I need them..*/
	this.stagePointerPosition = stage.kineticStage.getPointerPosition();
	this.stagePosition = stage.kineticStage.getPosition();
	this.stageScale = this.stage.kineticStage.getScale();
  
	//isso não funciona esse escopo.. o objeto do mouse tem problemas
	this.getMousePosition = function () {
		var mouse = {
				success: false,
				x: 0,
				y: 0
			};

		try {
			var stageState = {
				pointerX: this.stagePointerPosition.x,
				pointerY: this.stagePointerPosition.y,
				positionX: this.stagePosition.x,
				positionY: this.stagePosition.y,
				scaleX: this.stageScale.x,
				scaleY: this.stageScale.y
			};

			mouse =  {
				x: (stageState.pointerX - stageState.positionX) / stageState.scaleX,
				y: (stageState.pointerY - stageState.positionY) / stageState.scaleY,
				success: true
			};
			return mouse;
		}
		catch (e) {
			console.debug("O mouse não pode ser capturado");
			console.error(e);
			return mouse;
		}
	};
};
GraphApp.Input.Mouse.prototype = new GraphApp.Input();