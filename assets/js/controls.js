(function(){
	actualControl = "navigation";				//determina o controle atual
	blockzoom = false;							//@TODO implementar bloqueio no zoom
	newEdge = [];								//contém os pontos de uma aresta sendo montada.  necessário?
//	selectedElements = [];						//@TODO remover após teste de impacto
	intervalFollowingLine = undefined;			//guarda o interval da execução da função da followLine
	followLineTimeInterval = 100;				//tempo de intervalo da execução da followLine
})();


/**
* Eventos de clique sobre os botões.
*/

//Clique no controle de navegaçao. Desativa todos os os controles de desenho.
$("#navigationControl").click( function(){
	activateNavigation();
	hightlightButton("#navigationControl");	
	}
);


/**
* Clique no controle para desenho de vértice. 
* Os eventos adequados são adicionados so palco (stage)
*/
$("#nodeControl").click( function(){
	if(actualControl != "nodeDraw"){
		unselectEverything();
		disableFollowLine();
		deactivateEdgeDraw();
		disableDeletion();

		activateNodeDraw();
		actualControl = "nodeDraw"
		hightlightButton("#nodeControl");

	}
});


/**
* Ativa o controle de desenho dos vértices.
* Ativa também a linha seguidora (follow Line)
*/
$("#edgeControl").click( function(){
	if(actualControl != "edgeDraw"){
		unselectEverything();
        deactivateNodeDraw();
        disableDeletion();

		actualControl = "edgeDraw";
        stage.on("click.edgeDraw", captureClickedNodeId);
        hightlightButton("#edgeControl");
	}
});



/**
* Ativa o controle de remoção de elementos, tanto arestas quanto vértices
*/
$("#removeControl").click( function(){
	if(actualControl != "removeControl"){
        deactivateNodeDraw();
		disableFollowLine()
		deactivateEdgeDraw();

		actualControl = "removeControl";
		enableDeletion();
		hightlightButton("#removeControl");
	}
});


/**
* Controla o comportamento de zoom, baseado no ID do elemento clicado.
*/
$(".zoom").click(function(){
	switch (this.getAttribute("id")){
		case "zoom-plus":
			adjustStageScale(1);
		break;
		case "zoom-minus":
			adjustStageScale(-1);
		break;
	}	
	logMe("unblocking");
});

/**
* Controle para limpeza total do palco
*/
$("#clearStage").click(function(){
	$(stage.find("Shape")).each(function(){this.remove()});
	refreshStage();
});

/**
* FIM 	Eventos de clique sobre os botões.
*/

/**
* Callbacks e funções de desenho chamados pelos eventos de clique nos controles de desenho 
*/

/**
* Altera o controle atual para navegação (navigation)
* Desativa os demais controles a adiciona o evento de seleção para o clique nos elementos.
*/
function activateNavigation(){
	if(actualControl != "navigation"){
		hightlightButton("#navigationControl");	
		deactivateNodeDraw();
		disableFollowLine()
		deactivateEdgeDraw();
		actualControl = "navigation";
		disableDeletion();
	}
}

/**
* Adiciona ao palco a função que desenha um vertice no local do mouse.
*/
function activateNodeDraw(){
	stage.getContent().addEventListener('click',drawNode, false);
	return;
}


/*
* Remove do palco o evento de clique que desenha a linha
*/
function deactivateNodeDraw(){
	stage.getContent().removeEventListener('click',drawNode, false);
	return;
}

/**
* Desenha de fato um vértice na tela. 
* @TODO implementar o getNodeLayer()
*/
drawNode =  function() {
	var mousePos = getMousePos();

	var circle = defaultCircle(mousePos.x/stage.getScaleX(), mousePos.y/stage.getScaleY());
	stage.getLayers()[0].add(circle);
	stage.getLayers()[0].add(circle.selectionRect);
	refreshStage();
}

/**
* Ajusta a escala de Zoom do palco. A determinação dos níveis de zoom ocorre por meio de stage.scales
* @TODO 	Separar as escalas no objeto do palco
* @FIX 		Implementar bloqueio de zoom, impedindo bug de "muitos cliques"
*/
function adjustStageScale(direction){
	
	var effectDuration = 0.4;	//TODO ajustar para que o fator seja trabalhado em multiplos
	var easing = Kinetic.Easings['BackEaseInOut'];
	var scaleFactor = 0.5;
	
	var scales = [0.25, 0.5, 0.75, 1, 1.75, 2.5, 3.25, 4];
	var actual = scales.indexOf(stage.getScaleX());

	var newScale = actual + direction;

	newScale = (newScale < 0 ) ? 0 : newScale;
	newScale = (newScale >= scales.length) ? scales.length-1 : newScale 	

	var tween = new Kinetic.Tween({
	  node: stage, 
	  easing: easing,
	  duration: effectDuration, 
	  scaleX: scales[newScale], 
	  scaleY: scales[newScale] 
	});

	tween.play();

}

/*
*	Dado um clique no palco, é capturado o id do elemento clicado e repassado para a 
* 	função que lida com os ids dos vertices para desenho de novas arestas
*/
function captureClickedNodeId (evt){
    var shape = evt.targetNode;
    setEdgePoint(shape);
}


/**
* Controla o desenho de novas arestas. Faz uso da var newEdge que guarda as posições da
* futura aresta. 
* Inicia a visualização de uma followLine enquanto newEdge so contém a origem da aresta
*/
function setEdgePoint(shape){

	//somente vertices são permitidos daqui pra frente
	if(shape.getClassName() != "Circle")  return ;	

    newEdge.push(shape);

    if(newEdge.length == 2 ){
    	
    	var origin = newEdge[0];
        var end = newEdge[1];
        newEdge.length = 0; // esvazia o array
        if(origin != undefined && end != undefined){
        	var line = defaultLine(origin, end);
        	stage.getLayers()[0].add(line); 	//TODO implementar getEdgeLayer()
        	stage.getLayers()[0].add(line.selectionRect);
        	//remove a followLine
			disableFollowLine();        	
			refreshStage();
        	origin.selected = false;
        	end.selected = false;
        	selectItemToogle();
        }

    }
    if(newEdge.length == 1){
    	unselectEverything();
    	shape.selected = true;
    	selectItemToogle();

    	enableFollowLine(); //habilita a followLine
    }
    else if(newEdge.length == 0){
    	disableFollowLine(); //habilita a followLine
    }
}


/**
* Desativa o controle de desenho das arestas
*/
function deactivateEdgeDraw(){
	newEdge.length = 0;
	stage.off("click.edgeDraw");
}


/**
* Monta a followLine na tela utilizando uma execução de função a cada intervalo
* @TODO procurar implementação dessa função sem usar setInterval, mas com o evento do mouse no lugar
* @FIX 	Firefox apresenta problemas de desempenho com essa função. O lag é desastroso.
*/
enableFollowLine = function(){
	try{
		intervalFollowingLine = setInterval(drawFollowLine, followLineTimeInterval);
	}
	catch (e){
		console.error(e);
	}
	
}

/**
* Desabilita a followLine removendo a execução da função que a atualiza na tela.
* @TODO Implementar getFollowLineLayer()
*/
disableFollowLine = function(){
	clearInterval(intervalFollowingLine);
    stage.find('#followLine').remove();
    refreshStage();
    intervalFollowingLine = undefined;
}

/**
* Desenha de fato a followLine na tela
* @TODO Implementar getFollowLineLayer()
* @TODO Implementar método que retorne uma followLine pronta
*/
drawFollowLine = function(){
 
	if(getMousePos() === undefined ){
		return;
	}

	var existingFollowLine = stage.find('#followLine'); // uma referência à followLine seria melhor, não?
	
	var line;
	// a linha vai ser criada agora
	if(existingFollowLine.length === 0){
		var origin = newEdge[0];
		var end = defaultCircle(
					getMousePos().x-5,
					getMousePos().y-5);
		
		line = defaultFollowLine(origin, end);
		
		line.setStroke("#f00");
		line.setId("followLine");
		stage.getLayers()[0].add(line);
		refreshStage();
	}
	else{	//a linha vai ser atualizada
		line = existingFollowLine[0]; //referência ?
		
		line.setPoints([line.getPoints()[0].x,
						line.getPoints()[0].y,
						getMousePos().x-5,
						getMousePos().y-5]
						);
		refreshStage();
	}
	

};

/**
* Ativa a deleção por clique no elemento
*/
function enableDeletion() {

	deleteAllSelected();

	stage.on("click.deletion", function(evt){
		var shape = evt.targetNode;
		shape.isRemoved = true;
		if(shape.getClassName() == "Circle"){
			updateMyEdges(shape);
		}
		shape.selectionRect.destroy();
		shape.destroy();
		refreshStage();
	});

	refreshStage();
}
 
/**
* Desabilita o evento de deleção por clique
*/
function disableDeletion(){
	stage.off("click.deletion");
}

function deleteAllSelected(){
	selectedElements = stage.find("Circle, Spline").filter(function(element){  return element.selected });
	$.each(selectedElements, function(){
		this.isRemoved = true;
		if(this.getClassName() == "Circle"){
			updateMyEdges(this);
		}
		this.selectionRect.destroy();
		this.destroy();
			
	});

	refreshStage();
}


/** 
* Atualiza as arestas de um dado vértice
* Se o vértice tiver sido apagado no instante anterior essas arestas serão destruidas
* @MAYBE @TODO Forma genérica para tratar origem e final, utilizando somente um find() e um $.each()
*/
updateMyEdges = function(element){
	
	if(element.getClassName() != "Circle") return;

	edgesOrigin = stage.find("Spline").filter(function(line){
		return line.attrs.origin == element;
	});

	edgesEnd = stage.find("Spline").filter(function(line){
		return line.attrs.end == element;
	});
	
	$(edgesOrigin).each(function(){
		if(element.isRemoved){
			this.destroy();
		}
		else{
			if(this.attrs.curve_modified){
				this.setPoints(	[
								this.attrs.origin.getX(), this.attrs.origin.getY(), 
								this.getPoints()[1].x,this.getPoints()[1].y, 
								this.getPoints()[2].x,this.getPoints()[2].y
							  ]);	
			}
			else{
				//pontos do final são os mesmos do ponto de controle de curvatura
				this.setPoints(	[
								this.attrs.origin.getX(), this.attrs.origin.getY(), 
								this.getPoints()[2].x,this.getPoints()[2].y, 
								this.getPoints()[2].x,this.getPoints()[2].y
							  ]);		
			}
			updateMySelectionRect(this);
		}
	});
	$(edgesEnd).each(function(){
		if(element.isRemoved){
			this.destroy();
		}
		else{

			if(this.attrs.curve_modified){
				this.setPoints([
							this.getPoints()[0].x,this.getPoints()[0].y,
							this.getPoints()[1].x,this.getPoints()[1].y,
							this.attrs.end.getX(), this.attrs.end.getY()]);
			}
			else{
				this.setPoints([
							this.getPoints()[0].x,this.getPoints()[0].y,
							this.attrs.end.getX(), this.attrs.end.getY(),
							this.attrs.end.getX(), this.attrs.end.getY()]);
			}
			updateMySelectionRect(this);
		}
	});
	updateMySelectionRect(element);
	//refreshStage();
};


function updateMySelectionRect(shape){
	if(!shape.selectionRect.getVisible()){
		return;
	}
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
	shape.selectionRect.setX(x);
	shape.selectionRect.setY(y);
	shape.selectionRect.setWidth(width);
	shape.selectionRect.setHeight(height);
	refreshStage();
}

/**
* IMPLEMENTAÇÃO INCOMPLETA! RECURSO PROBLEMÁTICO
possivel solução: http://jsfiddle.net/AYHSM/6/
*/
intervalSelectionRect = undefined;
selectionStartPoint = {'x':10, 'y':10};
enableSelection = function(){
	intervalSelectionRect = setInterval(drawSelectionRect, 1000);
	logMe(intervalSelectionRect);
	return "terminado";
};
disableSelection = function(){
};


drawSelectionRect = function(){

	/**
	* @TODO certificar-se que todas as alturas e larguras são positivas
	*/

	if(getMousePos() === undefined ){
		logMe("sem posição do mouse!");
		return;
	}
	logMe("going");
	existingSelectionRect = stage.find('#selectionRect');

	if(existingSelectionRect.length === 0){
		existingSelectionRect.remove();
	}
	logMe("atualizando");
	actualMousePos = {
						"x": getMousePos().x-5,
						"y": getMousePos().y-5
					};

	if(actualMousePos.x > selectionStartPoint.x && actualMousePos.y > selectionStartPoint.y){
		//desenho no sentido da diagonal principal, descendo a direita do inicio
		var altura = positive(positive(actualMousePos.y) - positive(selectionStartPoint.y));
		var largura =positive(positive(actualMousePos.x) + positive(selectionStartPoint.x) );
		var initialPosition = {
			"x": selectionStartPoint.x ,
			"y": selectionStartPoint.y

		};

		logMe("caso 1");
	}
	else if(actualMousePos.x > selectionStartPoint.x && actualMousePos.y < selectionStartPoint.y){
		//desenho na diagonal oposta, subindo para a direita da origem
		var altura = positive(positive(actualMousePos.y) - positive(selectionStartPoint.y));
		var largura = positive(positive(actualMousePos.x) + positive(selectionStartPoint.x) );
		var initialPosition = {
			x: selectionStartPoint.x,
			y: selectionStartPoint.y-altura 
		};
		logMe("caso 2");
	}
	else if(actualMousePos.x < selectionStartPoint.x && actualMousePos.y < selectionStartPoint.y){
		//desenho na diagonal oposta, subindo a esquerda
		var altura = positive(positive(selectionStartPoint.y) - positive(actualMousePos.y));
		var largura = positive(positive(selectionStartPoint.x) + positive(actualMousePos.x));
		var initialPosition = {
			x: actualMousePos.x,
			y: actualMousePos.y - altura
		}
		logMe("caso 3");
	}
	else if(actualMousePos.x < selectionStartPoint.x && actualMousePos.y > selectionStartPoint.y){
		//descendo, a esquerda
		var altura = positive(positive(actualMousePos.y) - positive(selectionStartPoint.y) );
		var largura = positive(positive(selectionStartPoint.x) - positive(actualMousePos.x));
		var initialPosition = {
			x: actualMousePos.x ,
			y: actualMousePos.y - altura
		};	
		logMe("caso 4");
	}
	else{
		logMe("deu pau!");
		logMe(actualMousePos);
		logMe(selectionStartPoint);
	}

	logMe("desenhando em ("+initialPosition.x+", "+initialPosition.y+") com ("+largura+", "+altura+") . stage em ("+stage.getPosition().x+", "+stage.getPosition().y+")");
	var rect = defaultSelectionRect(initialPosition.x, initialPosition.y, largura, altura);
	stage.getLayers()[0].add(rect);
	refreshStage();
}

// substituir por método netivo Math.abs ( ¬¬'' era obvio que isso existia )
function positive (n){
	return n < 0 ? -1 *n : n;
}




