/////////////////////////////////
// Setup HUD                   //
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

// Enemies
var enemyNameHUD = document.querySelectorAll(".enemyName");
var enemyHPCurrentHUD = document.querySelectorAll(".enemyHPCurrent");
var enemyHPTotalHUD = document.querySelectorAll(".enemyHPTotal");
var enemySpeedHUD = document.querySelectorAll(".enemySpeed");
var enemyWepDefHUD = document.querySelectorAll(".enemyWepDef");
var enemyMagDefHUD = document.querySelectorAll(".enemyMagDef");
var enemyStatusHUD = document.querySelectorAll(".enemyStatus");
var enemyTarget = document.querySelectorAll(".enemyTarget");
/////////////////////////////////
// Event Listeners             //
/////////////////////////////////
function turnOnAttackButtons(){
	document.querySelector("#buttonSlice").addEventListener("click", function(){
		playerAttack(heroAttacks.slice[0], heroAttacks.slice[1], heroAttacks.slice[2])
	});
	document.querySelector("#buttonFireball").addEventListener("click", function(){
		playerAttack(heroAttacks.fireball[0], heroAttacks.fireball[1], heroAttacks.fireball[2])
	});
	document.querySelector("#buttonHeal").addEventListener("click", function(){
		console.log("Heal")
	});
}

function turnOffAttackButtons(){
	document.querySelector("#buttonSlice").removeEventListener("click", function(){
		playerAttack(heroAttacks.slice[0], heroAttacks.slice[1], heroAttacks.slice[2])
	});
	document.querySelector("#buttonFireball").removeEventListener("click", function(){
		playerAttack(heroAttacks.fireball[0], heroAttacks.fireball[1], heroAttacks.fireball[2])
	});
	document.querySelector("#buttonHeal").removeEventListener("click", function(){
		console.log("Heal")
	});
}

////////////////////

var targetIndex = 0; // BROKEN -- NEEDS TO BE FIXED

function turnOnTargetButtons(){
	enemyTarget[0].addEventListener("click", function(){
		executeAttack(0); // i corresponds to the targets location in enemyTeam
	});
	if(enemyTeam.length > 1){
		enemyTarget[1].addEventListener("click", function(){
			executeAttack(1);
		});
	}
	if(enemyTeam.length > 2){
		enemyTarget[2].addEventListener("click", function(){
			executeAttack(2);
		});
	}
	if(enemyTeam.length > 3){
		enemyTarget[3].addEventListener("click", function(){
			executeAttack(3);
		});
	}
}


function turnOffTargetButtons(){

}

/////////////////////////////////
// Hero variables & functions  //
/////////////////////////////////
var hero = {
	name: "Warrior",
	type: "hero",
	hpCurrent: 25,
	hpTotal: 25,
	mpCurrent: 10,
	mpTotal: 10,
	speed: 2,
	wepDef: 0,
	magDef: 0,
	exp: 0,
	level: 1,
	attackList: ["slice", "fireball", "heal"]
}

var heroAttacks = {
	// key: ["Name", damage, mpcost]
	slice: ["Slice", 5, 0],
	fireball: ["Fireball", 7, 3]
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
	expToLvllHUD[0].innerHTML = "###";
}

var attackName = 0;
var attackDamage = 0;
var attackMPCost = 0;



function playerAttack(name, damage, mpcost){
	console.log("Attack selected: " + name)
	attackName = name;
	attackDamage = damage;
	attackMPCost = mpcost;
	turnOnTargetButtons();
}

function executeAttack(target){
	if(hero.mpCurrent - attackMPCost < 0){
		return alert("Not enough magic!")
	}
	turnOffAttackButtons();
	turnOffTargetButtons();
	console.log("Player used " + attackName + " on " + enemyTeam[target].name);
	hero.mpCurrent - attackMPCost;
	refreshHeroDisplay();
	// animate
	if(enemyTeam[target].hpCurrent - attackDamage < 0){
		hpCurrent = 0;
	} else{
		enemyTeam[target].hpCurrent -= attackDamage;
	}
	refreshEnemyDisplay();
	// check to see if enemy is dead
	// check to see if all enemies are dead, if not...
	// currentTurn += 1;
	// beginTurnRotation();
}

/////////////////////////////////
// Enemy variables & functions //
/////////////////////////////////
var enemy = [
	{
	index: 0,
	name: "Goblin",
	type: "enemy",
	hpCurrent: 10,
	hpTotal: 10,
	speed: 1,
	wepDef: 0,
	magDef: 0,
	attackChance: [20, 100],
	attackList: ["squeal", "punch"],
	exp: 1,
	location: 0
	},
	{
	index: 1,
	name: "Ghoul",
	type: "enemy",
	hpCurrent: 5,
	hpTotal: 5,
	speed: 3,
	wepDef: 100,
	magDef: 25,
	attackChance: [10, 45, 100],
	attackList: ["expire", "haunt", "spook"],
	exp: 1,
	location: 0
	}
];


/////////////////////////////////
// Set enemy team              //
/////////////////////////////////
var enemyTeam = [];
function setEnemyTeam(){
	enemyTeam = [Object.assign({}, enemy[0]), Object.assign({}, enemy[1])];
	for(i = 0; i < enemyTeam.length; i++){
		enemyTeam[i].location = i;
		enemyNameHUD[i].innerHTML = enemyTeam[i].name;
		enemyHPCurrentHUD[i].innerHTML = enemyHPTotalHUD[i].innerHTML = enemyTeam[i].hpCurrent;
		enemySpeedHUD[i].innerHTML = enemyTeam[i].speed;
		enemyWepDefHUD[i].innerHTML = enemyTeam[i].wepDef;
		enemyMagDefHUD[i].innerHTML = enemyTeam[i].magDef;
	}
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
// Begin encounter             //
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
	encounterActive = true;
	while(currentTurn < turnOrder.length){
		if(turnOrder[currentTurn].type === "hero"){
			return playerTurn();
		} else{
			return enemyTurn(turnOrder[currentTurn].index);
		}
	}
	if(encounterActive === true){
		console.log("End of turn cycle")
		currentTurn = 0;
		// beginTurnRotation(currentTurn);
	}
}

// Set turn types
function playerTurn(){
	console.log("Player turn");
	turnOnAttackButtons();
	// currentTurn += 1;
	// beginTurnRotation();
}


function enemyTurn(index){
	console.log("Enemy turn");
	currentTurn += 1;
	beginTurnRotation();
}

/////////////////////////////////
// Initialize                  //
/////////////////////////////////
refreshHeroDisplay();
setEnemyTeam();
setTurnOrder();

