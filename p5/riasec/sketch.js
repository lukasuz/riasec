var canvas;
var testValues = [20, 30, 21, 5, 40, 27];
var testUser;

var males = [];
var females = [];

function setup() {
  canvas = createCanvas(windowWidth, 450);
  canvas.parent("canvas");
  background(255);
  var hexagon = new HexObj(createVector(windowWidth/2, 250), 200);
  hexagon.init();
  hexagon.draw();
  var CurrenECodeObj = new ECodeObj(testValues, hexagon);

  testUser = new User(testValues, true, "lukas", CurrenECodeObj);
  testUser.init();
  testUser.draw();
  noLoop();
}

function draw() {

}

var HexObj = function(midPos, length){
  this.midX = midPos.x;
  this.midY = midPos.y;
  this.length = length;
  this.vertices = [];
  this.vectors = [];
  this.letters = ["A","I","R","C","E","S"];
  this.init = function() {
    this.calcVertices();
    this.calcVectors();
  };
  this.draw = function(){
    this.drawTriangles();
    this.drawLines();
    this.addLetters();
  };
  this.addLetters = function() {
    textSize(25);
    noStroke();
    fill(0, 0, 0);
    for(var i = 0; i < 6; i++){
      text(this.letters[i], this.vertices[i].x + this.vectors[i].x * 7, this.vertices[i].y + this.vectors[i].y * 7); //TODO: USE PNGS
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
      var angle_deg = 60 * i;
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
    fill(color(52, 152, 219)); //Triangle Color
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
  };
};

var User = function(values, gender, name, eCodeObj){
  this.values = values;
  this.gender = gender;
  this.name = name;
  this.eCodeObj = eCodeObj;
  this.init = function(){
    this.eCodeObj.init();
  };
  this.draw = function(){
    this.eCodeObj.draw();
  };
};
