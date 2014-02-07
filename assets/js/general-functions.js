function stageUrl(){
	stage.content.src = stage.content.children[0].toDataURL();
}

function getMousePos() {
	var mouse = {x:0, y:0};
	try{
		mouse =  {
			x: (stage.getPointerPosition().x - stage.getPosition().x)/stage.getScaleX(),
			y: (stage.getPointerPosition().y - stage.getPosition().y ) /stage.getScaleY()
		};
		return mouse;
	}
	catch(e){
		console.error(e);
		return mouse;
	}
	
}

//ajusta o palco para coincidir com a janela
function adjustStageDimensions(){
	stage.setWidth($(window).width()); 
	stage.setHeight($(window).height());
	 
}

//atualiza o palco, promovendo alguns ajustes de z-index
function refreshStage(){
	jQuery.each(stage.find("Circle"), function(){ 
		this.setZIndex(10);
	} );
	jQuery.each(stage.find("Spline"), function(){ 
		this.setZIndex(9);
	} );
	jQuery.each(stage.find("Rect"), function(){ 
		this.setZIndex(1);
	} );
	stage.draw();
}
/**
* Com base no evento de clique passado e nos estados atuais do elementos, manipula os estados
* deles para manter coloridos somente os selecionados. É o responsável pela manipulação do estado
* "selected" dos objetos
*/
selectionHandler = function(e){
	if(actualControl == "navigation"){
		idClicked = this.getId();	//o id da forma atual
		if(!e.shiftKey){	//se não tivermos o shift pressionado percorremos todos os elementos desmarcando
			jQuery.each(stage.find("Circle, Spline"), function(){ 
				//se o id do item clicado estiver sendo percorrido agora, ele não é desativado
				this.selected = ( this.getId() == idClicked )? true: false;
				if(this.selected){
					//this.selectionRect = defaultSelectionRect(this);
				}
				else{
					
					if(typeof this.seletionRect == "undefined" || this.selectionRect.isNull){
						//this.selectionRect.remove();
						//this.selectionRect = {isNull : true};	
					} 
					
				}
			} );
		}
		else{ //se tiver shift, somente é alternado o estado do item clicado
			this.selected = this.selected ? false:true;	
			if(this.selected){
				//this.selectionRect = defaultSelectionRect(this);
			}
			else{
				try{
					//this.selectionRect.remove();
				}
				catch(e){ 
					logMe(e.stack);
				}
				//this.selectionRect = {isNull : true};
			}	
		}
		selectItemToogle();	
	}
}

/**
* Dados os elementos no palco, os que estão selecionados ganham uma diferenciação visual dos demais
*/
selectItemToogle = function(){
	//if(actualControl != "navigation" && newEdge.length != 1){
	//	return;
	//}

	elements = stage.find("Spline, Circle"); //realmente são todos os circulos e linhas?
	showAttrController = false;
	selectedElementsCount = 0;
	
	$(elements).each(function(){
		if(this.selected){ ///colore os itens selecionados

			if(this.getClassName() == "Circle"){
				//this.setFill(colors.SELECTED_ITEM_FILL);
			}
			//this.setStroke(colors.SELECTED_ITEM_STROKE);
			//layer.add(this.selectionRect);
			this.selectionRect.setVisible(true);
			updateMySelectionRect(this);
			selectedElementsCount++;
		}
		else{ //volta a cor normal os itens não selecionados
			if(this.getClassName() == "Circle"){
				//this.setFill(this.actualLook.fill);
			}
			//this.setStroke(this.actualLook.stroke);
			this.selectionRect.setVisible(false);
			updateMySelectionRect(this);
		}
		
	});
	if(selectedElementsCount == 1){
		showAttrController = true;
	}
	showAttr(showAttrController);

	selectedElements = elements;
	refreshStage();
};

/*
Quando o palco é clicado e isso não foi sobre nenhum elemento, elemntos selecionados devem ser 
desmarcados 
*/
function unselectEverythingEmptyClick(evt){
	if(!evt.targetNode){
		unselectEverything();
	}
}

/**
Remove a seleção de todos os itens marcados
*/
function unselectEverything(){
	if(actualControl != "navigation"){
		return;
	}
	elements = stage.find("Spline, Circle").filter(function(e){ return e.selected }); 
	$(elements).each(function(){
		this.selected = false;
	});
	selectItemToogle();
}



/**
* Recupera a camada onde são desenhados os vértices
* @return Kinetic.Layer
*/
function getNodeLayer(){

}


/**
* Recupera a camada onde são desenhadas as arestas
* @return Kinetic.Layer
*/
function getEdgeLayer(){

}

/**
* Retorna a camada onde é desenhada a followLine 
* (linha que segue o cursor quando está desenhando arestas)
* @return Kinetic.Layer
*/
function getFollowLineLayer(){

}

/**
* Recupera o content, que é so uma forma de se referir à div que contém a canvas utilizada
* @return HTML Element DIV.kineticjs-content
*/
function getStageContent(){

}


/**
* Saída única para os logs via console (permite controlar se os logs podem ou não sair no futuro)
*/
function logMe(e){
	console.log(e);
}

/** Mover para objects? */
function defaultSelectionRect(shape){
	var padding = 4;
	var x, y, width, height;
	if(shape.getClassName() == "Circle"){
		x = shape.getX() - (shape.getWidth()/2) - padding;
		y = shape.getY() - (shape.getHeight()/2) - padding;
		width = shape.getWidth() + padding*2;
		height = shape.getHeight() + padding*2;
	}
	else{
		var coord1 = smallerXPointSpline(shape);
		var coord2 = greaterXPointSpline(shape);
		
		width = Math.abs(coord2.getX() - coord1.getX()) +padding*2;
		height = Math.abs(coord2.getY() - coord1.getY()) + padding*2;

		if (getSplineDirection(shape) == "asc"){
			x = coord1.getX()- padding;
			y = coord1.getY()- height- padding;
		}
		else{
			x = coord1.getX()- padding;
			y = coord1.getY()- padding;
		}
	}

	var rect = new Kinetic.Rect({
        x: x,
        y: y,
        width: width,
        height: height,
        fill: colors.SELECTION_RECT_FILL,
        stroke: colors.SELECTION_RECT_STROKE,
        strokeWidth: 1,
        visible: false,
        dashArray: [3,5]
    });

    rect.element = shape;

	return rect;
}


function updatedSelectionRectAttrs(shape){
	var padding = 4;
	var x, y, width, height;
	if(shape.getClassName() == "Circle"){
		x = shape.getX() - (shape.getWidth()/2) - padding;
		y = shape.getY() - (shape.getHeight()/2) - padding;
		width = shape.getWidth() + padding*2;
		height = shape.getHeight() + padding*2;
	}
	else{
		var coord1 = smallerXPointSpline(shape);
		var coord2 = greaterXPointSpline(shape);
		
		width = Math.abs(coord2.getX() - coord1.getX()) +padding*2;
		height = Math.abs(coord2.getY() - coord1.getY()) + padding*2;

		if (getSplineDirection(shape) == "asc"){
			x = coord1.getX()- padding;
			y = coord1.getY()- height- padding;
		}
		else{
			x = coord1.getX()- padding;
			y = coord1.getY()- padding;
		}
	}

	return {
        x: x,
        y: y,
        width: width,
        height: height
    };

}


function handleMovementEffect(shape){ //shape sempre é um circulo
	if(!shape.selected){
		unselectEverything();
		shape.backupPosition = {		
			x: shape.getX(),
			y: shape.getY()
		}
	}
	else{
		var xMov = shape.getX() - shape.backupPosition.x;
		var yMov = shape.getY() - shape.backupPosition.y;
		var selectedElements = stage.find("Circle").filter(function(e){return e.selected});
		$.each(selectedElements, function(){
			if(shape.getId() != this.getId()){
				this.setX(this.getX() + xMov);
				this.setY(this.getY() + yMov);	
				updateMyEdges(this);
			}
		});

		shape.backupPosition = {		
			x: shape.getX(),
			y: shape.getY()
		}

	}
}

function greaterXPointSpline(spline){
	if( spline.attrs.origin.getX() > spline.attrs.end.getX() ){
		return spline.attrs.origin;
	}
	else{
		return spline.attrs.end;
	}
}

function smallerXPointSpline(spline){
	if(spline.attrs.origin.getX() < spline.attrs.end.getX()){
		return spline.attrs.origin;
	}
	else{
		return spline.attrs.end;
	}
}

function getSplineDirection(spline){

	var smallerX = smallerXPointSpline(spline);
	var greaterX = greaterXPointSpline(spline);

	if(smallerX.getY() < greaterX.getY()){
		return "desc";
	}
	else{
		return "asc";
	}
}


function mouseToPointer(){
	$("canvas").css("cursor","pointer")
}
function mouseToDefault(){
 	$("canvas").css("cursor","auto")
}

function hightlightButton(selector){
	$("#draw-panel .panel-content button").removeClass("btn-info")
	$(selector).addClass("btn-info");
}