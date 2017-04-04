var TILE_WIDTH = 101,
    TILE_HEIGHT = 83;

/**
 * Represents the enemy
 * @constructor	
 */
var Enemy = function(x,y) {
    this.x = x;
    this.y = y;
    this.speed = Math.floor((Math.random()*300)+200);
    this.sprite = 'images/enemy-bug.png';
    this.hasWon = false;

};

/** Update the enemy's position
 * Parameter: dt, a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    this.checkCollisions();
    this.x += (this.speed * dt);
    if (this.x > 550) {
        this.x = -100;
        this.speed = Math.floor(200 + (Math.random() * 300));
        
    }
};

/** Check for collison */
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
/** Draw the enemy on the screen, required method for game */
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	if(player.hasWon){
		ctx.font = "30px Arial";
		ctx.fillText("You Won !!!",250,100);
	}
};


/**
 * Represents the player
 * @constructor	
 */
var Player = function() {
	this.init();
};

/** Initialize the player position and score */
Player.prototype.init = function(){
	this.x = 200;
    this.y = 320;
    this.sprite = 'images/char-boy.png';
    this.hasWon = false;
    this.stars = 0;
    this.score = 0;
};

Player.prototype.update = function(dt){

};

/** Check if the player has reached the water body, if he has then we restart the game after 1 second */
Player.prototype.checkHasWon = function(){
	if(this.y<0){
		console.log("Won");
		this.hasWon = true;
		var self = this;
		setTimeout(function(){
			self.init();
			stars.forEach(function(star) {
	        	star.init();
	    	});
		},1000);
		
	}
};

/** Compute score based on which stone layer the player has reached */
Player.prototype.computeScore = function(){
	if(this.y>-10 && this.y<TILE_HEIGHT || this.y>=TILE_HEIGHT && this.y<2*TILE_HEIGHT || this.y>=2*TILE_HEIGHT && this.y<3*TILE_HEIGHT){
		this.score = this.score +100;
	}
};

/** Method that handles all the input */
Player.prototype.handleInput = function(allowedKeys){
	console.log(allowedKeys);
	switch (allowedKeys) {

		/** player arrow left */
		case 'left':
		if (this.x > 0) {
			this.x=this.x-TILE_WIDTH;
			stars.forEach(function(star) {
				star.onCollect();
			});
		}
		break;
		/** player arrow down */
		case 'down':
		if (this.y <= 3*TILE_HEIGHT) {
			this.y=this.y+TILE_HEIGHT;
			stars.forEach(function(star) {
				star.onCollect();
			});
		}
		break;
		/** player arrow right */
		case 'right':
		if (this.x+TILE_WIDTH<4*TILE_WIDTH){
			this.x=this.x+TILE_WIDTH;
			stars.forEach(function(star) {
				star.onCollect();
			});
		}

		break;
		/** player arrow up */
		/** Only when the player moves up can he win and also when he moves to different stone layers he collects more points */
		case 'up':
		if (this.y > 0) {
			this.y=this.y-TILE_HEIGHT;
			this.checkHasWon();
			this.computeScore();
			stars.forEach(function(star) {
				star.onCollect();
			});
		}
		break;
	}
	
};

/** Draws Player on Screen and also the scoreboard and star counter */
Player.prototype.render = function(){
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	ctx.font = "30px Arial";
	ctx.fillText("Score  : " + this.score,50,525);
	ctx.fillText("Stars  : " + this.stars,350,525);
};

/**
 * Represents a Star
 * @constructor
 */
var Stars = function(){
	this.init();
};

/** Randomly assigns location of 2 stars on the grass blocks */
Stars.prototype.init = function(){
	this.sprite = "images/Star.png";
	this.x = TILE_WIDTH * Math.floor((Math.random() * 5) );
	var rand = Math.floor((Math.random() * 3) +1);
	this.y = (TILE_HEIGHT* rand)-(10); 
};

Stars.prototype.update = function(dt){
	
};

/** This method describes what happens when the player collects a star. 3 keys things happen
 * 1 - Star Counter is incremented
 * 2 - The collected screen is thrown off the screen
 * 3 - The Scoreboard is incremented
 */
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

/** Draws stars on the canvas */
Stars.prototype.render = function(){
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/** Now instantiate your objects.
 * Place all enemy objects in an array called allEnemies
 */
var allEnemies = [new Enemy(-100,60),new Enemy(-100,145),new Enemy(-100,230)];

var player = new Player(); 

var stars = [new Stars(),new Stars()];



/** This listens for key presses and sends the keys to your
 *	Player.handleInput() method. You don't need to modify this.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
