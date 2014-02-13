

/**
* Realiza a animação de uma linha quando ela é arrastada.
* POr n
*/
function flexibleLineAnimation(shape){

	return new Kinetic.Animation(function(frame) {
		if(!blockLastMouse){
			lastMouseForCurvingLine = getMousePos();	
		}
		
		shape.attrs.curve_modified = true;
		actualCurvingLine = shape;
		
		actualPoints = shape.getPoints();
		unitsPerFrameX = 10;
		unitsPerFrameY = 10;
		xDiff = (lastMouseForCurvingLine.x- actualPoints[1].x)/2;
		yDiff = (lastMouseForCurvingLine.y - actualPoints[1].y)/2;

		if(xDiff != 0 || yDiff !=0){

			if(Math.abs(xDiff) < unitsPerFrameX){
				addingX = xDiff== 0 ? 0 : (xDiff/Math.abs(xDiff));
				unitsPerFrameX = unitsPerFrameX*0.8;
			}
			else{
				addingX = xDiff==0 ? 0 : (xDiff/Math.abs(xDiff))*unitsPerFrameX;
			}
			if(Math.abs(yDiff) < unitsPerFrameY){
				addingY = yDiff== 0 ? 0 : (yDiff/Math.abs(yDiff));
				unitsPerFrameY = unitsPerFrameY*0.8;
			}
			else{
				addingY = yDiff==0 ? 0 : (yDiff/Math.abs(yDiff))*unitsPerFrameY;
			}
			//console.log(unitsPerFrameX+"  **  "+unitsPerFrameY);
			//console.log("addingX: "+addingX+", addingY: "+addingY)

			points = [	actualPoints[0].x, 
						actualPoints[0].y, 
						actualPoints[1].x + addingX, 
						actualPoints[1].y + addingY, 
						actualPoints[2].x,
						actualPoints[2].y
					];  

			shape.setPoints(points); 	
		}
		else if(xDiff == 0 && yDiff ==0 && !mouseIsDown){
			this.stop();
			unselectEverything();
		}
	}, stage);
}

function stopActualCurvingLine(){
	mouseIsDown = false;
	try{
		if(actualCurvingLine ){
			if(!blockLastMouse){
				lastMouseForCurvingLine = getMousePos();
				blockLastMouse = true;	
			}
			//actualCurvingLine.flexible.stop();	
		}
		
	}
	catch(e){
		console.error(e);
	}
}

function restoreCurve(){
	this.attrs.curve_modified = false;
	points =	[
					this.attrs.origin.getX(), this.attrs.origin.getY(), 
					this.getPoints()[2].x,this.getPoints()[2].y, 
					this.getPoints()[2].x,this.getPoints()[2].y
				];	

	var tween = new Kinetic.Tween({
        node: this, 
        duration: 0.4,
        points: points
      });

	tween.play();
      
	
	//refreshStage();
}