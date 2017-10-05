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
		$("#characterSelection").append("<h3>Choose Your Character</h3>")
		$("#listHome").html("<div id='characterList'></div>");
		$("#characterList").html('<div id="characterGreedo" class="character"><img src="assets/images/greedo copy.jpg" /></div>');
		$("#characterGreedo").data('stats', greedo);
		$("#characterGreedo").append("<span class='characterName'>Greedo</span>");
		$("#characterGreedo").append("<span class='characterHealth'>Health: " + greedo.healthPoints + "</span>");
		$("#characterGreedo").append("<div class='infoDiv'><span class='characterInfo align-middle'>Poor aim, worse luck.</span></div>");
		$("#characterList").append('<div id="characterIg88" class="character"><img src="assets/images/ig-88 copy.jpg" /></div>');
		$("#characterIg88").data('stats', ig88);
		$("#characterIg88").append("<span class='characterName'>IG-88</span>");
		$("#characterIg88").append("<span class='characterHealth'>Health: " + ig88.healthPoints + "</span>");
		$("#characterIg88").append("<div class='infoDiv'><span class='characterInfo'>Droid extra with a killer backstory.</span></div>");
		$("#characterList").append('<div id="characterSarlacc" class="character"><img src="assets/images/sarlacc copy.png" /></div>');
		$("#characterSarlacc").data('stats', sarlacc);
		$("#characterSarlacc").append("<span class='characterName'>Sarlacc</span>");
		$("#characterSarlacc").append("<span class='characterHealth'>Health: " + sarlacc.healthPoints + "</span>");
		$("#characterSarlacc").append("<div class='infoDiv'><span class='characterInfo'>Unsung hero of <i>Return of the Jedi</i>.</span></div>");
		$("#characterList").append('<div id="characterTauntaun" class="character"><img src="assets/images/tauntaun copy.jpg" /></div>');
		$("#characterTauntaun").data('stats', tauntaun);
		$("#characterTauntaun").append("<span class='characterName'>Tauntaun</span>");
		$("#characterTauntaun").append("<span class='characterHealth'>Health: " + tauntaun.healthPoints + "</span>");
		$("#characterTauntaun").append("<div class='infoDiv'><span class='characterInfo'>Loyal in battle, warm in winter.</span></div>");
	}

	function resetGame() {
		$("#characterAttack").empty();
		$("#characterDefend").empty();
		$("#characterFight").empty();
		attackActual = 0;
		attackHealth = 0;
    	defendHealth = 0;
    	charactersDefeated = 0;
    	characterSelect();
	}

	characterSelect();

	$('body').on('click', '.character', function() {
		if ($('#characterAttack').is(':empty')) {
			$(".infoDiv").remove();
			$("#characterAttack").append("<h3>Your Character</h3>");
			$('#characterAttack').append(this);
			attackHealth = $("#characterAttack .character").data("stats").healthPoints;
			$("#characterDefend").append("<h3>Enemies Available to Fight</h3>");
			$('#characterDefend').append($("#characterList"));
			$("#characterSelection").empty();
		}
		else if ($('#characterFight').is(':empty')) {
			$("#characterFight").append("<h3>Defender</h3>");
			$('#characterFight').append(this);
			defendHealth = $("#characterFight .character").data("stats").healthPoints;
			var fightBtn = $("<button>");
	        $(fightBtn).addClass("fight-button");
	        $(fightBtn).text("Fight!");
			$("#characterFight").append(fightBtn);		
		}
    });

    $("#characterFight").on("click", ".fight-button", function() {
		var attackData = $("#characterAttack .character").data("stats");
		var defendData = $("#characterFight .character").data("stats");
		attackHealth = attackHealth - defendData.counterAttack;
		$("#characterAttack .characterHealth").html("Health: " + attackHealth);
		attackActual = attackActual + attackData.attackPower;
		defendHealth = defendHealth - attackActual;
		$("#characterFight .characterHealth").html("Health: " + defendHealth);
		if (attackHealth <= 0) {
			alert("You lose!");
			resetGame();
		}
		else if (defendHealth <= 0) {
			$("#characterFight").empty();
			charactersDefeated++
			if (charactersDefeated == 3) {
				alert("You win!");
				resetGame();
			}
			else {
				alert("Choose a new defender!")
			}
		}
    });

});



























