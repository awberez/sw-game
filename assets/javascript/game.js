$(function(){

	var greedo = {
        attackPower: 20,
        healthPoints: 100,
        counterAttack: 25
    };

    var ig88 = {
        attackPower: 15,
        healthPoints: 130,
        counterAttack: 20
    };

    var sarlacc = {
        attackPower: 5,
        healthPoints: 310,
        counterAttack: 10
    };

    var tauntaun = {
        attackPower: 10,
        healthPoints: 150,
        counterAttack: 15
    };

    var attackActual = 0;
    var attackHealth = 0;
    var defendHealth = 0;
    var charactersDefeated = 0;

	function characterSelect() {
		$("#characterSelection").append("<h3>CHOOSE YOUR CHARACTER</h3>")
		$("#listHome").html("<div id='characterList'></div>");
		//Greedo
		$("#characterList").html('<div id="characterGreedo" class="character notChosen"><img src="assets/images/greedo copy.jpg" /><div class="overlay-target overlay"></div><div class="damage-effect"></div></div>');
		$("#characterGreedo").data('stats', greedo);
		$("#characterGreedo").append("<span class='characterName'>Greedo</span>");
		$("#characterGreedo").append("<span class='characterHealth'>Health:<span class='healthNumber green'>" + greedo.healthPoints + "</span></span>");
		$("#characterGreedo").append("<div class='infoDiv'><span class='characterInfo align-middle'>Poor aim, worse luck.</span></div>");
		//IG-88
		$("#characterList").append('<div id="characterIg88" class="character notChosen"><img src="assets/images/ig-88 copy.jpg" /><div class="overlay-target overlay"></div><div class="damage-effect"></div></div>');
		$("#characterIg88").data('stats', ig88);
		$("#characterIg88").append("<span class='characterName'>IG-88</span>");
		$("#characterIg88").append("<span class='characterHealth'>Health:<span class='healthNumber green'>" + ig88.healthPoints + "</span></span>");
		$("#characterIg88").append("<div class='infoDiv'><span class='characterInfo'>Droid extra with a killer backstory.</span></div>");
		//Sarlacc
		$("#characterList").append('<div id="characterSarlacc" class="character notChosen"><img src="assets/images/sarlacc copy.png" /><div class="overlay-target overlay"></div><div class="damage-effect"></div></div>');
		$("#characterSarlacc").data('stats', sarlacc);
		$("#characterSarlacc").append("<span class='characterName'>Sarlacc</span>");
		$("#characterSarlacc").append("<span class='characterHealth'>Health:<span class='healthNumber green'>" + sarlacc.healthPoints + "</span></span>");
		$("#characterSarlacc").append("<div class='infoDiv'><span class='characterInfo'>Unsung hero of <i>Return of the Jedi</i>.</span></div>");
		//Tauntaun
		$("#characterList").append('<div id="characterTauntaun" class="character notChosen"><img src="assets/images/tauntaun copy.jpg" /><div class="overlay-target overlay"></div><div class="damage-effect"></div></div>');
		$("#characterTauntaun").data('stats', tauntaun);
		$("#characterTauntaun").append("<span class='characterName'>Tauntaun</span>");
		$("#characterTauntaun").append("<span class='characterHealth'>Health:<span class='healthNumber green'>" + tauntaun.healthPoints + "</span></span>");
		$("#characterTauntaun").append("<div class='infoDiv'><span class='characterInfo'>Loyal in battle, warm in winter.</span></div>");
	}

	function resetGame() {
		$("#characterAttack").empty();
		$("#characterFight").empty();
		$('#fightButton').empty();
		attackActual = 0;
		attackHealth = 0;
    	defendHealth = 0;
    	charactersDefeated = 0;
    	characterSelect();
	}

	characterSelect();

	$('body').on('click', '.notChosen', function() {
		if ($('#characterAttack').is(':empty')) {
			$(".infoDiv").remove();
			$("#characterAttack").append("<h3>YOUR CHARACTER</h3>");
			$('#characterAttack').append(this);
			$("#characterAttack .character").removeClass("notChosen");
			attackHealth = $("#characterAttack .character").data("stats").healthPoints;
			$("#characterDefend").append("<h3>ENEMIES AVAILABLE TO FIGHT</h3>");
			$('#characterDefend').append($("#characterList"));
			$("#characterSelection").empty();
		}
		else if ($('#characterFight').is(':empty')) {
			$("#characterFight").append("<h3>DEFENDING ENEMY</h3>");
			$('#characterFight').append(this);
			$('#characterList .overlay-target').removeClass("overlay");
			defendHealth = $("#characterFight .character").data("stats").healthPoints;
			if ($('#fightButton').is(':empty')) {
				var fightBtn = $("<button>");
		        $(fightBtn).addClass("btn btn-lg btn-danger fight-button");
		        $(fightBtn).text("FIGHT!");
				$("#fightButton").append(fightBtn);
			}
			if (charactersDefeated == 2) {
				$("#characterDefend").empty();
			} 
		}
    });

    $("#fightButton").on("click", ".fight-button", function() {
		var attackData = $("#characterAttack .character").data("stats");
		var defendData = $("#characterFight .character").data("stats");
		attackHealth = attackHealth - defendData.counterAttack;
		$("#characterAttack .damage-effect").fadeIn("fast");
		$("#characterAttack .damage-effect").fadeOut("fast");
		$("#characterAttack .healthNumber").html(attackHealth);
		if (attackHealth / attackData.healthPoints <= 0.5) {
			$("#characterAttack .healthNumber").removeClass('green').addClass('red');
		}
		attackActual = attackActual + attackData.attackPower;
		defendHealth = defendHealth - attackActual;
		$("#characterFight .damage-effect").fadeIn("fast");
		$("#characterFight .damage-effect").fadeOut("fast");
		$("#characterFight .healthNumber").html(defendHealth);

		if (defendHealth / defendData.healthPoints <= 0.5) {
			$("#characterFight .healthNumber").removeClass('green').addClass('red');
		}
		if (attackHealth <= 0) {
			alert("You lose!");
			resetGame();
		}
		else if (defendHealth <= 0) {
			$("#characterFight").empty();
			$('#fightButton').empty();
			charactersDefeated++
			if (charactersDefeated == 3) {
				alert("You win!");
				resetGame();
			}
			else {
				$('#characterList .overlay-target').addClass("overlay");
				alert("Choose a new defender!")
			}
		}
    });

});



























