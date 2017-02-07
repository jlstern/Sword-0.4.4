// Table of Contents
// 01 - Images and variables
// 02 - Player object, abilities, and level up
// 03 - Enemy object and encounter logic
// 03 - Battle sequence
// 05 - Map and overworld movement
// 06 - Load screen and initialize

////////////////////////////////////////////////////////
// 01 - Images and variables
////////////////////////////////////////////////////////
// IMAGES
	// Player
	var playerIcon = new Image(100, 200);
	playerIcon.src = "images/arrows.png";

// VARIABLES
	// Battle
	var enemyTeam = [];
	var turnOrder = [];
	var currentTurn = 0

	// Overworld and movement
	var room = 0;
	var movementOn = true;
	var transitionCount = 0;
	var keyState = {};

	// Set interval variables

////////////////////////////////////////////////////////
// 02 - Player object, abilities, and level up
////////////////////////////////////////////////////////
// Player object
var player = {
	name: "King",
	type: "player",
	// stats
	hpCurr: 20,
	hpTotal: 20,
	mpCurr: 10,
	mpTotal: 10,
	mpRegen: 1,
	wepDef: 0,
	magDef: 0,
	wepMod: 0,
	magMod: 0,
	speed: 2,
	exp: 0,
	level: 1,
	path: 0,
	// for battle animation
	frame: 0,
	batX: 0,
	batY: 0,
	// overworld and movement
	x: 0,
	y: 0,
	direction: 0,
	step: 0,
	terrain: 0
}

// List of abilities

// Level of sequence


////////////////////////////////////////////////////////
// 03 - Enemy object and encounter logic
////////////////////////////////////////////////////////
// Enemy object
var encounterMasterList = [
	[1, 1, 0, 0],
	[1, 2, 0, 0],
	[1, 1, 1, 0]
]

var enemy = [
	{
		index: 0,
		type: "enemy",
		name: "placeholder",
		hpCurr: 0,
		hpTotal: 0,
		wepDef: 0,
		magDef: 0,
		wepMod: 0,
		magMod: 0,
		speed: 0,
		exp: 0,
		// attack logic
		attackChance: [],
		attckFunc: [],
		// for placement in battle
		position: 0,
		frame: 0,
		batX: 0, 
		batY: 0,
	},
	{
		index: 1,
		type: "enemy",
		name: "Goblin",
		hpCurr: 10,
		hpTotal: 10,
		wepDef: 0,
		magDef: 0,
		wepMod: 0,
		magMod: 0,
		speed: 1,
		exp: 0,
		// attack logic
		attackChance: [],
		attckFunc: [],
		// for placement in battle
		position: 0,
		frame: 0,
		batX: 0, 
		batY: 0,
	}
];

////////////////////////////////////////////////////////
// 05 - Battle sequence
////////////////////////////////////////////////////////
function beginEncounter(encounterNum){
	// set up enemy team
	for(i = 0; i < 4; i++){
		enemyTeam[i] = Object.assign({}, enemy[encounterMasterList[encounterNum][i]]);
		enemyTeam[i].position = i;
	}
	// set up turn order
	var turnOrderPrelim = [player]
	for(i = 0; i < enemyTeam.length; i++){
		turnOrderPrelim.push(enemyTeam[i])
	}
	while(turnOrderPrelim.length > 0){
		var highest = turnOrderPrelim[0].speed;
		var highestIndex = 0
		for(i = 0; i < turnOrderPrelim.length; i++){
			if(turnOrderPrelim[i].speed > highest){
				highestIndex = i;
				highest = turnOrderPrelim[i].speed;
			}
		}
		turnOrder.push(turnOrderPrelim[highestIndex]);
		turnOrderPrelim.splice(highestIndex, 1);
	}
	// set up enemy idle animations
	// set up player idle animations
	drawTransition(openBattlefield);
}



function beginTurnRotation(){
	console.log("Begin turn " + currentTurn)
	// reset current turn to zero
	if(currentTurn > turnOrder.length){
		currentTurn = 0;
	}
	// check if all enemies dead
	var enemiesRemaining = 0;
	for(i = 0; i < enemyTeam.length; i++){
		if(enemyTeam[i].hpCurr > 0){
			enemiesRemaining++;
		}
	}
	console.log("Enemies remaining: " + enemiesRemaining);
	if(enemiesRemaining === 0){
		return endEncounter();
	}
	// return player or enemy turns
	if(turnOrder[currentTurn].type === "player"){
		return playerTurn();
	}
	if(turnOrder[currentTurn].type === "enemy" && turnOrder[currentTurn].hpCurr > 0){
		return enemyTurn(turnOrder[currentTurn].position);
	}
}

function playerTurn(){
	console.log("Player turn");
	// currentTurn++;
	// beginEncounter();
}

function enemyTurn(position){
	console.log("Enemy turn");
	// currentTurn++;
	// beginEncounter();
}

function endEncounter(){
	openWorldMap()
}










function openBattlefield(){
	$("#world-map").addClass("hidden");
	$("#battlefield").removeClass("hidden");
	beginTurnRotation();
}

function openWorldMap(){
	$("#battlefield").addClass("hidden");
	$("#world-map").removeClass("hidden");
	movementOn = true;
}







////////////////////////////////////////////////////////
// 05 - Map and overworld movement
////////////////////////////////////////////////////////
var map = [
	[ // room 0
		[0, 0, 1, 0, 0, 0, 1, 0, 0, "D01A", 1, 0, 0, 0, 0, 1],
		[0, "E00", 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
		[1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
		[1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
		[0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0],
		[0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
		[1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
		[1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
		[0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1],
		[0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	[ // room 1
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0, 2, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0, 1, 0, 0],
		["D00A", 0, 0, 1, 1, 0, 0, 0]
	]
];

function unitSize(){
	if(800/map[room][0].length === 600/map[room].length){
		return 600/map[room].length;
	}
	else{
		return console.log("Units are not square!");
	}
}

function drawMap(){
	var ctx = $("#map-canvas")[0].getContext("2d");
	ctx.clearRect(0, 0, 800, 600);
	for(row = 0; row < map[room].length; row++){
		for(col = 0; col < map[room][row].length; col ++){
			if(map[room][row][col] === 1){
				ctx.fillStyle = "black";
				ctx.fillRect(col*unitSize(), row*unitSize(), unitSize(), unitSize());
			}
			else if(map[room][row][col] === 2){
				ctx.fillStyle = "cornflowerblue";
				ctx.fillRect(col*unitSize(), row*unitSize(), unitSize(), unitSize());
			}
			else if(typeof(map[room][row][col]) === "string"){
				if(map[room][row][col].charAt(0) === "D"){
					ctx.fillStyle = "brown";
					ctx.fillRect(col*unitSize(), row*unitSize(), unitSize(), unitSize());
				}
			}
		}
	}
}

function drawPlayer(){
	var ctx = $("#player-canvas")[0].getContext("2d");
	ctx.clearRect(0, 0, 800, 600);
	ctx.fillStyle = "red";
	ctx.drawImage(playerIcon, player.step*50, player.direction*50, 50, 50, player.x*unitSize(), player.y*unitSize(), unitSize(), unitSize());
}

function hidePlayer(){
	var ctx = $("#player-canvas")[0].getContext("2d");
	ctx.clearRect(0, 0, 800, 600);
}

function drawTransition(addFunc){
	movementOn = false;
	var ctx = $("#transition-canvas")[0].getContext("2d");
	ctx.fillStyle = "cornflowerblue";
	transitionCount = 0;
	var transition = setInterval(function(){
		transitionCount++;
		ctx.beginPath();
		ctx.moveTo(400, 300);
		ctx.arc(400, 300, 500, 0, transitionCount*0.1*Math.PI);
		ctx.lineTo(400, 300);
		ctx.fill();
		if(transitionCount === 23){
			clearInterval(transition)
			transitionCount = 10;
			addFunc()
			transition = setInterval(function(){
				transitionCount -= 1;
				ctx.clearRect(0, 0, 800, 600);
				ctx.globalAlpha = transitionCount/10;
				ctx.fillRect(0, 0, 800, 600);
				if(transitionCount <= 0){
					clearInterval(transition);
					ctx.globalAlpha = 1;
					transitionCount = 0;
					movementOn = true;
				}
			}, 50);
		}
	}, 50);
}

function movePlayer(xAxis, yAxis){
	if(player.y + yAxis < map[room].length && player.y + yAxis >= 0){
		if(map[room][player.y + yAxis][player.x + xAxis] === 0 ||
			map[room][player.y + yAxis][player.x + xAxis] === 2 ||
			typeof(map[room][player.y + yAxis][player.x + xAxis]) === "string")
		{
			movementOn = false;
			var moveCount = 0;
			var aniPlayerIcon = setInterval(function(){
				moveCount += 1;
				player.x += xAxis/10;
				player.y += yAxis/10;
				if(moveCount > 2 && moveCount < 8){
					player.step = 1;
				}
				else if(moveCount === 10){
					clearInterval(aniPlayerIcon);
					player.x = Math.round(player.x);
					player.y = Math.round(player.y);
					checkPlayerTerrain();
				}
				else{
					player.step = 0;
				}
				drawPlayer()
			}, 20);
		}
	}
}

function checkPlayerTerrain(){
	var terrain = map[room][player.y][player.x];
	// if(terrain === 2){
	// 	drawTransition();
	// }
	if(typeof(terrain) === "string"){
		if(terrain.charAt(0) === "D"){
			openDoor(Number(terrain.charAt(1) + terrain.charAt(2)), terrain.charAt(3))
		}
		if(terrain.charAt(0) === "E"){
			beginEncounter(Number(terrain.charAt(1) + terrain.charAt(2)));
		}
	}
	else{
		movementOn = true;
	}
}

function openDoor(newRoom, door){
	movementOn = false;
	for(row = 0; row < map[newRoom].length; row++){
		for(col = 0; col < map[newRoom][row].length; col++){
			if(typeof(map[newRoom][row][col]) === "string"){
				if(map[newRoom][row][col].charAt(0) === "D"){
					if(map[newRoom][row][col].charAt(3) === door){
						var newRow = row;
						var newCol = col;
						// begin transition animation
						var ctx = $("#transition-canvas")[0].getContext("2d");
						ctx.fillStyle = "gray";
						transitionCount = 0;
						var transition = setInterval(function(){
							ctx.fillRect(0, 0, transitionCount*30, 600);
							transitionCount += 1;
							if((transitionCount - 1)*30 >= 800){
								clearInterval(transition);
								transitionCount = 0;
								room = newRoom;
								drawMap();
								player.x = newCol;
								player.y = newRow;
								drawPlayer();
								transition = setInterval(function(){
									ctx.clearRect(0, 0, transitionCount*30, 600);
									transitionCount += 1;
									if((transitionCount - 1)*30 >= 800){
										clearInterval(transition);
										transitionCount = 0;
										movementOn = true;
									}
								}, 20);
							}
						}, 20);
					}
				}
			}
		}
	}
}

// Movement keys
$(window).keydown(function(event){
	if([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
		event.preventDefault();
	}
	keyState[event.keyCode || event.which] = true;
});

$(window).keyup(function(event){
	keyState[event.keyCode || event.which] = false;
});

function checkKeyPress(){
	if(movementOn === true){
		if (keyState[37] || keyState[65]){
			player.direction = 0;
			movePlayer(-1, 0);
		}    
		else if (keyState[39] || keyState[68]){
			player.direction = 2;
			movePlayer(1, 0);
		}
		else if (keyState[38] || keyState[87]){
			player.direction = 1;
			movePlayer(0, -1);
		}
		else if (keyState[40] || keyState[83]){
			player.direction = 3;
			movePlayer(0, 1);
		}
	}
	setTimeout(checkKeyPress, 10);
}

// Prevent arrow keys from scrolling down
// http://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser



////////////////////////////////////////////////////////
// 06 - Load screen and initialize
////////////////////////////////////////////////////////
function drawLoadScreen(){
	var ctx = $("#load-canvas")[0].getContext("2d");
	ctx.fillStyle = "burlyWood";
	ctx.fillRect(0, 0, 800, 600);
	ctx.font = "42px Arial";
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	ctx.fillText("PATH OF THE KING", 400, 200);
	ctx.font = "24px Arial";
	ctx.fillText("Click anywhere to begin", 400, 300);
	$("#load-canvas").on("click", function(){
		loadGame();
		ctx.fillText("Loading...", 400, 400);
		setTimeout(function(){
			$("#load-canvas").addClass("hidden");
		}, 100);
	});
}

function loadGame(){
	drawMap();
	drawPlayer();
	checkKeyPress();
}

// Initialize
drawLoadScreen();
