$(function(){

	var greedo = {
		name: "Greedo",
		id: "characterGreedo",
		img: "assets/images/greedo.jpg",
		info: "Poor aim, worse luck.",
        attackPower: 25,
        healthPoints: 100,
        counterAttack: 25
    };

    var ig88 = {
    	name: "IG-88",
    	id: "characterIg88",
    	img: "assets/images/ig-88.jpg",
    	info: "Droid extra with a killer backstory.",
        attackPower: 15,
        healthPoints: 130,
        counterAttack: 20
    };

    var sarlacc = {
    	name: "Sarlacc",
    	id: "characterSarlacc",
    	img: "assets/images/sarlacc.png",
    	info: "Unsung hero of <i>Return of the Jedi</i>.",
        attackPower: 3,
        healthPoints: 300,
        counterAttack: 10
    };

    var tauntaun = {
    	name: "Tauntaun",
    	id: "characterTauntaun",
    	img: "assets/images/tauntaun.jpg",
    	info: "Loyal in battle, warm in winter.",
        attackPower: 10,
        healthPoints: 150,
        counterAttack: 15
    };

    var droopy = {
    	name: "Droopy McCool",	  //seriously a real character, look it up
    	id: "characterDroopy",
    	img: "assets/images/droopy.jpg",
    	info: "Best stage name in the galaxy.",
        attackPower: 7,
        healthPoints: 200,
        counterAttack: 12
    };

    var wicket = {
    	name: "Wicket",
    	id: "characterWicket",
    	img: "assets/images/wicket.png",
    	info: "Has 2 spinoff movies and a TV series.",
        attackPower: 37,
        healthPoints: 75,
        counterAttack: 35
    };

	var charArr = [greedo, ig88, sarlacc, tauntaun, droopy, wicket];
		//array of the objects defined above
    var attackData;
    var attackHealth;
    var defendData;
    var defendHealth;
    	//variables that will be defined later in functions that need a global scope
    var attackActual = 0;	
    var charToDefeat = 3;
    	//number of enemies to be fought in one playthrough
   
	function characterSelect() {  
			//function to create clickable character cards
		$("#charSelect").append("<h4>CHARACTER SELECTION</h4>")
		$("#listHome").html("<div id='charList'></div>");
			//creates a moveable container for the character cards inside a static element
		for (i=0; i<charArr.length; i++) {
				//creates a character card for each object in the array
			$("#charList").append('<div id=' + charArr[i].id + ' class="character"><img src=' + charArr[i].img + ' /><div class="overlay-target overlay"></div><div class="damage-effect"></div></div>');
			$("#" + charArr[i].id).data('stats', charArr[i]);
			$("#" + charArr[i].id).append("<span class='charName'>" + charArr[i].name +"</span>");
			$("#" + charArr[i].id).append("<span class='charHealth'>Health:<span class='healthNumber green'>" + charArr[i].healthPoints + "</span></span>");
			$("#" + charArr[i].id).append("<div class='infoDiv'><span class='charInfo'>" + charArr[i].info + "</span></div>");
		}
	}

	characterSelect();
		//immediately calling the function to initialize the first playthrough

	function fightResult(health, healthTotal, attack, charID) {
			//function to calculate and display fight damage
		health = health - attack;
		$(charID + " .damage-effect").fadeIn("fast").fadeOut("fast");
		$(charID + " .healthNumber").html(health);
		if (health / healthTotal <= 0) {
			$(charID + " .healthNumber").removeClass('red').addClass('dark-red');
		}
		else if (health / healthTotal <= 0.33) {
			$(charID + " .healthNumber").removeClass('orange').addClass('red');
		}
		else if (health / healthTotal <= 0.66) {
			$(charID + " .healthNumber").removeClass('green').addClass('orange');
		}
		return health;
	}

	function resetGame() {  
			//function to create a button that restores the page to its original state
		var resetBtn = $("<button>");
        	$(resetBtn).addClass("btn btn-lg reset-button");
        	$(resetBtn).html("REPLAY?");
        	$("#gameButton").append(resetBtn);
	}

	$('body').on('click', '#charList .character', function() {
			//click event tied to the body instead of directly to ".chosen" to avoid issues with binding event handlers after resetting the game
		if ($('#charAttack').is(':empty')) {
				//only get to pick the player character once per playthrough
			location.href = "#";
				//jumps to the top of page in case the user is on a mobile device or small tablet and scrolled to select a character
			$(".infoDiv").remove();
			$("#charSelect").empty();
				//removes text clutter during gameplay
			$("#attackHeading").append("<h4>PLAYER</h4>");
			$("#defendHeading").append("<h4>ENEMY</h4>");
				//defining character areas
			$('#charAttack').append(this);
			attackData = $("#charAttack .character").data("stats");
			attackHealth = attackData.healthPoints;
				//retrieves player character's corresponding object for game use
			$("#fightInfo").html('<div class="infoDiv"><span class="charInfo">Can ' + attackData.name + ' defeat 3 enemies?<br><br>Choose an enemy to fight!</span></div>');
			$("#charRemain").append("<h4>ENEMIES AVAILABLE TO FIGHT</h4>");
			$('#charRemain').append($("#charList"));
				//moves the remaining character cards to the appropriate location
		}
		else if ($('#charDefend').is(':empty') || defendHealth <= 0) {
				//chooses a new enemy to fight after choosing the player character or defeating an enemy
			location.href = "#";
				//solves another instance of possible scrolling for character selection
			$("#fightInfo").empty();
			$("#charDefend").empty();
				//removes the defeated enemy before appending the new one
			$('#charDefend').append(this);
			defendData = $("#charDefend .character").data("stats");
			defendHealth = defendData.healthPoints;
				//retrieves active enemey's corresponding object for game use
			$('#charList .overlay-target').removeClass("overlay");
			$("#charRemain").addClass('invisible');
				//hides the remaining enemies to avoid visual clutter while fighting	
			var fightBtn = $("<button>");
		    $(fightBtn).addClass("btn btn-lg fight-button");
		    $(fightBtn).text("FIGHT!");
			$("#gameButton").append(fightBtn);
				//only need the "fight" button while there's an active enemy character
		}
    });

    $("#gameButton").on("click", ".fight-button", function() {
			//triggers a single iteration of combat
		attackActual = attackActual + attackData.attackPower;
			//increases the player character's attack power by the character's base attack power
		attackHealth = fightResult(attackHealth, attackData.healthPoints, defendData.counterAttack, "#charAttack");
		defendHealth = fightResult(defendHealth, defendData.healthPoints, attackActual, "#charDefend");
			//reduces each active character's health by the other's attack, with visual feedback
		$("#fightInfo").html('<div class="infoDiv"><span class="charInfo">' + attackData.name + ' did ' + attackActual + ' damage to ' + defendData.name + '.<br><br>' + defendData.name + ' did ' + defendData.counterAttack + ' damage to ' + attackData.name + '.</span></div>');
			//provides text feedback for the damage done by each character
		if (attackHealth <= 0) {
				//the game is over if the player character dies, even if the enemy dies simultaneously
			$("#fightInfo").html('<div class="infoDiv"><span class="charInfo">' + attackData.name + ' has been defeated by ' + defendData.name + '!<br><br>YOU LOSE!</span></div>');
				//provides text feedback for the results of the fight
			$('#gameButton').empty();
			setTimeout(resetGame, 1000 * .75);
				//small delay before the "reset" button appears to prevent an accidental click after double-clicking the "fight" button
		}
		else if (defendHealth <= 0) {
				//if the enemy dies and the player character does not
			charToDefeat--
				//decrement the count of enemies left to fight
			$('#gameButton').empty();
			if (charToDefeat == 0) {
					//the game is over if enough enemies have been defeated
				$("#fightInfo").html('<div class="infoDiv"><span class="charInfo">' + attackData.name + ' has defeated ' + defendData.name + '!<br><br>YOU WIN!</span></div>');
				setTimeout(resetGame, 1000 * .75);
			}
			else {
					//there is still at least one enemy left to fight
				$("#fightInfo").html('<div class="infoDiv"><span class="charInfo">' + attackData.name + ' has defeated ' + defendData.name + '!<br><br>Choose a new enemy to fight! (' + charToDefeat + ' remaining)</span></div>');
				$('#charList .overlay-target').addClass("overlay");
				$("#charRemain").removeClass('invisible');
					//reveals the remaining enemies to choose from
			}
		}
    });

    $("#gameButton").on("click", ".reset-button", function () {
			//triggered by the button from resetGame
		$("#charAttack").empty();
		$("#attackHeading").empty();
		$("#charDefend").empty();
		$("#defendHeading").empty();
		$('#gameButton').empty();
		$("#fightInfo").empty();
		$("#charRemain").empty();
		$("#charRemain").removeClass('invisible');
			//clears all dynamically created html from static divs
		attackActual = 0;
    	charToDefeat = 3;
    	characterSelect();
    		//resets the game with new character cards
	});
});