$(function(){

	var charArr = [
	    {name: "Greedo",
			id: "characterGreedo",
			img: "assets/images/greedo.jpg",
			info: "Poor aim, worse luck.",
	        attackPower: 30,
	        healthPoints: 100,
	        counterAttack: 30},
	    {name: "IG-88",
	    	id: "characterIg88",
	    	img: "assets/images/ig-88.jpg",
	    	info: "Droid extra with a killer backstory.",
	        attackPower: 15,
	        healthPoints: 130,
	        counterAttack: 20},
	    {name: "Sarlacc",
	    	id: "characterSarlacc",
	    	img: "assets/images/sarlacc.png",
	    	info: "Unsung hero of <i>Return of the Jedi</i>.",
	        attackPower: 3,
	        healthPoints: 300,
	        counterAttack: 10},
	    {name: "Tauntaun",
	    	id: "characterTauntaun",
	    	img: "assets/images/tauntaun.jpg",
	    	info: "Loyal in battle, warm in winter.",
	        attackPower: 10,
	        healthPoints: 150,
	        counterAttack: 15},
	    {name: "Droopy McCool",
	    	id: "characterDroopy",
	    	img: "assets/images/droopy.jpg",
	    	info: "Best stage name in the galaxy.",
	        attackPower: 7,
	        healthPoints: 200,
	        counterAttack: 12},
	    {name: "Wicket",
	    	id: "characterWicket",
	    	img: "assets/images/wicket.png",
	    	info: "Has 2 spinoff movies and a TV series.",
	        attackPower: 37,
	        healthPoints: 75,
	        counterAttack: 35},
	],

	advArr = [
	    {name: "Wedge",
	    	id: "characterWedge",
	    	img: "assets/images/wedge.jpg",
	    	info: "Ace pilot of the Rebel Alliance.",
	    	tooltip: "<b>ABILITY:</b> <i>Critical Hits</i>",
	    	specialAttack: "crit",
	    	attackValue: 8,
	    	counterValue: 12,
	        attackPower: 0,
	        healthPoints: 175,
	        counterAttack: 0},
	    {name: "Dathcha",
	    	id: "characterDathcha",
	    	img: "assets/images/dathcha.jpg",
	    	info: "Nobly rescued R2-D2 from the desert.",
	    	tooltip: "<b>ABILITY:</b> <i>Random Damage</i>",
	    	specialAttack: "rand",
	    	attackValue: 10,
	    	counterValue: 20,
	        attackPower: 0,
	        healthPoints: 250,
	        counterAttack: 0},
	    {name: "Lobot",
	    	id: "characterLobot",
	    	img: "assets/images/lobot.jpg",
	    	info: "Lando's right-hand cyborg.",
	    	tooltip: "<b>ABILITY:</b> <i>Energy Shield</i>",
	    	specialDefend: "shield",
	        attackPower: 20,
	        healthPoints: 25,
	        shieldPoints: 50,
	        counterAttack: 25},
	],

   	attackData, attackHealth, defendData, defendHealth, attackShield, defendShield, attackActual, charToDefeat, sound = true, advanced = false;

	function characterSelect(arr, where) {
		for (let character of arr) {
			$(where).append(`<div id=${character.id} class="character"><img src=${character.img} /><div class="overlay"></div><div class="damage-effect"></div></div>`);
			$(`#${character.id}`).data('stats', character)
				.append(`<span class='charName'>${character.name}</span>`)
				.append(`<span class='charHealth'><span class="healthType">Health:</span><span class='healthNumber green'>${character.healthPoints}</span></span>`)
				.append(`<div class='infoDiv'><span class='charInfo'>${character.info}</span></div>`);
			if (character.tooltip) {
				$(`#${character.id}`).append(`<div class='infoDiv advSpecial'><span class='charInfo'>${character.tooltip}</span></div>`);
			}
		}
	}

	function criticalHits(x) {
		let chance = ~~(Math.random() * 5) + 1;
		return chance < 5 ? x : x * 3;
	}

	function randomDamage(x) {
		return (~~(Math.random() * x) + 1);
	}

	function specialAttackCalc(special, attack, value) {
		if (special == "crit") {
    		return attack = criticalHits(value);
    	}
    	else if (special == "rand") {
    		return attack = randomDamage(value);
    	}
	}

	function fightResult(health, healthTotal, attack, charID, shield) {
		health = health - attack;
		if (shield) {
			health = health + 3;
			$(`${charID} .damage-effect`).css("background", "rgba(104, 224, 255, 0.7)");
		}
		else {
			$(`${charID} .damage-effect`).css("background", "rgba(255, 0, 0, 0.7)");
		}
		$(`${charID} .damage-effect`).fadeIn("fast");
		if (shield || health > 0) {
			$(`${charID} .damage-effect`).fadeOut("fast");
		}
		$(`${charID} .healthNumber`).html(health);
		if (!shield) {
			if (health / healthTotal <= 0) {
				$(`${charID} .healthNumber`).removeClass('red').addClass('dark-red');
			}
			else if (health / healthTotal <= 0.33) {
				$(`${charID} .healthNumber`).removeClass('orange').addClass('red');
			}
			else if (health / healthTotal <= 0.66) {
				$(`${charID} .healthNumber`).removeClass('green').addClass('orange');
			}
		}
		return health;
	}

	function selectSounds(x) {
		if (sound) { 
			let select = new Audio(`assets/sounds/select${x}.wav`);
	  		select.play();
	  	}
	}

	function blasterSounds() {
		if (sound) { 
			let chance = ~~(Math.random() * 11), blaster = new Audio(`assets/sounds/blaster${chance}.wav`);
	  		blaster.play();
	  	}
	}

	function resetGame(text) {
		let resetBtn = $("<button>");
        $(resetBtn).addClass("btn btn-lg reset-button").html(text);
        $("#gameButton").append(resetBtn);
	}
	
	resetGame("PLAY");

	$('body').on('click', '.charClick .character', function() {

		if ($('#charAttack').is(':empty')) {
			selectSounds(1);
			location.href = "#";
			$("#gameBody .infoDiv").remove();
			$("#charSelect").empty();
			$("#advCharSelect").empty();
			$("#attackHeading").append("<h4>PLAYER</h4>");
			$("#defendHeading").append("<h4>ENEMY</h4>");
			$('#charAttack').append(this);
			attackData = $("#charAttack .character").data("stats");
			if (attackData.specialDefend == "shield") {
    			attackShield = attackData.shieldPoints;
    			$("#charAttack .healthType").text(`Shield:`);
    			$("#charAttack .healthNumber").html(attackShield).removeClass('green').addClass('blue');
    		}
			attackHealth = attackData.healthPoints;
			$("#fightInfo").html(`<div class="infoDiv"><span class="charInfo">Can ${attackData.name} defeat 3 enemies?<br><br>Choose an enemy to fight!</span></div>`);
			$("#charRemain").append("<h4>ENEMIES AVAILABLE TO FIGHT</h4>").append($("#charList"));
			$("#charList").append($("#advCharList"));
		}
		else if ($('#charDefend').is(':empty') || defendHealth <= 0) {
			selectSounds(2);
			location.href = "#";
			$("#fightInfo").empty();
			$("#charDefend").empty().append(this);
			defendData = $("#charDefend .character").data("stats");
			if (defendData.specialDefend == "shield") {
    			defendShield = defendData.shieldPoints;
    			$("#charDefend .healthType").text(`Shield:`);
    			$("#charDefend .healthNumber").html(defendShield).removeClass('green').addClass('blue');
    		}
			defendHealth = defendData.healthPoints;
			$("#charRemain").addClass('invisible');
			let fightBtn = $("<button>");
		    $(fightBtn).addClass("btn btn-lg fight-button").text("FIGHT!");
			$("#gameButton").append(fightBtn);
		}
    });

    $("#gameButton").on("click", ".fight-button", function() {
    	blasterSounds();
    	if (attackData.specialAttack) {
    		attackData.attackPower = specialAttackCalc(attackData.specialAttack, attackData.attackPower, attackData.attackValue);
    	}
    	if (defendData.specialAttack) {
    		defendData.counterAttack = specialAttackCalc(defendData.specialAttack, defendData.counterAttack, defendData.counterValue);
    	}
		attackActual = attackActual + attackData.attackPower;
		if (attackShield > 0) {
			attackShield = fightResult(attackShield, attackData.healthPoints, defendData.counterAttack, "#charAttack", true);
			if (attackShield <= 0) {
				$("#charAttack .healthType").text(`Health:`);
				$("#charAttack .healthNumber").html(attackData.healthPoints).removeClass('blue').addClass('green');
			}
		}
		else {
			attackHealth = fightResult(attackHealth, attackData.healthPoints, defendData.counterAttack, "#charAttack", false);
		}
		if (defendShield > 0) {
			defendShield = fightResult(defendShield, defendData.healthPoints, attackActual, "#charDefend", true);
			if (defendShield <= 0) {
				$("#charDefend .healthType").text(`Health:`);
				$("#charDefend .healthNumber").html(defendData.healthPoints).removeClass('blue').addClass('green');
			}
		}
		else {
			defendHealth = fightResult(defendHealth, defendData.healthPoints, attackActual, "#charDefend", false);
		}
		if (attackShield > 0 || attackHealth == attackData.healthPoints) {
			$("#fightInfo").html(`<div class="infoDiv"><span class="charInfo">${attackData.name} did ${attackActual} damage to ${defendData.name}.<br><br>${defendData.name} did ${defendData.counterAttack - 3} damage to ${attackData.name}.</span></div>`);
		}
		else if (defendShield > 0 || defendHealth == defendData.healthPoints) {
			$("#fightInfo").html(`<div class="infoDiv"><span class="charInfo">${attackData.name} did ${attackActual - 3} damage to ${defendData.name}.<br><br>${defendData.name} did ${defendData.counterAttack} damage to ${attackData.name}.</span></div>`);
		}
		else {
			$("#fightInfo").html(`<div class="infoDiv"><span class="charInfo">${attackData.name} did ${attackActual} damage to ${defendData.name}.<br><br>${defendData.name} did ${defendData.counterAttack} damage to ${attackData.name}.</span></div>`);

		}
		if (attackHealth <= 0) {
			$("#fightInfo").html(`<div class="infoDiv"><span class="charInfo">${attackData.name} has been defeated by ${defendData.name}!<br><br>YOU LOSE!</span></div>`);
			$('#gameButton').empty();
			setTimeout(resetGame.bind(null, "REPLAY?"), 1e3* .75);
		}
		else if (defendHealth <= 0) {
			charToDefeat--
			$('#gameButton').empty();
			if (!charToDefeat) {
				$("#fightInfo").html(`<div class="infoDiv"><span class="charInfo">${attackData.name} has defeated ${defendData.name}!<br><br>YOU WIN!</span></div>`);
				if (!advanced) {
					$("#fightInfo .charInfo").append(`<br><br>Advanced Characters: UNLOCKED`);
					advanced = true;
					localStorage.setItem("advanced", true);
				}
				setTimeout(resetGame.bind(null, "REPLAY?"), 1e3 * .75);
			}
			else {
				$("#fightInfo").html(`<div class="infoDiv"><span class="charInfo">${attackData.name} has defeated ${defendData.name}!<br><br>Choose a new enemy to fight! (${charToDefeat} remaining)</span></div>`);
				$("#charRemain").removeClass('invisible');
			}
		}
    });

    $("#gameButton").on("click", ".reset-button", function () {
    	selectSounds(0);
		$("#charAttack").empty();
		$("#attackHeading").empty();
		$("#charDefend").empty();
		$("#defendHeading").empty();
		$('#gameButton').empty();
		$("#fightInfo").empty();
		$("#charRemain").empty().removeClass('invisible');
		$("#listHome").html("<div id='charList' class='charClick'></div>");
		$("#charSelect").append("<h4>CHARACTER SELECTION</h4>");
		attackActual = 0, attackShield = 0, defendShield = 0, charToDefeat = 3;
    	characterSelect(charArr, "#charList");
    	advanced = localStorage.getItem("advanced");
    	if (advanced) {
    		$("#advListHome").html("<div id='advCharList' class='charClick'></div>");
    		$("#advCharSelect").append("<br><h4>ADVANCED CHARACTERS</h4>");
    		characterSelect(advArr, "#advCharList");
    	}
	});

    $(".help-menu").on("click", function () {
    	if ($("#gameBody").hasClass('hidden')) {
    		$("#helpBody").addClass('hidden');
    		$("#gameBody").removeClass('hidden');
    	}
    	else {
    		$("#gameBody").addClass('hidden');
    		$("#helpBody").removeClass('hidden');
    	}
	});

	$("#soundChoose").on("click", function () {
    	if (!sound) {
    		sound = true;
    		$("#soundOn").html(`<i class="fa fa-check-square-o" aria-hidden="true"></i>`)
    		selectSounds(3);
    	}
    	else {
    		sound = false;
    		$("#soundOn").html(`<i class="fa fa-square-o" aria-hidden="true"></i>`)
    	}
	});

});