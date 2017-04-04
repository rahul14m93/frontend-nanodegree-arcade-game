

// Enemies our player must avoid
var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = x;
    this.y = y;
    this.speed = Math.floor((Math.random()*300)+200);
    this.sprite = 'images/enemy-bug.png';
    this.hasWon = false;

};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.checkCollisions();
    this.x += (this.speed * dt);
    if (this.x > 550) {
        this.x = -100;
        this.speed = Math.floor(200 + (Math.random() * 300));
        
    }
};

Enemy.prototype.checkCollisions = function() {
	if (player.y >= this.y - 60 && player.y <= this.y + 60) {
        if (player.x >= this.x - 60 && player.x <= this.x + 60) {
            player.init();
            stars.forEach(function(star) {
        		star.init();
    		});
        }
	}
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	if(player.hasWon){
		ctx.font = "30px Arial";
		ctx.fillText("You Won !!!",250,100);
	}
};

Enemy.prototype.repeat = function () {
  if (this.x > 500) {
    this.x = -100;
  }
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
	this.init();
    this.sprite = 'images/char-boy.png';
};


Player.prototype.init = function(){
	this.x = 200;
    this.y = 320;
    this.hasWon = false;
    this.stars = 0;
    this.score = 0;
};

Player.prototype.update = function(dt){

};

Player.prototype.checkHasWon = function(){
	if(this.y<0){
		console.log("Won");
		this.hasWon = true;
		setTimeout(function(){
			player.init();
			stars.forEach(function(star) {
	        	star.init();
	    	});
		},1000);
		
	}
};

Player.prototype.computeScore = function(){
	if(player.y>-10 && player.y<83 || player.y>=83 && player.y<166 || player.y>=166 && player.y<249){
		this.score = this.score +100;
	}
};

Player.prototype.handleInput = function(allowedKeys){
	
	console.log(allowedKeys);
	switch (allowedKeys) {

		// player arrow left
		case 'left':
		if (this.x > 0) {
			this.x=this.x-100;
			stars.forEach(function(star) {
				star.onCollect();
			});
		}
		break;
		// player arrow down
		case 'down':
		if (this.y <= 300) {
			this.y=this.y+83;
			stars.forEach(function(star) {
				star.onCollect();
			});
		}
		break;
		// player arrow right
		case 'right':
		if (this.x+100<405){
			this.x=this.x+100;
			stars.forEach(function(star) {
				star.onCollect();
			});
		}

		break;
		// player arrow up
		case 'up':
		if (this.y > 0) {
			this.y=this.y-83;
			this.checkHasWon();
			this.computeScore();
			stars.forEach(function(star) {
				star.onCollect();
			});
		}
		break;
	}
	
};

Player.prototype.render = function(){
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	ctx.font = "30px Arial";
	ctx.fillText("Score  : " + this.score,50,525);
	ctx.fillText("Stars  : " + this.stars,350,525);
};

var Stars = function(){
	this.sprite = "images/Star.png";
	this.init();
};

Stars.prototype.init = function(){
	this.x = 100 * Math.floor((Math.random() * 5) );
	var rand = Math.floor((Math.random() * 3) +1);
	this.y = (83* rand)-(10); 
};

Stars.prototype.update = function(dt){
	
};

Stars.prototype.onCollect = function(){
	if (player.y >= this.y - 60 && player.y <= this.y + 60) {
	        if (player.x >= this.x - 60 && player.x <= this.x + 60) {
	            player.stars++;
	            this.x = 9999;
    			this.y = 9999;
    			player.score = player.score+300;
	        }
    }
    
};

Stars.prototype.render = function(){
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [new Enemy(-100,60),new Enemy(-100,145),new Enemy(-100,230)];

var player = new Player(); 

var stars = [new Stars(),new Stars()];



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
