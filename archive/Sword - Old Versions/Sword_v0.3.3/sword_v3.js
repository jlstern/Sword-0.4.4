// THINGS TO FIX
// add table of contents

/////////////////////////////////
// Table of Contents
// 001 - Setup HUD
// 002 - Hero variables and functions
// 003 - Player attack sequence
// 004 - Enemy variables and functions
// 005 - Enemy attack sequence
// 006 - List of encounters
// 007 - Encounter setup
// 008 - Begin encounter
// 009 - Set images and animate
/////////////////////////////////

/////////////////////////////////
// 001 - Setup HUD             //
/////////////////////////////////
// Hero
var heroNameHUD = document.querySelectorAll(".heroName");
var hpCurrentHUD = document.querySelectorAll(".hpCurrent");
var hpTotalHUD = document.querySelectorAll(".hpTotal");
var mpCurrentHUD = document.querySelectorAll(".mpCurrent");
var mpTotalHUD = document.querySelectorAll(".mpTotal");
var speedHUD = document.querySelectorAll(".speed");
var wepDefHUD = document.querySelectorAll(".wepDef");
var magDefHUD = document.querySelectorAll(".magDef");
var statusHUD = document.querySelectorAll(".status");
var levelHUD = document.querySelectorAll(".level");
var expToLvllHUD = document.querySelectorAll(".expToLvl");
var heroCanvas = document.querySelectorAll(".heroCanvas");

// Enemies
var enemyNameHUD = document.querySelectorAll(".enemyName");
var enemyHPCurrentHUD = document.querySelectorAll(".enemyHPCurrent");
var enemyHPTotalHUD = document.querySelectorAll(".enemyHPTotal");
var enemySpeedHUD = document.querySelectorAll(".enemySpeed");
var enemyWepDefHUD = document.querySelectorAll(".enemyWepDef");
var enemyMagDefHUD = document.querySelectorAll(".enemyMagDef");
var enemyStatusHUD = document.querySelectorAll(".enemyStatus");
var enemyTarget = document.querySelectorAll(".enemyTarget");
var enemyCanvas = document.querySelectorAll(".enemyCanvas");

// Interface
var statCanvas = document.querySelector("#statCanvas");


/////////////////////////////////
// Event Listeners             //
/////////////////////////////////
function turnOnAttackButtons(){
	document.querySelector("#buttonSlice").addEventListener("click", playerSlice);
	document.querySelector("#buttonFireball").addEventListener("click", playerFireball);
	document.querySelector("#buttonHeal").addEventListener("click", playerHeal);
}

function turnOffAttackButtons(){
	document.querySelector("#buttonSlice").removeEventListener("click", playerSlice);
	document.querySelector("#buttonFireball").removeEventListener("click", playerFireball);
	document.querySelector("#buttonHeal").removeEventListener("click", playerHeal);
}

/////////////////////////////////
// 002 - Hero variables & functions  //
/////////////////////////////////
var hero = {
	name: "Warrior",
	type: "hero",
	hpCurrent: 25,
	hpTotal: 25,
	mpCurrent: 10,
	mpTotal: 10,
	mpRegen: 1,
	speed: 2,
	wepDef: 0,
	magDef: 0,
	exp: 0,
	level: 1,
	attackList: ["slice", "fireball", "heal"],
}

// key: ["Name", damage, mpcost, type]
function playerSlice(){
	playerAttack("Slice", 5, 0, "physical");
}

function playerFireball(){
	playerAttack("Fireball", 9, 4, "magic");
}

function playerHeal(){
	if(hero.mpCurrent - 5 < 0){
		alert("Not enough magic!");
	} else{
		hero.mpCurrent -= 5;
		if(hero.hpCurrent + 10 > hero.hpTotal){
			hero.hpCurrent = hero.hpTotal;
		} else{
			hero.hpCurrent += 10;
		}
		refreshHeroDisplay();
		console.log("Player healed 10 hp");
		currentTurn += 1;
		beginTurnRotation();
	}
}

function refreshHeroDisplay(){
	heroNameHUD[0].innerHTML = hero.name;
	hpCurrentHUD[0].innerHTML = hero.hpCurrent;
	hpTotalHUD[0].innerHTML = hero.hpTotal;	
	mpCurrentHUD[0].innerHTML = hero.mpCurrent;
	mpTotalHUD[0].innerHTML = hero.mpTotal;
	speedHUD[0].innerHTML = hero.speed;
	wepDefHUD[0].innerHTML = hero.wepDef;
	magDefHUD[0].innerHTML = hero.magDef;
	levelHUD[0].innerHTML = hero.level;
	expToLvllHUD[0].innerHTML = expToLevelCalculate();
}

function expToLevelCalculate(){
	// to modify for multiple heroes, add in argument for function
	if(hero.level === 1){
		return 5 - hero.exp;
	}
	if(hero.level === 2){
		return 15 - hero.exp;
	}
	if(hero.level === 3){
		return 30 - hero.exp;
	}
	if(hero.level === 4){
		return 50 - hero.exp;
	}
	if(hero.level === 5){
		return "Max level!";
	}
}

/////////////////////////////////
// 003 - Player attack sequence  //
/////////////////////////////////
var attackName = 0;
var attackDamage = 0;
var attackMPCost = 0;
var attackType = 0;

function playerAttack(name, damage, mpcost, type){
	console.log("Attack selected: " + name)
	attackName = name;
	attackDamage = damage;
	attackMPCost = mpcost;
	attackType = type;
	turnOnTargetButtons();
}

function turnOnTargetButtons(){
	if(enemyTeam[0].hpCurrent > 0){
		enemyTarget[0].addEventListener("click", setTarget0);
	}
	if(enemyTeam.length > 1){
		if(enemyTeam[1].hpCurrent > 0){
			enemyTarget[1].addEventListener("click", setTarget1);
		}
	}
	if(enemyTeam.length > 2){
		if(enemyTeam[2].hpCurrent > 0){
			enemyTarget[2].addEventListener("click", setTarget2);
		}
	}
	if(enemyTeam.length > 3){
		if(enemyTeam[3].hpCurrent > 0){
			enemyTarget[3].addEventListener("click", setTarget3);
		}
	}
}

function turnOffTargetButtons(){
	enemyTarget[0].removeEventListener("click", setTarget0);
	enemyTarget[1].removeEventListener("click", setTarget1);
	enemyTarget[2].removeEventListener("click", setTarget2);
	enemyTarget[3].removeEventListener("click", setTarget3);
}

function setTarget0(){
	executeAttack(0);
}
function setTarget1(){
	executeAttack(1);
}
function setTarget2(){
	executeAttack(2);
}
function setTarget3(){
	executeAttack(3);
}

function executeAttack(target){
	if(hero.mpCurrent - attackMPCost < 0){
		return alert("Not enough magic!")
	}
	turnOffAttackButtons();
	turnOffTargetButtons();
	console.log("Player used " + attackName + " on " + enemyTeam[target].name);
	hero.mpCurrent -= attackMPCost;
	refreshHeroDisplay();
	var initEnemyHP = enemyTeam[target].hpCurrent;
	// animate
	if(attackType === "physical"){
		if(enemyTeam[target].hpCurrent - Math.floor(attackDamage * ((100 - enemyTeam[target].wepDef) / 100)) < 0){
			enemyTeam[target].hpCurrent = 0;
		} else{
			enemyTeam[target].hpCurrent -= Math.floor(attackDamage * ((100 - enemyTeam[target].wepDef) / 100));
		}
	}
	else if(attackType === "magic"){
		if(enemyTeam[target].hpCurrent - Math.floor(attackDamage * ((100 - enemyTeam[target].magDef) / 100)) < 0){
			enemyTeam[target].hpCurrent = 0;
		} else{
			enemyTeam[target].hpCurrent -= Math.floor(attackDamage * ((100 - enemyTeam[target].magDef) / 100));
		}
	}
	else{
		return alert("error! -- attack has no type")
	}
	refreshEnemyDisplay();
	console.log(attackName + " did " + (initEnemyHP - enemyTeam[target].hpCurrent) + " damage");
	if(enemyTeam[target].hpCurrent === 0){
		console.log(enemyTeam[target].name + " has been killed!");
		enemyTarget[target].src = "";
		expGain(enemyTeam[target].exp);

	}
	currentTurn += 1;
	beginTurnRotation();
}

function expGain(value){
	var initLevel = hero.level
	hero.exp += value;
	if(hero.exp >= 5 && hero.level <= 1){
		hero.level = 2;
	}
	if(hero.exp >= 15 && hero.level <= 2){
		hero.level = 3;
	}
	if(hero.exp >= 30 && hero.level <= 3){
		hero.level = 4;
	}
	if(hero.exp >= 50 && hero.level <= 4){
		hero.level = 5;
	}
	refreshHeroDisplay();
	console.log("Player gains " + value + " exp")
	if(hero.level > initLevel){
		console.log("Player grew to level " + hero.level)
	}
}

/////////////////////////////////
// 004 - Enemy variables & functions //
/////////////////////////////////
var enemy = [
	{
		index: 0,
		name: "placeholder",
		type: "enemy",
		hpCurrent: 0,
		hpTotal: 0,
		speed: 0,
		wepDef: 0,
		magDef: 0,
		attackChance: [],
		attackList: [],
		attackDamage: [],
		attackType: [],
		attackSpecial: [],
		exp: 0,
		location: 0,
		src: []
	},
	{
	index: 1,
	name: "Goblin",
	type: "enemy",
	hpCurrent: 10,
	hpTotal: 10,
	speed: 1,
	wepDef: 0,
	magDef: 0,
	attackChance: [20, 100],
	attackList: ["Squeal", "Axe Swing"],
	attackDamage: [2, 4],
	attackType: ["magic", "physical"],
	attackSpecial: [false, false, false],
	exp: 1,
	location: 0,
	},
	{
	index: 2,
	name: "Bird",
	type: "enemy",
	hpCurrent: 5,
	hpTotal: 5,
	speed: 4,
	wepDef: 50,
	magDef: 0,
	attackChance: [10, 45, 100],
	attackList: ["Fly Away", "Peck", "Flap"],
	attackDamage: [0, 4, 3],
	attackType : ["magic", "physical", "physical"],
	attackSpecial: [enemyFlyAway, false, false],
	exp: 2,
	location: 0,
	}
];

function enemyFlyAway(userLocation){
	enemyTeam[userLocation].hpCurrent = 0;
	console.log("Enemy flew away!")
}

/////////////////////////////////
// 005 - Enemy attack sequence      //
/////////////////////////////////

function randomNumber(){
	return Math.ceil(Math.random() * 100)
}

function enemyTurn(enemyID, userLocation){ // index of var enemy
	if(enemyTeam[userLocation].hpCurrent != 0){
		console.log(enemy[enemyID].name + "'s turn");
		var random = randomNumber();
		for(i = 0; i < enemy[enemyID].attackChance.length; i++){
			if(random <= enemy[enemyID].attackChance[i]){
				console.log(enemy[enemyID].name + " used " + enemy[enemyID].attackList[i]);
				return enemyAttack(enemy[enemyID].attackList[i], enemy[enemyID].attackDamage[i], enemy[enemyID].attackType[i], enemy[enemyID].attackSpecial[i], userLocation);
			}
		}
	} else{
		console.log(enemy[enemyID].name + " is dead and passes turn");
		currentTurn += 1;
		beginTurnRotation();
	}
}

function enemyAttack(name, damage, type, special, userLocation){
	var initHeroHP = hero.hpCurrent;
	if(type === "physical"){
		if(hero.hpCurrent - Math.floor(damage * ((100 - hero.wepDef) / 100)) < 0){
			hero.hpCurrent = 0;
		}
		else{
			hero.hpCurrent -= Math.floor(damage * ((100 - hero.wepDef) / 100));
		}
	}
	else if(type === "magic"){
		if(hero.hpCurrent - Math.floor(damage * ((100 - hero.magDef) / 100)) < 0){
			hero.hpCurrent = 0;
		}
		else{
			hero.hpCurrent -= Math.floor(damage * ((100 - hero.magDef) / 100));
		}
	}
	if(special != false){
		special(userLocation);
	}
	refreshHeroDisplay();
	refreshEnemyDisplay();
	console.log(name + " did " + (initHeroHP - hero.hpCurrent) + " damage");
	if(hero.hpCurrent <= 0){
		console.log("GAME OVER!");
	}
	else{
		currentTurn += 1;
		beginTurnRotation();
	}
}

/////////////////////////////////
// 006 - List of encounters    //
/////////////////////////////////
var encounterNumber = 0;
var encounterMasterList = [
	[1, 2, 0, 0],
	[1, 1, 1, 1],
];

/////////////////////////////////
// 007 - Encounter setup       //
/////////////////////////////////
var enemyTeam = [];
function setEnemyTeam(){
	enemyTeam = [
		Object.assign({}, enemy[encounterMasterList[encounterNumber][0]]),
		Object.assign({}, enemy[encounterMasterList[encounterNumber][1]]),
		Object.assign({}, enemy[encounterMasterList[encounterNumber][2]]),
		Object.assign({}, enemy[encounterMasterList[encounterNumber][3]])
	];
	for(i = 0; i < enemyTeam.length; i++){
		enemyTeam[i].location = i;
		enemyNameHUD[i].innerHTML = enemyTeam[i].name;
		enemyHPCurrentHUD[i].innerHTML = enemyHPTotalHUD[i].innerHTML = enemyTeam[i].hpCurrent;
		enemySpeedHUD[i].innerHTML = enemyTeam[i].speed;
		enemyWepDefHUD[i].innerHTML = enemyTeam[i].wepDef;
		enemyMagDefHUD[i].innerHTML = enemyTeam[i].magDef;
	}
	setTurnOrder();
}

function refreshEnemyDisplay(){
	for(i = 0; i < enemyTeam.length; i++){
		enemyHPCurrentHUD[i].innerHTML = enemyTeam[i].hpCurrent;
		enemySpeedHUD[i].innerHTML = enemyTeam[i].speed;
		enemyWepDefHUD[i].innerHTML = enemyTeam[i].wepDef;
		enemyMagDefHUD[i].innerHTML = enemyTeam[i].magDef;
	}
}

/////////////////////////////////
// 008 - Begin encounter       //
/////////////////////////////////
// Set turn order (DONNNEEEE!!!)
var turnOrderPrelim = [];
var turnOrder = [];

function setTurnOrder(){
	turnOrderPrelim = [hero];
	turnOrder = [];
	for(i = 0; i < enemyTeam.length; i++){
		turnOrderPrelim.push(enemyTeam[i])
	}
	while(turnOrderPrelim.length > 0){
		var highest = turnOrderPrelim[0].speed;
		var highestIndex = 0;
		for(i = 1; i < turnOrderPrelim.length; i++){
			if(turnOrderPrelim[i].speed > highest){
				highestIndex = i;
				highest = turnOrderPrelim[i].speed;
			}
		}
		turnOrder.push(turnOrderPrelim[highestIndex]);
		turnOrderPrelim.splice(highestIndex, 1);
	}
	beginTurnRotation();
}

var encounterActive = false;
var currentTurn = 0;

function beginTurnRotation(){
	if(checkIfAllEnemiesDead() === 0){
		encounterActive = false;
		console.log("End of encounter");
		encounterNumber += 1;
		return alert("Encounter complete!");
	}
	encounterActive = true;
	while(currentTurn < turnOrder.length){
		if(turnOrder[currentTurn].type === "hero"){
			return playerTurn();
		} else{
			return enemyTurn(turnOrder[currentTurn].index, turnOrder[currentTurn].location);
		}
	}
	if(encounterActive === true){
		console.log("End of turn cycle")
		currentTurn = 0;
		beginTurnRotation();
	}
}

// Set turn types
function playerTurn(){
	if(hero.mpCurrent + hero.mpRegen > hero.mpTotal){
		hero.mpCurrent = hero.mpTotal;
	} else{
		hero.mpCurrent += hero.mpRegen;
	}
	refreshHeroDisplay();
	console.log("Player regenerated " + hero.mpRegen + " magic")
	console.log("Player's turn");
	turnOnAttackButtons();
}

function checkIfAllEnemiesDead(){
	var heartbeat = 0;
	for(i = 0; i < enemyTeam.length; i++){
		if(enemyTeam[i].hpCurrent > 0){
			heartbeat += 1;
		}
	}
	return heartbeat
}

/////////////////////////////////
// 009 - Setup images and animate //
/////////////////////////////////

// HERO FRAME SETUP
var heroFrame = new Image(2400, 200);
heroFrame.src = "images/player/player_strip.png";

function heroIdleAnimation(){
	var f = 0;
	var animateHero = setInterval(function(){
	heroGetFrame(f);
	f += 1;
	if(f > 3){
		f = 0;
	}
	}, 300); 
}

function heroGetFrame(frame){
	var ctx = heroCanvas[0].getContext("2d");
	ctx.clearRect(0, 0, 800, 200);
// dragImage(img, sourcex, sourcey, sourcewidth, sourceheight, destx, desty, destwidth, destheight)
	ctx.drawImage(heroFrame, frame * 200 + 1600, 0, 200, 200, 0, 0, 200, 200)
}


// ENEMY FRAME SETUP
var enemyFrame = [];
// 0
var placeholderFrames = new Image(2400, 200);
placeholderFrames.src = "images/placeholder/placeholder_strip.png";
enemyFrame.push(placeholderFrames);
// 1
var goblinFrames = new Image(2400, 200);
goblinFrames.src = "images/goblin/goblin_strip.png";
enemyFrame.push(goblinFrames);
// 2
var birdFrames = new Image(2400, 200);
birdFrames.src = "images/bird/bird_strip.png";
enemyFrame.push(birdFrames);





function enemyIdleAnimation(){
	var f = 0;
	var animateEnemy = setInterval(function(){
		enemyGetFrame(f);
		f += 1;
		if(f > 3){
		f = 0;
		}
	}, 300); 
}

function enemyGetFrame(frame){
	for(i = 0; i < enemyTeam.length; i++){
		var ctx = enemyCanvas[i].getContext("2d");
		ctx.clearRect(0, 0, 800, 200);
// dragImage(img, sourcex, sourcey, sourcewidth, sourceheight, destx, desty, destwidth, destheight)
		if(enemyTeam[i].hpCurrent > 0){
			ctx.drawImage(enemyFrame[enemyTeam[i].index], frame * 200, 0, 200, 200, 180 + i * 130, 0, 200, 200);
		}
	}
}


// Set background

var backgroundFrame = new Image(150, 400);
function setBackground(){
	var canvas = document.querySelector("#background");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, 800, 400);
	for(i = 0; i < 6; i++){
		ctx.drawImage(backgroundFrame, 0, 0, 150, 400, i * 150, 0, 150, 400);
	}
}
backgroundFrame.onload = setBackground();
backgroundFrame.src = "images/background/castlewall.png";
/////////////////////////////////
// 010 - User interface        //
/////////////////////////////////
var statBoxImage = new Image(258, 73);
function setStatBox(){
	statBoxImage.src = "images/other/hero_stat_banner.png";
	var ctx = statCanvas.getContext("2d");
	ctx.drawImage(statBoxImage, 0, 0, 258, 73, 0, 0, 258, 73);
}


/////////////////////////////////
// Initialize                  //
/////////////////////////////////
refreshHeroDisplay();
setEnemyTeam();
enemyIdleAnimation();
heroIdleAnimation();




