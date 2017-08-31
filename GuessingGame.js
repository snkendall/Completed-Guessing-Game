function generateWinningNumber(){
    return Math.floor(Math.random()*100 + 1);
}

function shuffle(arr){
    var m = arr.length;

    while(m){
        var i = Math.floor(Math.random() * m--);
        var placeHolder = arr[m];
        arr[m] = arr[i];
        arr[i] = placeHolder;
    }
    return arr;
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
    var diff = this.winningNumber - this.playersGuess;
    if (diff < 0){
        return -diff;
    }
    return diff;
}

Game.prototype.isLower = function(){
    if (this.playersGuess < this.winningNumber){
        return true;
    }
    return false;
}

Game.prototype.checkGuess = function(){

    if (this.playersGuess === this.winningNumber){
        return 'You Win!';
    } else if (this.pastGuesses.indexOf(this.playersGuess) > -1){
        return 'You have already guessed that number.';
    } else {
        this.pastGuesses.push(this.playersGuess);
        $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
        if (this.pastGuesses.length > 4){
            return 'You Lose.'
        } else if (this.difference() < 10){
            return "You're burning up!";
        } else if (this.difference() < 25){
            return "You're lukewarm.";
        } else if (this.difference() < 50){
            return "You're a bit chilly.";
        } else {
            return "You're ice cold!";
        }
    }
}

Game.prototype.playersGuessSubmission = function(num){
    if (0 < num && num < 101 && typeof num === 'number'){
        this.playersGuess = num;
        return this.checkGuess();
    } else {
        throw 'That is an invalid guess.';
    }
}

function newGame(){
    return new Game();
}

Game.prototype.provideHint = function(){
    var hintArray = [];
    hintArray.push(this.winningNumber);
    hintArray.push(generateWinningNumber());
    hintArray.push(generateWinningNumber());
    return shuffle(hintArray);
}

function playerGuessed (game){
    var value = +$('#player-input').val();
    var smallNotice = $('#headers').find('h3');
    var process = game.playersGuessSubmission(value);
    $('#player-input').val('');
    $('#headers').find('h1').text(process);

    console.log(process);
    if (process === 'You have already guessed that number.'){
        smallNotice.text('You already guessed that, guess again.');
    
    } else if (process === "You Win!" || process === "You Lose."){
        smallNotice.text('Hit Reset to Play Again');
        $('#submit, #hint').prop('disabled', true);
    } else {
        smallNotice.text("Don't get too worked up now");
    }
}

$(document).ready(function(){
    var game = new Game();
    $('#submit').on('click', function(){
        playerGuessed(game);
    });
    $('#player-input').on('keypress', function(event){
        if (event.which == 13){
            playerGuessed(game);
        }
    });
    $('#reset').on('click', function(){
        game = new Game();
        $('#headers h1').text("It's a Super Exciting Guessing Game!!!");
        $('#headers h3').text("Don't get too worked up now");
        $('#headers h2').text("Pick a number 1 through 100");
        $('.guess').text("-");
        $('#submit, #hint').prop('disabled', false);
    });
    $('#hint').on('click', function(){
        if (game.isLower()){
            $('#headers').find('h3').text("You're Too Low");
        } else {
            $('#headers').find('h3').text("You're Too High");
        }
    })

});
