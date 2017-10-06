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
        healthPoints: 310,
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

	var charArr = [greedo, ig88, sarlacc, tauntaun];
    var attackActual = 0;
    var attackHealth = 0;
    var defendHealth = 0;
    var charactersDefeated = 0;    
   
	function characterSelect() {
		$("#characterSelection").append("<h3>CHOOSE YOUR CHARACTER</h3>")
		$("#listHome").html("<div id='characterList'></div>");
		for (i=0; i<charArr.length; i++) {
			$("#characterList").append('<div id=' + charArr[i].id + ' class="character notChosen"><img src=' + charArr[i].img + ' /><div class="overlay-target overlay"></div><div class="damage-effect"></div></div>');
			$("#" + charArr[i].id).data('stats', charArr[i]);
			$("#" + charArr[i].id).append("<span class='characterName'>" + charArr[i].name +"</span>");
			$("#" + charArr[i].id).append("<span class='characterHealth'>Health:<span class='healthNumber green'>" + charArr[i].healthPoints + "</span></span>");
			$("#" + charArr[i].id).append("<div class='infoDiv'><span class='characterInfo align-middle'>" + charArr[i].info + "</span></div>");
		}
	}

	function resetGame() {
		$('#gameButton').empty();
		var resetBtn = $("<button>");
        	$(resetBtn).addClass("btn btn-lg reset-button");
        	$(resetBtn).text("PLAY AGAIN?");
        	$("#gameButton").append(resetBtn);
	}
	
	characterSelect();
	
	$("#gameButton").on("click", ".reset-button", function () {
		$("#characterAttack").empty();
		$("#attackHeading").empty();
		$("#characterFight").empty();
		$("#fightHeading").empty();
		$("#fightInfo").empty();
		$('#gameButton').empty();
		attackActual = 0;
		attackHealth = 0;
    	defendHealth = 0;
    	charactersDefeated = 0;
    	characterSelect();
	});

	$('body').on('click', '.notChosen', function() {
		if ($('#characterAttack').is(':empty')) {
			$(".infoDiv").remove();
			$("#attackHeading").append("<h3>YOUR CHARACTER</h3>");
			$("#fightHeading").append("<h3>DEFENDING ENEMY</h3>");
			$('#characterAttack').append(this);
			$("#characterAttack .character").removeClass("notChosen");
			attackHealth = $("#characterAttack .character").data("stats").healthPoints;
			$("#characterDefend").append("<h3>ENEMIES LEFT TO FIGHT</h3>");
			$('#characterDefend').append($("#characterList"));
			$("#characterSelection").empty();
			$("#fightInfo").html('<div class="infoDiv"><span class="characterInfo">Choose an enemy to fight!</span></div>');

		}
		else if ($('#characterFight').is(':empty')) {
			$("#fightInfo").empty();
			$('#characterFight').append(this);
			$('#characterList .overlay-target').removeClass("overlay");
			defendHealth = $("#characterFight .character").data("stats").healthPoints;
			if ($('#gameButton').is(':empty')) {
				var fightBtn = $("<button>");
		        $(fightBtn).addClass("btn btn-lg fight-button");
		        $(fightBtn).text("FIGHT!");
				$("#gameButton").append(fightBtn);
			}
			if (charactersDefeated == 2) {
				$("#characterDefend").empty();
			} 
		}
    });

    $("#gameButton").on("click", ".fight-button", function() {
		var attackData = $("#characterAttack .character").data("stats");
		var defendData = $("#characterFight .character").data("stats");
		attackHealth = attackHealth - defendData.counterAttack;
		$("#characterAttack .damage-effect").fadeIn("fast").fadeOut("fast");
		$("#characterAttack .healthNumber").html(attackHealth);
		if (attackHealth / attackData.healthPoints <= 0.5) {
			$("#characterAttack .healthNumber").removeClass('green').addClass('red');
		}
		attackActual = attackActual + attackData.attackPower;
		defendHealth = defendHealth - attackActual;
		$("#characterFight .damage-effect").fadeIn("fast").fadeOut("fast");
		$("#characterFight .healthNumber").html(defendHealth);
		$("#fightInfo").html('<div class="infoDiv"><span class="characterInfo">' + attackData.name + ' did ' + attackActual + ' damage to ' + defendData.name + '.<br><br>' + defendData.name + ' did ' + defendData.counterAttack + ' damage to ' + attackData.name + '.</span></div>');
		if (defendHealth / defendData.healthPoints <= 0.5) {
			$("#characterFight .healthNumber").removeClass('green').addClass('red');
		}
		if (attackHealth <= 0) {
			$("#fightInfo").html('<div class="infoDiv"><span class="characterInfo">You lose!<br>Your failure has been noted.</span></div>');
			resetGame();
		}
		else if (defendHealth <= 0) {
			$("#characterFight").empty();
			$('#gameButton').empty();
			$("#fightInfo").empty();
			charactersDefeated++
			if (charactersDefeated == 3) {
				$("#fightInfo").html('<div class="infoDiv"><span class="characterInfo">You win!<br>You are one with the Force!</span></div>');
				resetGame();
			}
			else {
				$('#characterList .overlay-target').addClass("overlay");
				$("#fightInfo").html('<div class="infoDiv"><span class="characterInfo">' + attackData.name + ' has defeated ' + defendData.name + '! Choose a new enemy to fight!</span></div>');
			}
		}
    });

});