var map = 
[[ // room 0
	[0, 0, 1, 0, 0, 0, 1, 0, 0, "D01A", 1, 0, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
	[1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	[1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	[0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0],
	[0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
	[1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	[1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
	[0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
],
[ // room 1
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 1, 0, 0, 2, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 1, 0, 0, 1, 0, 0],
	["D00A", 0, 0, 1, 1, 0, 0, 0]
]];

var room = 0;

var player = {
	x: 0,
	y: 0,
	terrain: 0
}
	
movementOn = true;
// animation
var aniPlayerMove;


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
				ctx.fillStyle = "brown";
				ctx.fillRect(col*unitSize(), row*unitSize(), unitSize(), unitSize());
			}
		}
	}
}

function drawPlayer(){
	var ctx = $("#player-canvas")[0].getContext("2d");
	ctx.clearRect(0, 0, 800, 600);
	ctx.fillStyle = "red";
	ctx.fillRect(player.x*unitSize(), player.y*unitSize(), unitSize(), unitSize());
}

function clearPlayer(){
	var ctx = $("#player-canvas")[0].getContext("2d");
	ctx.clearRect(0, 0, 800, 600);
}

var transitionCount = 0;
function drawTransition(){
	movementOn = false;
	var ctx = $("#transition-canvas")[0].getContext("2d");
	ctx.fillStyle = "cornflowerblue";
	transitionCount = 0;
	aniTransition = setInterval(function(){
		transitionCount++;
		ctx.moveTo(400, 300);
		ctx.arc(400, 300, 500, 0, transitionCount*0.1*Math.PI);
		ctx.lineTo(400, 300);
		ctx.fill();
		if(transitionCount === 23){
			clearInterval(aniTransition)
			transitionCount = 10;
			// add scene change here
			aniTransition = setInterval(function(){
				transitionCount -= 1;
				ctx.clearRect(0, 0, 800, 600);
				ctx.globalAlpha = transitionCount/10;
				ctx.fillRect(0, 0, 800, 600);
				if(transitionCount <= 0){
					clearInterval(aniTransition);
					ctx.globalAlpha = 1;
					console.log("test")
					// ctx.clearRect(0, 0, 800, 600);
					transitionCount = 0;
					return movementOn = true;
				}
			}, 50);
		}
	}, 50);

	// transitionCount++
	// if(transitionCount === 23){
	// 	transitionCount = 0;
	// 	var ctx = $("#player-canvas")[0].getContext("2d");
	// 	ctx.clearRect(0, 0, 800, 600);
	// }
	// else{
	// 	setTimeout(drawTransition, 50);
	// }
}

function movePlayer(xAxis, yAxis){
	if(player.y + yAxis < map[room].length && player.y + yAxis >= 0){
		if(map[room][player.y + yAxis][player.x + xAxis] === 0 ||
			map[room][player.y + yAxis][player.x + xAxis] === 2 ||
			typeof(map[room][player.y + yAxis][player.x + xAxis]) === "string")
		{
			movementOn = false;
			var moveCount = 0;
			aniPlayerMove = setInterval(function(){
				moveCount += 1;
				player.x += xAxis/10;
				player.y += yAxis/10;
				drawPlayer();
				if(moveCount === 10){
					clearInterval(aniPlayerMove);
					player.x = Math.round(player.x);
					player.y = Math.round(player.y);
					drawPlayer();
					checkPlayerTerrain();
				}
			}, 20);
		}
	}
}

function checkPlayerTerrain(){
	var terrain = map[room][player.y][player.x];
	if(terrain === 2){
		// movementOn = false;
		drawTransition();
	}
	else if(typeof(terrain) === "string"){
		if(terrain.charAt(0) === "D"){
			openDoor(Number(terrain.charAt(1) + terrain.charAt(2)), terrain.charAt(3))
		}
	}
	else{
		movementOn = true;
	}
}
var aniTransition
function openDoor(newRoom, door){
	movementOn = false;
	for(row = 0; row < map[newRoom].length; row++){
		for(col = 0; col < map[newRoom][row].length; col++){
			if(typeof(map[newRoom][row][col]) === "string"){
				if(map[newRoom][row][col].charAt(0) === "D"){
					if(map[newRoom][row][col].charAt(3) === door){
						var newRow = row;
						var newCol = col;
						// add transition
						var ctx = $("#transition-canvas")[0].getContext("2d");
						ctx.fillStyle = "gray";
						transitionCount = 0;
						aniTransition = setInterval(function(){
							ctx.fillRect(0, 0, transitionCount*30, 600);
							transitionCount += 1;
							if((transitionCount - 1)*30 >= 800){
								clearInterval(aniTransition);
								transitionCount = 0;
								room = newRoom;
								drawMap();
								player.x = newCol;
								player.y = newRow;
								drawPlayer();
								aniTransition = setInterval(function(){
									ctx.clearRect(0, 0, transitionCount*30, 600);
									console.log(transitionCount);
									transitionCount += 1;
									if((transitionCount - 1)*30 >= 800){
										clearInterval(aniTransition);
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


// movement keys

var keyState = {};

$(window).keydown(function(event){
	keyState[event.keyCode || e.which] = true;
});

$(window).keyup(function(event){
	keyState[event.keyCode || event.which] = false;
});

function checkKeyPress(){
	if(movementOn === true){
		if (keyState[37] || keyState[65]){
			movePlayer(-1, 0);
		}    
		else if (keyState[39] || keyState[68]){
			movePlayer(1, 0);
		}
		else if (keyState[38] || keyState[87]){
			movePlayer(0, -1);
		}
		else if (keyState[40] || keyState[83]){
			movePlayer(0, 1);
		}
	}
	setTimeout(checkKeyPress, 10);
}

// initialize
drawMap();
drawPlayer();
checkKeyPress();
