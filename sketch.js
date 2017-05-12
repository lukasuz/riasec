var canvas;
var HEXAGON;
var hexLetterImages;
var currentUsers;
var allUsers = [];
var colObj;

var testValues = [20, 30, 21, 5, 40, 27];
var testUser;

function getHexagonLength(width){
  if(width < 445) return width/2.5;
  return 200;
}

function setup(){} //Notwendig, da p5 benutzt wird
window.onload = function(){
  var divWidth = document.getElementById("canvas").clientWidth;
  var divHeight = document.getElementById("canvas").offsetHeight; // ist auf ca. 450 gestellt in der style.css

  canvas = createCanvas(divWidth, divHeight);
  canvas.parent("canvas");
  background(255);
  colObj = {
    colors: [color(46, 204, 113),color(231, 76, 60), color(142, 68, 173),
    color(241, 196, 15), rgb(41, 128, 185), rgb(26, 188, 156), color(243, 156, 18)],
    currentColorIndex: 0,
    getNextColor: function(){
      var newColor = this.colors[this.currentColorIndex];
      this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
      return newColor;
    }
  };
  // ["A","I","R","C","E","S"]
  hexLetterImages =[loadImage("images/R.png"), loadImage("images/I.png"), loadImage("images/A.png"), loadImage("images/S.png"),
loadImage("images/E.png"), loadImage("images/C.png", function(img){
  HEXAGON.addLetters();
})];
  var hexLength = getHexagonLength(divWidth);
  HEXAGON = new HexObj(createVector(divWidth/2, divHeight/2), hexLength);
  HEXAGON.init();
  HEXAGON.draw();
  noLoop();
};

var HexObj = function(midPos, length){
  this.midX = midPos.x;
  this.midY = midPos.y;
  this.length = length;
  this.vertices = [];
  this.vectors = [];
  this.letterSize = 25;
  this.letterOffset = {};
  this.letters = ["R","I","A","S","E","C"];
  this.init = function() {
    this.calcVertices();
    this.calcVectors();
    this.letterOffset = createVector(this.letterSize/2, this.letterSize/2);
  };
  this.draw = function(){
    this.drawTriangles();
    this.drawLines();
    this.addLetters();
  };
  this.addLetters = function() {
    // textSize(this.letterSize);
    // noStroke();
    // fill(0, 0, 0);
    for(var i = 0; i < 6; i++){
      // text(this.letters[i], this.vertices[i].x + this.vectors[i].x * 7,
      //    this.vertices[i].y + this.vectors[i].y * 7); //TODO: USE PNGS
      image(hexLetterImages[i],this.vertices[i].x + this.vectors[i].x * 7 - 12.5, this.vertices[i].y + this.vectors[i].y * 7 - 12.5);
    }
  };
  this.calcVectors = function(){
    for(var i = 0; i < 6; i++){
      var currentVertex = this.vertices[i];
      var currentX = (currentVertex.x - this.midX) / 50;
      var currentY = (currentVertex.y - this.midY) / 50;
      this.vectors.push(createVector(currentX, currentY));
    }
  };
  this.calcVertices = function(){
    for(var i = 0; i < 6; i++){
      var angle_deg = 60 * i -120;
      var angle_rad = PI / 180 * angle_deg;
      var currentPoint = createVector(this.midX + this.length * Math.cos(angle_rad),
        this.midY + this.length * Math.sin(angle_rad));
      this.vertices.push(currentPoint);
    }
  };
  this.drawOneLine = function(currentVertex, nextVertex){
    line(currentVertex.x, currentVertex.y, this.midX, this.midY);
    line(currentVertex.x, currentVertex.y, nextVertex.x, nextVertex.y);
  };
  this.drawLines = function(){
    stroke(44, 62, 80); //Stroke Color
    noFill();
    strokeWeight(3);
    for(var i = 0; i < 5; i++){
      var currentVertex = this.vertices[i];
      var nextVertex = this.vertices[i + 1];
      this.drawOneLine(currentVertex, nextVertex);
    }
    //Letze Seite
    this.drawOneLine(this.vertices[5], this.vertices[0]);
  };
  this.drawTriangles = function(){
    noStroke();
    fill(color(236, 240, 241)); //Triangle Color
    for(var i = 0; i < 5; i++){
      var currentVertex = this.vertices[i];
      var nextVertex = this.vertices[i + 1];
      this.drawOneTriangle(currentVertex, nextVertex);
    }
    this.drawOneTriangle(this.vertices[5], this.vertices[0]);
  };
  this.drawOneTriangle = function(currentVertex, nextVertex){
    triangle(this.midX, this.midY, currentVertex.x, currentVertex.y, nextVertex.x, nextVertex.y);
  };
};

var ECodeObj = function(values, hexagon, col){
  this.hexagon = hexagon;
  this.values = values;
  this.valueLetters = ["R","I","A","S","E","C"];
  this.col = col || color(231, 76, 60);
  this.positions = [];
  this.init = function() {
    this.calcPositions();
  };
  this.calcPositions = function(){
    for(var i = 0; i < 6; i++){
      var currentX = hexagon.midX + hexagon.vectors[i].x * this.values[i];
      var currentY = hexagon.midY + hexagon.vectors[i].y * this.values[i];
      this.positions.push(createVector(currentX, currentY));
    }
  };
  this.draw = function(){
    //Punkte zeichnen
    this.col = colObj.getNextColor();
    fill(this.col);
    noStroke();
    this.positions.forEach(function(vec){
      ellipse(vec.x, vec.y, 10, 10);
    });
    //Linien zwischen den Punkten zeichnen
    stroke(this.col);
    strokeWeight(2);
    for(var i = 0; i < 5; i++){
      var currentPoint = this.positions[i];
      var nextPoint = this.positions[i + 1];
      line(currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y);
    }
    line(this.positions[5].x, this.positions[5].y, this.positions[0].x, this.positions[0].y);
    this.drawValueLetters();
  };
  this.drawValueLetters =  function(){
    noStroke();
    fill(255);
    rect(0, 0, 80, windowHeight);
    textSize(25);
    fill(this.col);
    var startY = (document.getElementById("canvas").offsetHeight / 2) - 2 * 50 - 25;
    for(var i = 5; i >= 0; i--){
      text(this.valueLetters[i] + ": " + this.values[i], 0, startY + 50 * i);
    }
  };

};

var User = function(values, gender, name, number){
  this.values = values;
  this.gender = gender;
  this.name = name;
  this.number = number;
  this.eCodeObj = {};
  this.init = function(){
    this.eCodeObj = new ECodeObj(this.values, HEXAGON); //hardcoded hexagon, man könnte auch für jeden user ein eigenes Hexagon anlegen
    this.eCodeObj.init();
  };
  this.draw = function(){
    this.eCodeObj.draw();
  };
};

function rgb(r,g,b){
  return color(r,g,b);
}
