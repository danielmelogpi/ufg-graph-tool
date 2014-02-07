
function defaultStage(){
	var stage = new Kinetic.Stage({
		container: 'graph-drawn',
		width: "0",
		height: "0",
		draggable: false
	});

	stage.on("contentMouseup.stop-curving-line",stopActualCurvingLine );
	stage.on("contentClick.unselect-everything", unselectEverythingEmptyClick );
	return stage;
}

/** Inicializa objetos importantes */
(function(){
	
	//controle de momentos da animação de curvatura de uma linha
	actualCurvingLine = undefined;
	lastMouseForCurvingLine = {};
	blockLastMouse = false;
	mouseIsDown = false;

	Color = function(){
		this.SELECTED_ITEM_FILL = "#c73028";
		this.SELECTED_ITEM_STROKE ="#df6861";

		this.HOVER_DEFAULT_FILL = "#7AFAF8";
		this.HOVER_DEFAULT_STROKE = "#48D4D1";

		this.LINE_DEFAULT_STROKE = "#000";
		this.CIRCLE_DEFAULT_FILL = "#000";
		this.CIRCLE_DEFAULT_STROKE = "#000";

		this.SELECTION_RECT_FILL = "transparent";
		this.SELECTION_RECT_STROKE = "#c73028";
	};


	defaultCircle = function (x, y){
		var circle = new Kinetic.Circle({
			x: x,
			y: y,
			radius: 12,
			fill: colors.CIRCLE_DEFAULT_FILL,
			draggable: true,
			stroke: colors.CIRCLE_DEFAULT_STROKE,
			strokeWidth: 2,
			id : Math.random(),
			selected : false,
			isRemoved: false
		});

		circle.actualLook = {
			radius: circle.getRadius(),
			stroke: colors.CIRCLE_DEFAULT_STROKE,
			fill: colors.CIRCLE_DEFAULT_FILL
		};
		//mantem uma copia da posição do circulo, para calculo do efeito do movimento sobre outros elementos
		circle.backupPosition = {		
			x: circle.getX(),
			y: circle.getY()
		}

		circle.on('dragstart dragmove', function(){
			activateNavigation();
			if(actualControl == "navigation"){
				handleMovementEffect(this);
				updateMyEdges(this);
			}

		});
		circle.on('mouseover', function(){
			if(!this.selected){
				//this.setFill(colors.HOVER_DEFAULT_FILL);
				//this.setStroke(colors.HOVER_DEFAULT_STROKE);
				//stage.draw();
			}
			mouseToPointer();
		});
		circle.on('mouseout', function(){
			if(!this.selected){
				//this.setFill(this.actualLook.fill);
				//this.setStroke(this.actualLook.stroke);
				//stage.draw();
			}
			mouseToDefault();
		});
		circle.on("click.selectToogle", selectionHandler);
		circle.selectionRect = defaultSelectionRect(circle);

		return circle;
	};

	
	//define uma linha padrão. recebe os dois círculos (vertices) que liga
	defaultLine = function(origin, end){
		//no inicio o ponto de controle da curvatura é o mesmo do final
		var points = [origin.getX(), origin.getY(), end.getX(), end.getY(),end.getX(), end.getY()];
		//flexibleLineAnimation

		var line = new Kinetic.Spline({
	        points: points,
	        tension: 0.5,
	        stroke: colors.LINE_DEFAULT_STROKE,
	        strokeWidth: 4,		//@TODO criar objeto de configurações
	        draggable: false,
			id : Math.random(),
			selected : false,
			isRemoved: false,
			lineCap: 'round',
			lineJoin: 'round',
			origin: origin,
			end: end,
			curve_modified: false
		});

		line.flexible = flexibleLineAnimation(line);

		line.actualLook = {
			strokeWidth: 4, 
			stroke: colors.LINE_DEFAULT_STROKE
		};

		line.on('mouseover', function(){
			//this.setStrokeWidth(12);		//@TODO criar objeto de configurações
			if(!this.selected){
				//this.setStroke(colors.HOVER_DEFAULT_STROKE);
				stage.draw();
			}
			mouseToPointer();
		});
		line.on('mouseout', function(){
			if(!this.selected){
				//this.setStroke(this.actualLook.stroke);
				stage.draw();
			}
			mouseToDefault();
		});

		line.on("mousedown", function(evt){
			if(evt.altKey  && evt.ctrlKey){

				mouseIsDown = true;
				blockLastMouse = false;
		 		this.flexible.start();	
			}
	 	});

		line.on("mouseup", function(){
			mouseIsDown = false;
			lastMouseForCurvingLine = getMousePos();
			blockLastMouse = true;
			//this.flexible.stop();
	 	});
	 	line.on( "dblclick.restore-curve", restoreCurve);

		line.on("click.selectToogle", selectionHandler);

		line.selectionRect = defaultSelectionRect(line);
		return  line;

	};

	/*
	Retorna um retangulo padrão para mostrar a seleção de um elemento
	*/
	/*defaultSelectionRect = function(x, y, width, height){
		var  rect = new Kinetic.Rect({
				x: x,
				y: y,
				width: width,
				height: height,
				fill: 'red',
				stroke: 'red',
				strokeWidth: 1
				});
		//rect.setOpacity(0.3);
		rect.setId("selectionRect");
		return rect;
	};
*/

	defaultFollowLine = function(origin, end){
		var points = [origin.getX(), origin.getY(), end.getX(), end.getY()];
		
		var line = new Kinetic.Line({
			points: points,
			strokeWidth: 1,
			lineCap: 'round',
			lineJoin: 'round',
			origin: origin,
			end: end
		});
		//line.setZIndex(1);
		return  line;
	};


})();


