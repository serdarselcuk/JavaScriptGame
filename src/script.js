// @serdarselcuk

const EMPTY = "ffffff";
const BOUNCE = 'circle bouncingBall';
const NON_BOUNCE = 'circle';
const NORTH = "NORTH";
const SOUTH = "SOUTH";
const RIGHT = "RIGHT";
const LEFT = "LEFT";
// const HIGHLIGHTING_COUNT = 3;
const SELECTED_SHADOW =  "inset 0 -5px 15px rgba(255,255,255,0.9), inset -20px -10px 40px rgba(34, 32, 32, 0.4), 0 0 1px #000";
const UN_SELECTED_SHADOW = 	"inset 0 -5px 15px rgba(255,255,255,0.4), inset -20px -10px 40px rgba(33, 31, 31, 0.5), 0 0 1px #000";
const NOT_EXISTING = "inset 0 0px 0px rgba(255,255,255,0.0), inset -20px -10px 40px rgba(0, 0, 0, 0.0), 0 0 0px #000";	
const COLOR_LIST =  [ "7F6C6C","FFFFCC","CCFFFF","b8ffb8","CCCCFF","ffc4e1"	];
const MAP_BALLS_ON_BOARD = new Map();
const MAP_OF_EMPTY_SQUARES = new Map();
var score = 0;
var listOfBallsWillBeDestroyed = new Set();
var selectedBallElement = null;
var selectedBallColor = EMPTY;
var trackedIdMap = new Map();
var ftrBalls = [];

// animation: bounce 0.5s;
// animation-direction: alternate;
// animation-iteration-count: infinite;
document.addEventListener("click",clickElement());

function restart(){
	location.reload();
	gameStart();	
}

function gameStart(){
	location.replace("https://www.google.com/")
	// let array =document.getElementsByClassName("circle");
	// for (const key in array) {
	// 	console.log(key," ",array[key]);
	// 	if(array[key].id!=null){
	// 		MAP_OF_EMPTY_SQUARES.set(array[key].id,array[key]);
	// 	}
	// }
	// console.log("emptySquares->",MAP_OF_EMPTY_SQUARES);
	// setFutureBalls()
	// sendRandomBall(3);
}

function clickElement() {
	window.onclick = currentClickedElement =>{
		let clickedElementId = currentClickedElement.target.id;
		
		console.log("Clicked->"+clickedElementId);
		if(currentClickedElement.target.className == "circle"){
			console.log("className is circle");
			if(selectedBallElement == null){
				console.log("selected ball is null");
				if(MAP_BALLS_ON_BOARD.get(clickedElementId)!=null){
					console.log("ball is in balls board");
					selectBall(currentClickedElement);
					console.log("ball selection done!");
				}else if(MAP_OF_EMPTY_SQUARES.get(clickedElementId)){
					console.log("square is empty");
					console.log("don't do anything");
				}else{
					console.log("clicked element is not in memory");
				}
			}else if(selectedBallElement != null){
				let selectedBallElementId = selectedBallElement.target.id;
				console.log("selected ball is not null");
				if(MAP_BALLS_ON_BOARD.get(clickedElementId)!=null){
					console.log("ball is in balls board");
					deselectBall(selectedBallElement)
					selectBall(currentClickedElement);
					console.log("new ball selected");
				}else if(MAP_OF_EMPTY_SQUARES.get(clickedElementId)){
					console.log("square is empty, move action starting",selectedBallElementId," ",clickedElementId);
					moveBall(clickedElementId);
				}else{
					console.log("clicked element is not in memory",clickedElementId);
				}
			}
		}else{
			console.log("element class name is: ",currentClickedElement.target.className );
		}
	}
}

function moveBall(targetElementId){
	let selectedBallElementId = selectedBallElement.target.id;
	if(trackRoadToTarget(selectedBallElementId,targetElementId)!= null){
		createBall(targetElementId,selectedBallColor);
		removeBall(selectedBallElementId);
		console.log("ball moved successfully:",selectedBallElementId," to ",targetElementId);
		if(MAP_OF_EMPTY_SQUARES.size>2){
			sendRandomBall(3);
		}else{
			endGame();
		}
	}else{
		console.log("there is no way!",selectedBallElementId +"->"+ targetElementId,"\n",trackedIdMap);
	}
	
	trackedIdMap = new Map();
}

function getVerticalNum(num){
	return (num%10);
}

function getHorizontalNum(num){
	return (num-(num%10))/10;
}

function setDirection(startId, targetId){
	let fromV =  getVerticalNum(getNumFromElementId(startId));
	let fromH =  getHorizontalNum(getNumFromElementId(startId));
	let toV =  getVerticalNum(getNumFromElementId(targetId));
	let toH=  getHorizontalNum(getNumFromElementId(targetId));
	// horizontal nums will show vertical direction and the change on vertical nums 
	// will show horizontal direction 
	let array =[verticalDirection(fromH,toH),horizontalDirection(fromV, toV)];
	let first = Math.abs(fromH-toH)>Math.abs(fromV-toV)?1:0;
	let second = first==1?0:1;
	return  new Set([array[first],array[second]]);
}

function verticalDirection(from,to){
	if(from>to) return NORTH;
	else if(to>from) return SOUTH;
	else return null;
}

function horizontalDirection(from,to){
	if(from>to) return LEFT;
	else if(to>from) return RIGHT;
	else return null;
}

function deselectBall(e){
	e.target.className =NON_BOUNCE;
	e.target.style.boxShadow = UN_SELECTED_SHADOW;
	selectedBallElement = null;
	console.log("ball deselected",e.target.id);
}

function selectBall(e){
	e.target.className =BOUNCE;
	selectedBallColor = e.target.style.backgroundColor;
	e.target.style.boxShadow = SELECTED_SHADOW;
	selectedBallElement = e;
	console.log("ball selected",e.target.id);
	e.target.className = 'circle bouncingBall';
}

function getRandomColor(){
	return COLOR_LIST[getRandomInt(6)];
}

function setFutureBalls(){
	for (let index = 1; index <= 3; index++) {
		ftrBalls.push(getRandomColor());
	}
	showFutureBalls();
}

function showFutureBalls(){
	for (let index = 0; index < 3; index++) {
		if (Object.hasOwnProperty.call(ftrBalls, index)) {
			createBall('fb10'+(index+1), ftrBalls[index]);
		}else{
			throw new Error('future ball pool is empty');
		}
	}
}

function switchFutureBalls(color){
	ftrBalls.push(color);
	return ftrBalls.shift();
}

function sendRandomBall(a){
	if(!removeCompletedSeries()){
		for (let index = 0; index < a; index++) {
			let emptyBallPosition = getRandomEmptySquareElement();
			if(emptyBallPosition==null) {
				endgame();
				break;
			}
			createBall(emptyBallPosition,
				switchFutureBalls(getRandomColor()));
		}
		showFutureBalls();
		removeCompletedSeries();
	}
}

function getRandomEmptySquareElement(){
	let a = Array.from(MAP_OF_EMPTY_SQUARES);
	return a[getRandomInt(MAP_OF_EMPTY_SQUARES.size)][0];
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function createBall(id,color){
	let element = getBallElement(id);
	element.style.backgroundColor = color;
	element.style.boxShadow = UN_SELECTED_SHADOW;
	selectedBallElement = null;
	MAP_BALLS_ON_BOARD.set(id,element);
	MAP_OF_EMPTY_SQUARES.delete(id);
	console.log("ball created");
}


function removeBall(id){
	let element = getBallElement(id);
	element.className = NON_BOUNCE;
	element.style.boxShadow = NOT_EXISTING;
	element.style.backgroundColor = EMPTY;
	MAP_OF_EMPTY_SQUARES.set(id,element);
	MAP_BALLS_ON_BOARD.delete(id);

	console.log("ball removed");
}

function trackRoadToTarget(id,targetid){
	let direction = setDirection(id,targetid);
	let remainingDirectionsList = new Array(SOUTH,NORTH,LEFT,RIGHT).filter(obj=>!direction.has(obj));

	for (directTo of direction) {
		if(directTo!=null){
			if(targetid == goForDirection(id,targetid,directTo)) return targetid;
		}
	}

	for (directTo of remainingDirectionsList) {
		if(targetid == goForDirection(id,targetid,directTo)) return targetid;
	}
	return null;
}

function goForDirection(id, targetid, direction){
	let nextPointId ;
	if(direction==NORTH) {
		nextPointId = checkUpperIsEmpty(id);
	}else if (direction==SOUTH) {
		nextPointId = checkLowerIsEmpty(id);
	}else if (direction==LEFT) {
		nextPointId = checkLeftIsEmpty(id);
	}else if (direction==RIGHT) {
		nextPointId = checkRightIsEmpty(id);
	}
	return targetWay(nextPointId,id,targetid);
}

function targetWay(nextStepId,currentStepId,targetid){
	if(nextStepId != null && trackedIdMap.get(nextStepId)==null){
		if(saveIfNegbourIsNotTrackedBefore(nextStepId,currentStepId)) trackedIdMap.set(nextStepId,currentStepId);
			if(targetid==nextStepId){
				return nextStepId;
			}
		return trackRoadToTarget(nextStepId, targetid);
	}
	return null;
}

function saveIfNegbourIsNotTrackedBefore(id, beforeId){
	let trackeBeforeId = null;
	let directionsList = new Array(SOUTH,NORTH,LEFT,RIGHT);
	for (direction of directionsList) {
		trackeBeforeId = getNeigbourId(direction,id);
		if(trackeBeforeId != beforeId && trackedIdMap.get(trackeBeforeId)!=null){
			
			trackedIdMap.set(id,trackeBeforeId);
			return false;
		}
	}
	return true;
}

function checkUpperIsEmpty(id){
	let elementId =getNeigbourId(NORTH,id);
	if(MAP_OF_EMPTY_SQUARES.get(elementId)!=null){
		return elementId;
	}
	return null;	
}

function checkLowerIsEmpty(id){
	let elementId =getNeigbourId(SOUTH,id);
	if(MAP_OF_EMPTY_SQUARES.get(elementId)!=null){
		return elementId;
	}
	return null;  
}

function checkRightIsEmpty(id){
	let elementId =getNeigbourId(RIGHT,id);
	if(MAP_OF_EMPTY_SQUARES.get(elementId)!=null){
		return elementId;
	}
	return null;  
}

function checkLeftIsEmpty(id){
	let elementId =getNeigbourId(LEFT,id);
	if(MAP_OF_EMPTY_SQUARES.get(elementId)!=null){
		return elementId;
	}
	return null;;  
}

function getNumFromElementId(id){
	return parseInt(id.substring(1));
}

function getNeigbourId(direction, id){
	let horizontalId = getHorizontalNum(getNumFromElementId(id));
	let verticalId= getVerticalNum(getNumFromElementId(id));
	switch(direction){
		case NORTH:
			if(horizontalId<2) return null;
			horizontalId--; 
			break;
		case SOUTH:
			if(horizontalId>8) return null;
			horizontalId++; 
			break;
		case RIGHT:
			if(verticalId >8) return null;
			verticalId++;
			break;
		case LEFT:
			if(verticalId<2) return null;
			verticalId--;
			break;
		default:
			throw new Error("Direction Error","Direction Not Found: "+direction);
	}
	return createElementId(horizontalId,verticalId);
}

// will return true if any ball deleted
function removeCompletedSeries(){
	plainCheck();
	crosslineCheck();
	let removedCount = 0;
	listOfBallsWillBeDestroyed.forEach(p=>
		{
			removeBall(p);
			removedCount++;
		}
	);
	listOfBallsWillBeDestroyed.clear();
	updateScore(removedCount);
	return removedCount>0;
}

function calculateScore(ballCount){
	let point;
	if(ballCount==5) point =  ballCount*10;
	else if(ballCount<5) point =  0;
	else{
		point = 50;
		let dif = ballCount-5;
		while(dif>0){
			point += (10*dif--);
		}
	}
	return point;
}

function updateScore (ballCount){
	let point = calculateScore(ballCount);
	let scoreElement = document.getElementsByClassName("SkoreBoard")[0];
	scoreElement.innerText = (score+=(point));
	scoreElement.style.height =( score/100);
	scoreElement.style.top = -(score/100);
}

function getElementColor(element){
	return element.style.backgroundColor;
}

function getElementId(e){
	return e.id;
}

function getBallElement(id){
	return document.getElementById(id);
}

function plainCheck(){
	
	for (let x = 1; x < 10; x++) {
		let horizontal = [];
		let vertical = []
		for (let y = 1; y < 10; y++) {
			let elementid1 = createElementId(x,y);
			let elementid2 = createElementId(y,x);
			horizontal = destroyableBallList(elementid1,horizontal);
			vertical = destroyableBallList(elementid2,vertical);
		}		
	}

}

function destroyableBallList(elementid,elementList){
	if (elementList.length>0) {
		if(MAP_OF_EMPTY_SQUARES.get(elementid)==null){
			if(getElementColor(MAP_BALLS_ON_BOARD.get(elementid))==getElementColor(elementList[0])){
				elementList.push(MAP_BALLS_ON_BOARD.get(elementid));
			}else{
				elementList = [];
				elementList.push(MAP_BALLS_ON_BOARD.get(elementid));
			}

		}else{
			elementList = [];
		}
		if (elementList.length>4) { 
			elementList.forEach(element=>
				listOfBallsWillBeDestroyed.add(element.id));
		}

	}else{
		if(MAP_OF_EMPTY_SQUARES.get(elementid)== null){
			elementList.push(MAP_BALLS_ON_BOARD.get(elementid))
		}else{
			// console.log("checked to destroy: empty square-"+elementid);
		}
	}
	return elementList;
}

function createElementId(a,b){
	return "c"+a+b;
}

function crosslineCheck(){

	for (let constant = 0; constant <5; constant++) {
		let a = [];
		let b = [];
		let c = [];
		let d = [];
		let y = 0;
		let y1 = 0;
		let y2 =0;
		let x2 = 0;
		for (let x = 1; x < 10 && y+1 <10; x++ ) {
			y = constant + x;
			y1 = 10-constant - x;
			x2 = 10 -x;
			y2= constant+x
			a= destroyableBallList(createElementId(y,x),a);
			b= destroyableBallList(createElementId(y1,x),b);
			c= destroyableBallList(createElementId(x,y),c);
			d= destroyableBallList(createElementId(x2,y2),d);
		}
			
	}
	
}

function createBallToNull(e){
    if(trackedIdMap.get(e)==null){
        return null;}
    createBall(e,"red");
    createBallToNull(trackedIdMap.get(e));
}

function changeBallColor(id,color){
	let element = getBallElement(id);
	element.style.backgroundColor = color;
	console.log("color changed to ",color,"for",id);
}

function highlightBall(elementId){
	let i = 1000;
	//  HIGHLIGHTING_COUNT;
	let originalColor=getElementColor(getBallElement(elementId)); 
	let num =   parseInt(originalColor.substring(originalColor.indexOf('(')+1,originalColor.indexOf(',')));
	
	// wait(2000);
	while(i-->0){
		let num1 = num++;
		let color = originalColor
				.substring(0,originalColor.indexOf('(')+1)
				+num1
				+originalColor.substring(originalColor.indexOf(','));
		changeBallColor(elementId,color);
		// changeBallColor(elementId,originalColor);
		console.log(originalColor,"color higligted to",color );
	}
}

function wait(timeout) {
	var 	counter= 0
		, 	start = new Date().getTime()
		, 	end = 0;
		console.log("waiting for ", timeout);
	while (counter < timeout) {
		end = new Date().getTime();
		counter = end - start;
	}
}

function endGame(){
	let headerElement = document.getElementById("headerBox");
	headerElement.style.backgroundColor = "red";
	headerElement.innerText = "GAME OVER";
}

// not finding the shortest way 

