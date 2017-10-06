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

    var droopy = {
    	name: "Droopy McCool",
    	id: "characterDroopy",
    	img: "assets/images/droopy.jpg",
    	info: "Best stage name in the galaxy.",
        attackPower: 10,
        healthPoints: 150,
        counterAttack: 15
    };

	var charArr = [greedo, ig88, sarlacc, tauntaun, droopy];
    var attackActual = 0;
    var attackData;
    var attackHealth;
    var defendData;
    var defendHealth;
    var charToDefeat = 3;    
   
	function characterSelect() {
		$("#charSelect").append("<h4>CHOOSE YOUR CHARACTER</h4>")
		$("#listHome").html("<div id='charList'></div>");
		for (i=0; i<charArr.length; i++) {
			$("#charList").append('<div id=' + charArr[i].id + ' class="character notChosen"><img src=' + charArr[i].img + ' /><div class="overlay-target overlay"></div><div class="damage-effect"></div></div>');
			$("#" + charArr[i].id).data('stats', charArr[i]);
			$("#" + charArr[i].id).append("<span class='charName'>" + charArr[i].name +"</span>");
			$("#" + charArr[i].id).append("<span class='charHealth'>Health:<span class='healthNumber green'>" + charArr[i].healthPoints + "</span></span>");
			$("#" + charArr[i].id).append("<div class='infoDiv'><span class='charInfo align-middle'>" + charArr[i].info + "</span></div>");
		}
	}

	function resetGame() {
		$('#gameButton').empty();
		var resetBtn = $("<button>");
        	$(resetBtn).addClass("btn btn-lg reset-button");
        	$(resetBtn).html("PLAY<bR>AGAIN?");
        	$("#gameButton").append(resetBtn);
	}
	
	characterSelect();
	
	$("#gameButton").on("click", ".reset-button", function () {
		$("#charAttack").empty();
		$("#charDefend").empty();
		$("#attackHeading").empty();
		$("#charFight").empty();
		$("#fightHeading").empty();
		$("#fightInfo").empty();
		$('#gameButton').empty();
		attackActual = 0;
    	charToDefeat = 3;
    	characterSelect();
	});

	$('body').on('click', '.notChosen', function() {
		if ($('#charAttack').is(':empty')) {
			location.href = "#";
			$(".infoDiv").remove();
			$("#attackHeading").append("<h4>YOUR CHARACTER</h4>");
			$("#fightHeading").append("<h4>DEFENDING ENEMY</h4>");
			$('#charAttack').append(this);
			$("#charAttack .character").removeClass("notChosen");
			attackData = $("#charAttack .character").data("stats");
			attackHealth = attackData.healthPoints;
			$("#charDefend").append("<h4>ENEMIES AVAILABLE TO FIGHT</h4>");
			$('#charDefend').append($("#charList"));
			$("#charSelect").empty();
			$("#fightInfo").html('<div class="infoDiv"><span class="charInfo">Can ' + attackData.name + ' defeat 3 enemies?<br><br>Choose an enemy to fight!</span></div>');

		}
		else if ($('#charFight').is(':empty')) {
			location.href = "#";
			$("#fightInfo").empty();
			$('#charFight').append(this);
			$('#charList .overlay-target').removeClass("overlay");
			defendData = $("#charFight .character").data("stats");
			defendHealth = defendData.healthPoints;
			if ($('#gameButton').is(':empty')) {
				var fightBtn = $("<button>");
		        $(fightBtn).addClass("btn btn-lg fight-button");
		        $(fightBtn).text("FIGHT!");
				$("#gameButton").append(fightBtn);
			}
			if (charToDefeat == 1) {
				$("#charDefend").empty();
			} 
		}
    });

    $("#gameButton").on("click", ".fight-button", function() {
		attackHealth = attackHealth - defendData.counterAttack;
		$("#charAttack .damage-effect").fadeIn("fast").fadeOut("fast");
		$("#charAttack .healthNumber").html(attackHealth);
		if (attackHealth / attackData.healthPoints <= 0.5) {
			$("#charAttack .healthNumber").removeClass('green').addClass('red');
		}
		attackActual = attackActual + attackData.attackPower;
		defendHealth = defendHealth - attackActual;
		$("#charFight .damage-effect").fadeIn("fast").fadeOut("fast");
		$("#charFight .healthNumber").html(defendHealth);
		$("#fightInfo").html('<div class="infoDiv"><span class="charInfo">' + attackData.name + ' did ' + attackActual + ' damage to ' + defendData.name + '.<br><br>' + defendData.name + ' did ' + defendData.counterAttack + ' damage to ' + attackData.name + '.</span></div>');
		if (defendHealth / defendData.healthPoints <= 0.5) {
			$("#charFight .healthNumber").removeClass('green').addClass('red');
		}
		if (attackHealth <= 0) {
			$("#fightInfo").html('<div class="infoDiv"><span class="charInfo">' + defendData.name + ' has defeated ' + attackData.name + '!<br><br>YOU LOSE!</span></div>');
			resetGame();
		}
		else if (defendHealth <= 0) {
			$("#charFight").empty();
			$('#gameButton').empty();
			charToDefeat--
			if (charToDefeat == 0) {
				$("#fightInfo").html('<div class="infoDiv"><span class="charInfo">' + attackData.name + ' has defeated ' + defendData.name + '!<br><br>YOU WIN!</span></div>');
				resetGame();
			}
			else {
				$('#charList .overlay-target').addClass("overlay");
				$("#fightInfo").html('<div class="infoDiv"><span class="charInfo">' + attackData.name + ' has defeated ' + defendData.name + '!<br><br>Choose a new enemy to fight! (' + charToDefeat + ' remaining)</span></div>');
			}
		}
    });

});