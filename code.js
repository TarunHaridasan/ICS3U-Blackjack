/*
	Tarun Haridasan, Aaron Korlall, Dhiren Patel, Dhruv Chand
	2020-04-15
	Code.js
	Contains the code for the blackjack game
*/
//*********************<<Tarun April 22, 2020 9pm Set up the player class and added conditions for betting***********************
class Player { //The Player class stores the properties of the player entities (dealer and the user)
	constructor(team){ //This constructor functions allows making multiple instances of the player class (one for the user, and one for the dealer)
		this.name="";
		this.team=team;
		this.sum=0;
		this.avatar="";
	} //End of constructor method
	drawCard(flipped) { //This method draws a card for the corresponding player. As well, the method displays that card on screen and adds it to the sum
		if (flipped) { //If the flipped parameter is true, the function will draw a flipped card.
			$("#"+this.team+"Cards").append("<img id='flipped' src='images/cards/card55.JPG'>");
		}
		else { //If the flipped parameter is false, then draw a non-flipped card
			let cardNumber=1+Math.round(Math.random()*51); //Generate random card 1-54 (No jokers)
			while (cardsTaken.includes(cardNumber)) { //Keep drawing if the card has is already taken (to prevent duplicates)
				cardNumber=1+Math.round(Math.random()*51); 
			} //End of while loop
			let cardValue=getCardValue(cardNumber); //Convert the card number to cardValue
			this.sum+=cardValue; //Increase the sum for the correct player
			cardsTaken.push(cardNumber); //Add card to an array so it doesn't get drawn again
			game.update(); //Changes the labels
			$("#"+this.team+"Cards").append("<img src='images/cards/card"+cardNumber+".JPG'>"); //Display the new card on screen
		}
	} //End of drawCard method
	isBust() { //This method checks if a player's sum is greater than 21, to indicate a bust scenario.
		if (this.sum>21) {
			return true;
		}
		return false;
	} //End of isBust method
} //End of dealer class
//*********************<<Tarun April 24, 2020 5pm with the help of Dhruv Set up the winning, tied, and losing screen code***********************
class Game { //This class stores properties of the game entity
	restart(status, reason) { //The restart method restarts the game without resetting money. It also shows the appropriate screen
		$("#btnHit").prop("disabled", true); //Disable hit button
		$("#btnStay").prop("disabled", true); //Disable stay button
		$("#btnDouble").prop("disabled", true); //Disable double button
		$("#btnBet").prop("disabled", true); //Disable bet button
		$("#lblEndGame").text(reason); //Change text to appropriate message
		if (status==-1) { //If status is -1, player loses.
			$("#loseMusic")[0].play(); //Play losing music
			$("#lblEndGame").css("color","red"); //Change text to red
			$("#endGameScreen").css({"border-color":"red"}); //Change border color to red
			$("#endGameScreen").show(500); //Show the message
		}
		else if (status==0) { //If status is 0, it is a tie
			userBalance+=userBet; //Give the bet money back
			$("#lblEndGame").css("color","blue"); //Change text to blue
			$("#endGameScreen").css({"border-color":"blue"}); //Change border to blue
			$("#endGameScreen").show(500); //Show the message
		}
		else if (status==1) { //If status is 1, the player wins
			$("#winMusic")[0].play(); //Play win music
			userBalance+=userBet*2; //Give 2 times the bet
			$("#lblEndGame").css("color","green"); //Change text to green
			$("#endGameScreen").css({"border-color":"green"}); //Change border to green
			$("#endGameScreen").show(500); //Show the message
		}
		setTimeout(function(){ //After 2.7 seconds of showing the message, the message will disappear and a new game screen appears.
			userBet=""; //Reset bets
			$("#btnBet").css("opacity", 0); //Make bet button invisible again
			user.sum=0; //Reset user's sum
			dealer.sum=0; //Reset dealer's sum
			cardsTaken=[]; //Reset the cardsTaken array
			$("#userCards").empty(); //Reset Cards
			$("#dealerCards").empty();
			user.drawCard(true); //Draw new flipped cards
			user.drawCard(true);			
			dealer.drawCard(true);
			dealer.drawCard(true);
			//Show proper screens
			$("#endGameScreen").hide();
			$("#betScreen").show(500);
			$("#decisionScreen").hide();
			//Update all the labels
			game.update();
			//If you have 0 dollars, the game is over
			if (userBalance==0) {
				game.gameover();
				return;
			}
		}, 2700); //End of setTimeout function
	} //End of restart method
	gameover() { //This method is called when the game is fully over. It asks if the player wants to play again
		$("#gameoverMusic")[0].play(); //Play music
		$("#txtBet").prop("disabled", true); //Prevent more bets from being entered
		$("#lblEndGame").text("Game Over! You are out of money!"); //Display correct message
		$("#lblEndGame").css("color","red"); //Change colors
		$("#endGameScreen").css({"border-color":"red", "height":"42%"}); //Change the size of box
		$("#endGameScreenWrap").css({"height":"42%"});
		$("#btnPlayAgain").show(); //Show the play again button, and the entire wrapper div.
		$("#endGameScreen").show(100);
	} //End of gameover method
	update() { //This method updates all the labels when called
		$("#lblUserBalance").text("Balance: $" + userBalance); //Update the balance
		$("#lblUserBet").text("Bet: $"+userBet); //Update the bet
		$("#lbluserSum").text(user.sum); //Update the user's sum
		$("#lbldealerSum").text(dealer.sum); //Update the dealer's sum
	} //End of update method
} //End of Game class
//*********************<<Dhiren April 24, 2020 2pm I wrote this function prevents user's from entering non-number bets***********************
function isNumber(keyPressed) { //This function prevents user's from entering non-number bets
	if(keyPressed>=0 && keyPressed<=9) { //Key must be 0-9
		return true;
	}
	else {
		return false;
	}
} //End of isNumber function
//This function converts the random number to the actual value of the card.
function getCardValue(cardNumber) {
	let cardValue=cardNumber%13; //13 cards in every set
	if (cardValue==0 || cardValue==11 || cardValue==12) { //If card is J, Q, K, it is worth 10 points
		cardValue=10;
	}
	return cardValue; //Return the value of the card.
}
//*********************<<Tarun + Dhruv April 23, 2020 11pm Created how the game starts with the Betting Code***********************
//Global Variables
let user=new Player("user"); //Instantiate the Player class for the user
let dealer=new Player("dealer"); //Instantiate the Player class for the dealer
let game=new Game(); //Instantiate the Game class for the game
let userBalance=100;
let userBet=0;
let cardsTaken=[];
let musicStatus=0;
$(document).ready(function() { //Proceed when JQuery has loaded
	$("#btnStart").click(function() { //Code block triggers when btnStart is clicked
		if (!$("#txtName").val() || !$("input[name='avatar']:checked").val()) { //If name or avatar is empty, the game will not proceed
			$("#dialog").dialog();
		}
		else { //Else, the game starts
			user.name=$("#txtName").val(); //Save the player's name 	
			user.avatar=$("input[name='avatar']:checked").val(); //Save the avatar 
			$("#playerAvatar").css("background-image", "url(images/avatar/"+user.avatar+".PNG)"); //Display the chosen avatar
			$("#playerName").text(user.name); //Display the chosen name
			$("#homeScreen").hide();//hide home screen for game
			$("#gameScreen").show();//show game screen
			//Slide in animations
			$("#betScreen").show(500);
			$("#playerInfoScreen").show(500);
			$("#gameInfoScreen").show(500);
			$("#cardScreen").show(500);
			$("#toggleMusicScreen").show(500);
			$('#betScreen').effect('highlight',{},2500); //Highlighting animation (To show the user where to start)
		}
	});	//End of btnStart click event
	/*********************<<Aaron + Dhiren April 24, 2020 2pm Set up betting***********************/
	$("#txtBet").on("input", function() { //Triggers every time the txtBet field is altered		
		userBet=+$("#txtBet").val(); //Save what the user's bet every time they enter a digit
		if (userBet>0 && userBet<=userBalance) { //If the bet is valid (less than balance and greater than 0), the btnBet will be shown
			$("#btnBet").css("opacity", 1); //Make button visible
			$("#btnBet").prop("disabled", false); //Enable button
		}
		else { //Else (bet is not valid), don't show the button on screen
			$("#btnBet").css("opacity", 0); //Make button invisible
			$("#btnBet").prop("disabled", true); //Disable button
		}
	}); //End of txtBet .on event
	$("#btnBet").click(function() { //Triggers when btnBet is clicked
		$("#cardsMusic")[0].play();//Play shuffle music
		$("#dealerCards").empty();//Empty the flipped cards
		$("#userCards").empty();//Empty the flipped cards
		userBalance-=userBet;//Subtract userBalance by bet
		user.drawCard(); //Draw user card
		user.drawCard(); //Draw user card
		dealer.drawCard(); //Draw dealer card
		dealer.drawCard(true); //Draw a flipped dealer card
		$("#betScreen").stop(true, true);//Stop the highlighting animation
		$("#betScreen").hide();//Hide bet screen 
		$("#decisionScreen").show(500);//Show hit, stay, double buttons
		$("#btnHit").prop("disabled", false); //Enable the hit and stay button
		$("#btnStay").prop("disabled", false);
		$("#btnBet").prop("disabled", true); //Disable the bet button since bet is already submitted
		$("#txtBet").val(""); //Empty bet text box
		game.update(); //Updates all the labels 
		if (userBet>userBalance) { //If the user's bet is greater than balance, they cannot double
			$("#btnDouble").attr("disabled", true); //Disable the button
			$("#btnDouble").css("cursor","not-allowed"); //Change the cursor
		}
		else { //Else (userBet <= userBalance), they can double
			$("#btnDouble").prop("disabled", false); //Enable the button
			$("#btnDouble").css("cursor","pointer"); //Change cursor
		}
	}); //End of btnBet .click event
	//*********************<<Aaron April 22, 2020 11pm With the help of Tarun, I added code to check who wins or loses the game***********************
	$("#btnHit").click(function() { //When hit button is clicked, code block triggers
		user.drawCard(); //Draw a new card
		if (user.isBust()) { //If the user's sum is greater than 21, the game restarts
			game.restart(-1, "You Bust!");
		}
	}); //End of btnHit .click event
	$("#btnStay").click(function() { //When stay button is clicked, code block triggers
		$("#flipped").remove(); //Remove the dealer's flipped cards
		while (dealer.sum<=16) { //The dealer keeps drawing cards when its sum is less than or equal to 16
			dealer.drawCard();
		} //End of while loop
		if (dealer.isBust()) { //If the dealer's sum is greater than 21, they lose and the user wins automatically
			game.restart(1, "$$$ Dealer Bust!");
		}
		else if(dealer.sum<user.sum) { //If the dealer's sum is less than the user's sum, user wins
			game.restart(1, "$$$ You win!");
		}
		else if (dealer.sum>user.sum) { //If the dealer's sum is greater than the user's sum, dealer wins
			game.restart(-1, "Dealer wins!");
		}		
		else { //If sums are the same, then it is a tie
			game.restart(0, "You tied!");
		}
	});  //End of btnStay .click event
	$("#btnDouble").click(function() { //When double button is clicked, code block triggers
		userBalance-=userBet; //Subtract bet from user once again
		userBet*=2; //Double the bet 
		$("#btnDouble").attr("disabled", true); //Disable the button after 1 use
		$("#btnDouble").css("cursor","not-allowed"); //Change the cursor to not-allowed
		game.update(); //Update the labels
	}); //End of btnDouble .click event
	$("#btnPlayAgain").click(function(){ //When the user clicks btnPlayAgain, this code block triggers
		location.reload(); //Refresh the page for fresh start
	}); //End of btnPlayAgain .click event
	//*********************<<Dhruv May 1st, 2020 1pm I set up the Toggle music part of the code***********************
	$("#toggleMusicScreen").click(function() { //When the toggleMusicScreen button is clicked, this code block triggers
		if (musicStatus==1) { //If music is ON, then disable the music
			musicStatus=0; //Set music to OFF
			$("#toggleMusicScreen").css("background-image", "url(images/mute.png)"); //Change the image to 'muted' symbol
			$("#jazzMusic")[0].pause(); //Pause music
		}
		else { //Else (music is OFF), then enable music
			$("#jazzMusic")[0].play(); //Play music
			musicStatus=1; //Set music to ON
			$("#toggleMusicScreen").css("background-image", "url(images/sound.png)"); //Change the image to the 'playing' symbol
		}		
	}); //End of toggleMusicScreen .click event
});//End of document ready 