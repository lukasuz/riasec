function submitPress() {
  try {
    getDataAndCreateUser();
  } catch (e) {
    alert(e);
  }
  console.log("submitted");
}

function getDataAndCreateUser() {
  var values = [];
  var gender = document.getElementById("Gender").value;
  var name = document.getElementById("Name").value;
  var userNumber = allUsers.length;
  var newUser;
  var letters = ["A", "I", "R", "C", "E", "S"];
  for (var i = 0; i < 6; i++) {
    var currentLetterValue = document.getElementById(letters[i]).value;
    if(currentLetterValue < 0 || currentLetterValue > 50) throw "Werte müssen zwischen 0 und 50 sein";
    if (currentLetterValue) {
      values.push(parseInt(currentLetterValue));
    }
  }
  if (!name || values.length != 6) throw "Name fehlt oder nicht alle RIASEC Werte wurden ausgefüllt";
  newUser = new User(values, gender, name, userNumber);
  newUser.init();
  allUsers.push(newUser);
  addUserToSelect(name, userNumber);
}

function addUserToSelect(name, userNumber) {
  var select = document.getElementById("currentUser");
  var opt = document.createElement('option');
  opt.value = userNumber;
  opt.innerHTML = name;
  select.appendChild(opt);
}

function fetchData(){
  allUsers = [];
  var selectNode = document.getElementById("currentUser");
  while (selectNode.firstChild) {
    selectNode.removeChild(selectNode.firstChild);
  }
  dateRef.once("value").then(function(snapshot){
    var data = snapshot.val();
    var keys = Object.keys(data);
    // keys.forEach(function(key){
    //   // console.log(data[key]);
    //   allUsers.push(data[key]);
    // });
    for(var i = 0; i < keys.length; i++){
      var firebaseUser = data[keys[i]];
      var newUser = new User(firebaseUser.values, firebaseUser.gender, firebaseUser.name, i);
      console.log(newUser);
      newUser.init();
      allUsers.push(newUser);
      addUserToSelect(newUser.name, i);
    }
  });
}

function drawSelectedUser() {
  var userNumber = document.getElementById("currentUser").value;
  allUsers[userNumber].draw();
}

function clearHexagon() {
  background(255);
  HEXAGON.draw();
}

function drawAverage(gender) {
  //see which of the users are relevant depending on the gender
  var relevantUserValues = [];
  var count = 0;
  var averageECodeObj;
  if (gender != "all") {
    for (var i = 0; i < allUsers.length; i++) {
      if (allUsers[i].gender === gender) {
        relevantUserValues.push(allUsers[i].values);
        count++;
      }
    }
  } else {
    for (var j = 0; j < allUsers.length; j++) {
      relevantUserValues.push(allUsers[j].values);
    }
    count = allUsers.length;
  }
  //calc the average value of the users
  var summedUserValues = relevantUserValues.reduce(function(first, second){
    return [first[0]+second[0],first[1]+second[1],first[2]+second[2],
  first[3]+second[3],first[4]+second[4],first[5]+second[5]];
  }, [0,0,0,0,0,0]);
  var averageUserValue = summedUserValues.map(function(e){
    return (e / count).toFixed(1);
  });
  averageECodeObj = new ECodeObj(averageUserValue,HEXAGON);
  averageECodeObj.init();
  averageECodeObj.draw();
}

function drawAll(){
  drawAverage("all");
}
function drawFemales(){
  drawAverage("female");
}
function drawMales(){
  drawAverage("male");
}
