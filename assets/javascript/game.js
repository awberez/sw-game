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
   
	function characterSelect() {  
			//function to create clickable character cards
		$("#charSelect").append("<h4>CHARACTER SELECTION</h4>")
		$("#listHome").html("<div id='charList'></div>");
			//creates a moveable container for the character cards inside a static element
		for (i=0; i<charArr.length; i++) {
				//creates a character card for each object in the array
			$("#charList").append('<div id=' + charArr[i].id + ' class="character chosen"><img src=' + charArr[i].img + ' /><div class="overlay-target overlay"></div><div class="damage-effect"></div></div>');
			$("#" + charArr[i].id).data('stats', charArr[i]);
			$("#" + charArr[i].id).append("<span class='charName'>" + charArr[i].name +"</span>");
			$("#" + charArr[i].id).append("<span class='charHealth'>Health:<span class='healthNumber green'>" + charArr[i].healthPoints + "</span></span>");
			$("#" + charArr[i].id).append("<div class='infoDiv'><span class='charInfo'>" + charArr[i].info + "</span></div>");
		}
	}

	characterSelect();
		//immediately calling the function to initialize the first playthrough

	function healthColor(health, healthTotal, charID) {  
			//function to change the displayed color of a character's health as it decreases
		if (health / healthTotal <= 0) {
			$(charID + " .healthNumber").removeClass('red').addClass('dark-red');
		}
		else if (health / healthTotal <= 0.33) {
			$(charID + " .healthNumber").removeClass('orange').addClass('red');
		}
		else if (health / healthTotal <= 0.66) {
			$(charID + " .healthNumber").removeClass('green').addClass('orange');
		}
	}

	function resetGame() {  
			//function to create a button that restores the page to its original state
		$('#gameButton').empty();
			//removes the "fight" button if the player lost
		var resetBtn = $("<button>");
        	$(resetBtn).addClass("btn btn-lg reset-button");
        	$(resetBtn).html("REPLAY?");
        	$("#gameButton").append(resetBtn);
	}
	
	$("#gameButton").on("click", ".reset-button", function () {
			//triggered by the button from resetGame
		$("#charAttack").empty();
		$("#charRemain").empty();
		$("#attackHeading").empty();
		$("#charDefend").empty();
		$("#defendHeading").empty();
		$("#fightInfo").empty();
		$('#gameButton').empty();
		$("#charRemain").removeClass('invisible');
			//clears all dynamically created html from static divs
		attackActual = 0;
    	charToDefeat = 3;
    	characterSelect();
    		//reset the game with new character cards
	});

	$('body').on('click', '.chosen', function() {
			//click event tied to the body instead of directly to ".chosen" to avoid issues with binding event handlers after resetting the game
		if ($('#charAttack').is(':empty')) {
				//only get to pick your character once per playthrough
			location.href = "#";
				//jumps to the top of page in case the user is on a mobile device or small tablet and scrolls to select a character
			$(".infoDiv").remove();
			$("#charSelect").empty();
				//removes text clutter during gameplay
			$("#attackHeading").append("<h4>PLAYER</h4>");
			$("#defendHeading").append("<h4>ENEMY</h4>");
				//defining character areas
			$('#charAttack').append(this);
			$("#charAttack .character").removeClass("chosen");
			attackData = $("#charAttack .character").data("stats");
			attackHealth = attackData.healthPoints;
			$("#fightInfo").html('<div class="infoDiv"><span class="charInfo">Can ' + attackData.name + ' defeat 3 enemies?<br><br>Choose an enemy to fight!</span></div>');
				//makes the player character unclickable after selection and retrieves the character's corresponding object for game use
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
				//retrieves the enemy's corresponding object for game use
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
		attackHealth = attackHealth - defendData.counterAttack;
		$("#charAttack .damage-effect").fadeIn("fast").fadeOut("fast");
		$("#charAttack .healthNumber").html(attackHealth);
		healthColor(attackHealth, attackData.healthPoints, "#charAttack");
			//reduces player character's health by the enemy's counter attack power, with visual feedback
		attackActual = attackActual + attackData.attackPower;
			//increases the player character's attack power by the character's base attack power
		defendHealth = defendHealth - attackActual;
		$("#charDefend .damage-effect").fadeIn("fast").fadeOut("fast");
		$("#charDefend .healthNumber").html(defendHealth);
		healthColor(defendHealth, defendData.healthPoints, "#charDefend");
			//reduces enemy's health by the player character's increased attack power, with visual feedback
		$("#fightInfo").html('<div class="infoDiv"><span class="charInfo">' + attackData.name + ' did ' + attackActual + ' damage to ' + defendData.name + '.<br><br>' + defendData.name + ' did ' + defendData.counterAttack + ' damage to ' + attackData.name + '.</span></div>');
			//provides text feedback for the damage done by each character
		if (attackHealth <= 0) {
				//if the player character dies, even if the enemy dies simultaneously
			$("#fightInfo").html('<div class="infoDiv"><span class="charInfo">' + attackData.name + ' has been defeated by ' + defendData.name + '!<br><br>YOU LOSE!</span></div>');
				//provides text feedback for the results of the fight
			resetGame();
				//the game is over
		}
		else if (defendHealth <= 0) {
				//if the enemy dies and the player character doesn't
			charToDefeat--
				//decrement the count of enemies left to fight
			$('#gameButton').empty();
				//removes the "fight" button until a new enemy is chosen
			if (charToDefeat == 0) {
					//if 3 enemies have been defeated
				$("#fightInfo").html('<div class="infoDiv"><span class="charInfo">' + attackData.name + ' has defeated ' + defendData.name + '!<br><br>YOU WIN!</span></div>');
					//provides text feedback for the results of the fight
				resetGame();
					//the game is over
			}
			else {
					//there is still at least one enemy left to fight
				$("#fightInfo").html('<div class="infoDiv"><span class="charInfo">' + attackData.name + ' has defeated ' + defendData.name + '!<br><br>Choose a new enemy to fight! (' + charToDefeat + ' remaining)</span></div>');
					//provides text feedback for the results of the fight
				$('#charList .overlay-target').addClass("overlay");
				$("#charRemain").removeClass('invisible');
					//reveals the remaining enemies to choose from
			}
		}
    });
});