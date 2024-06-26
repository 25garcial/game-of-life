function main(){
async function gameClock(speed){
speed=1000/speed;
	while (true){
  	await new Promise(r => setTimeout(r, speed));
   board.updateCells();
   board.updateDisplay();
   //console.log("ping");
  }
  
}
function initHTML(){
var container=document.querySelector(".container");
	var columns=20;
  var rows =20;
  container.style["grid-template-rows"]=`repeat(${rows}, 50px)`;
  container.style["grid-template-columns"]= `repeat(${columns}, 50px)`;

	for (var i=0; i<columns; i++){
  for (var o=0; o<rows; o++){
  var cell=document.createElement("div");
  cell.classList.add("cell");
  cell.id=`${i};${o}`;

    
  
  cell.addEventListener("click", (e)=>{
  var cell=e.target;
  var position=cell.id.split(";");
  board.data[position[0]][position[1]].changeState();
  
  board.updateDisplay();
  });
  
  	container.appendChild(cell);
  }
  }
}
class Cell{
constructor(row, col){
this.position=[row,col];
this.alive=false;
}
changeState(){
//console.log("alive before: ", this.alive)
	this.alive=!this.alive;
 // console.log("alive after: ", this.alive)
  if (this.alive){
  	board.checkCells.push(this.position);
    }
    return true;
}
returnNearbyCells(){
var cells=[];
for (var row=-1;row<2;row++)
	for (var col=-1;col<2; col++){
  var cell=[row+this.position[0],col+this.position[1]];
  
  if (cell[0]<0){
  cell[0]=0;
  }
  if (cell[1]<0){
  cell[1]=0;
  }
  if (!(this.position[0]==cell[0] && this.position[1]==cell[1])){
  
  cells.push(board.data[cell[0]][cell[1]]);
  }  
  }
return cells;
}
}

class Board{
constructor(){
this.checkCells=[];
this.data=[];
for (var i=0; i<100; i++){
this.data[i]={};
  for (var o=0; o<100; o++){
 this.data[i][o]=new Cell(i,o);
  }
  }
}
checkRules(cell){
var aliveNeighbors=0;
  var nearbyCells=cell.returnNearbyCells();
  for(var i=0; i<nearbyCells.length;i++){
  if (nearbyCells[i].alive){
  	aliveNeighbors++;
  }
    }
    if (cell.alive){
    	if (aliveNeighbors<2 || aliveNeighbors>3){
      	return [false, cell];
      }
      else {
      return [true, cell];
      }
      }
      else if (!cell.alive){
      	if (aliveNeighbors==3){
        return [true, cell];
        }else{
        return [false, cell];
      }}
    console.log(cell);
    console.log(aliveNeighbors)
  return "fail";
  }
  
updateCells(){
  var cells=this.checkCells;
  var actions=[]; // [false, [position]], [true, position] false kill true revive
  var checkedCells=[];
  
  for (var i=0; i<cells.length;i++){ // for cell
  var cell=this.data[cells[i][0]][cells[i][1]];
  var nearbyCells=cell.returnNearbyCells();
  for (var o=0; o<nearbyCells.length; o++){  //for nearby cell
  if (!(checkedCells.includes(nearbyCells[o]))){
  	actions.push(this.checkRules(nearbyCells[o]));
    

      checkedCells.push(nearbyCells[o]);}
  }
  actions.push(this.checkRules(cell));
checkedCells.push(cell);
  }
 //console.log(actions);
// console.log(this.checkCells);
  for (var action of actions){
  	var [actionType, cell]=action;
    if (cell.alive != actionType){
    	cell.changeState();
    }
  }
}
  
updateDisplay(){
var cellsToCheck=this.checkCells.slice();
	for (var i=0; i<cellsToCheck.length; i++){
  var cell = document.getElementById(`${cellsToCheck[i][0]};${cellsToCheck[i][1]}`);
  
  //console.log(this.checkCells);
  if (this.data[cellsToCheck[i][0]][cellsToCheck[i][1]].alive){
  	cell.classList.add("alive");
  }
  else{
  cell.classList.remove("alive");
  console.log(this.checkCells)
  this.checkCells.splice(this.checkCells.indexOf(cellsToCheck[i]), 1);
  }}
  }
}
var board= new Board();
initHTML();
gameClock(0.5);
}
main();
