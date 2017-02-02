var map = 
[[ // room 0
	[0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
	[1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	[1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	[0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0],
	[0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	[1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
	[0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
],
[ // room 1
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 1, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 1, 0, 0, 1, 0, 0],
	[0, 0, 0, 1, 1, 0, 0, 0]
]];

var room = 0;

var player = {
	x: 0,
	y: 0,
	terrain: 0
}
	
movementOn = true;

// animation
	var aniPlayerMove



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
	for(row = 0; row < map[room].length; row++){
		for(col = 0; col < map[room][row].length; col ++){
			if(map[room][row][col] === 1){
				ctx.fillStyle = "black";
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

function movePlayer(xAxis, yAxis){
	if(player.y + yAxis < map[room].length &&
		player.y + yAxis >= 0 &&
		map[room][player.y + yAxis][player.x + xAxis] === 0)
	{
		player.x += xAxis;
		player.y += yAxis;
	}
}


// Look here for info
// http://stackoverflow.com/questions/12273451/how-to-fix-delay-in-javascript-keydown

// movement keys
var keyState = {};

$(document).keydown(function(event){
	if(movementOn === true){
		if(event.which === 39 || event.which === 68){ // right 
			movePlayer(1, 0);
		}
		else if(event.which === 37 || event.which === 65){ // left
			movePlayer(-1, 0);
		}
		else if(event.which === 38 || event.which === 87){ // up
			movePlayer(0, -1);
		}
		else if(event.which === 40 || event.which === 83){ // down
			movePlayer(0, 1);
		}
		drawPlayer();
	}
});

// initialize
drawMap();
drawPlayer();

