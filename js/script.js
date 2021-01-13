// Each time this function is called a GameObject
// is create based on the arguments
// In JavaScript you can consider everything an Object
// including functions
// Author Dawid Jerdonek

// get a handle to the canvas context
var canvas = document.getElementById("game");

// get 2D context for this canvas
var context = canvas.getContext("2d");

//Used for animation
var currentFrame = 0;
var frames = 6;
var initial = new Date().getTime();
var current; // current time

//Used for enemy animation
var enemyCurrentFrame = 0;
var enemyFrames = 6;
var enemyInitial = new Date().getTime();
var enemyCurrent; // current time

var deathSound = document.getElementById("sound_of_death");

//Healthbar positions
var barX = 200;
var barY = 300;

// Array of Weapon Options
var options = [{
    "text": "Select a Weapon",
    "value": "No Weapon",
    "selected": true
  },
  {
    "text": "Spear",
    "value": "Spear"
  },
  {
    "text": "Sword",
    "value": "Longsword"
  },
  {
    "text": "Knife",
    "value": "Stilleto Knife"
  },
  {
    "text": "Crossbow",
    "value": "Crossbow"
  },
  {
    "text": "Assault Rifle",
    "value": "Ak-47"
  }
];

//Allow for weapon selection
function weaponSelection() {
  var selection = document.getElementById("equipment").value;
  var active = document.getElementById("active");
  if (active.checked == true) {
    document.getElementById("HUD").innerHTML = selection + " active ";
    console.log("Weapon Active");
  } else {
    document.getElementById("HUD").innerHTML = selection + " selected ";
    console.log("Weapon Selected");
  }
}

var selectBox = document.getElementById('equipment');

for (var i = 0; i < options.length; i++) {
  var option = options[i];
  selectBox.options.add(new Option(option.text, option.value, option.selected));
}

function GameObject(name, img, width, health, x, y) 
{
    this.name = name;
	this.img = new Image(); // Setup image
    this.img.src = img;
	this.width = width;
    this.health = health;
    this.x = x; //Will = to the value we assign
    this.y = y; //Will = to the value we assign
}

// GamerInput (Left, Right, Up, Down)
function GamerInput(input) {
    this.action = input;
}

// Default GamerInput is set to None
var gamerInput = new GamerInput("None"); //No Input

// Default Player
var player = new GameObject("Player", "./img/player.png", 384, 100, 200, 300);

// Gameobjects is a collection of the Actors within the game
var gameobjects = [player, new GameObject("NPC", "./img/1to6.png", 384, 100, 600, 600)];

// Process keyboard input event
function input(event) 
{
    // Take Input from the Player
    //console.log("Input");
    // console.log("Event type: " + event.type);

    if (event.type === "keydown") {
        switch (event.keyCode) {
            case 37:
                gamerInput = new GamerInput("Left");
                break; //Left key
            case 38:
                gamerInput = new GamerInput("Up");
                break; //Up key
            case 39:
                gamerInput = new GamerInput("Right");
                break; //Right key
            case 40:
                gamerInput = new GamerInput("Down");
                break; //Down key
            default:
                gamerInput = new GamerInput("None"); //No Input
        }
    } 
	else 
	{
        gamerInput = new GamerInput("None"); //No Input
    }
    // console.log("Gamer Input :" + gamerInput.action);
}

function update() 
{
	
    // Iterate through all GameObjects
    // Updating position and gamestate
    // console.log("Update");
    
    if (gamerInput.action === "Up") 
	{
		//Move player up
		gameobjects[0].y -= 4;
		barY -= 4;
		console.log(gameobjects[0].name + " at X: " + gameobjects[0].x + "  Y: " + gameobjects[0].y);
		animate();
    }
		
	if (gamerInput.action === "Left") 
	{
		//Move player left
        gameobjects[0].x -= 4;
		barX -= 4;
		console.log(gameobjects[0].name + " at X: " + gameobjects[0].x + "  Y: " + gameobjects[0].y);
		animate();
    }
		
	if (gamerInput.action === "Right") 
	{
		//Move player right
        gameobjects[0].x += 4;
		barX += 4;
		console.log(gameobjects[0].name + " at X: " + gameobjects[0].x + "  Y: " + gameobjects[0].y);
		animate();
    }
		
    if (gamerInput.action === "Down") 
	{
		//Move player down
        gameobjects[0].y += 4;
		barY += 4;
		console.log(gameobjects[0].name + " at X: " + gameobjects[0].x + "  Y: " + gameobjects[0].y);
		animate();
    }

	if (gameobjects[0].health >= 0) 
	{
	collision();
	}
	healthBar();
}

// Draw GameObjects to Console
// Modify to Draw to Screen

function draw() 
{
	// Clear Canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
    // Iterate through all GameObjects
	
    for (i = 0; i < gameobjects.length - 1; i++) 
	{
        if (gameobjects[i].health > 0) 
		{
            //console.log("Image :" + gameobjects[i].img);
			
			// Draw each player GameObject  (img, width, health, x, y)
							 //Image which we use - Allow image to animate using current frame    -    - draw using the width of each frame - the height of the image - position x       - position y     -
			context.drawImage(gameobjects[i].img, (gameobjects[i].img.width /frames) * currentFrame, 0 ,(gameobjects[i].img.width /frames), gameobjects[i].img.height, gameobjects[i].x, gameobjects[i].y, 100, 100);
			
        }
	}
	
    for (i = 1; i < gameobjects.length; i++) 
	{
        if (gameobjects[i].health > 0) 
		{
			
			// Draw each enemy GameObject  (img, width, health, x, y)
			context.drawImage(gameobjects[i].img, (gameobjects[i].img.width /enemyFrames) * enemyCurrentFrame, 0 ,(gameobjects[i].img.width /enemyFrames), gameobjects[i].img.height, gameobjects[i].x, gameobjects[i].y, 100, 100)

        }
    }	
	healthBar();
}

function gameloop() 
{
    update();
    draw();
    window.requestAnimationFrame(gameloop);
}

function animate() 
{
    current = new Date().getTime(); // update current
    if (current - initial >= 500) { // check is greater than 500 ms
        currentFrame = (currentFrame + 1) % frames; // update frame
        initial = current; // reset initial
    } 
	healthBar();
}
function animateEnemy() 
{
    enemyCurrent = new Date().getTime(); // update current
    if (enemyCurrent - enemyInitial >= 500) { // check is greater than 500 ms
        enemyCurrentFrame = (enemyCurrent + 1) % enemyFrames; // update frame
        enemyInitial = enemyCurrent; // reset initial
    } 
}

// Draw a HealthBar on Canvas, can be used to indicate players health
function healthBar() 
{
	var width = 100;
	var height = 20;
	var max = 100;
	var val = gameobjects[0].health;

	// Draw the background
	context.fillStyle = "#000000";
	context.clearRect(barX , barY - 30, width, height);
	context.fillRect(barX, barY - 30, width, height);

	// Draw the fill
	if(gameobjects[0].health >= 30)
	{
		context.fillStyle = "#00FF00";
	}
	else if(gameobjects[0].health < 30)
	{
	context.fillStyle = "#FF0000";
	}
	var fillVal = Math.min(Math.max(val / max, 0), 1);
	context.fillRect(barX, barY - 30, fillVal * width, height);
}

function collision()
{
	var collisionX = gameobjects[1].x - gameobjects[0].x;
	var collisionY = gameobjects[1].y - gameobjects[0].y;
	

	if (collisionX < 60 && collisionX > -60) 
	{
		if(collisionY > - 100 && collisionY < 100) 
		{	
			if (gameobjects[0].health >= 1) 
			{
			animateEnemy()
			gameobjects[0].health = gameobjects[0].health - 1;
			console.log("Health :" + gameobjects[0].health);
	
			} 
			else 
			{
				//Play death sound
				deathSound.play();
				console.log(gameobjects[0].name + " at X: " + gameobjects[0].x + "  Y: " + gameobjects[0].y + " You died :'(");
				gameobjects[0].health = gameobjects[0].health - 1; //Ensures the death sound will play once
			}
		}
	}
}

function buttonOnClickX()
{
	//alert("X");
	
	//Move player left
        gameobjects[0].x -= 10;
		barX -= 10;
		console.log(gameobjects[0].name + " at X: " + gameobjects[0].x + "  Y: " + gameobjects[0].y);
		animate();
}
function buttonOnClickY()
{
	//alert("Y");
	
	//Move player up
		gameobjects[0].y -= 10;
		barY -= 10;
		console.log(gameobjects[0].name + " at X: " + gameobjects[0].x + "  Y: " + gameobjects[0].y);
		animate();
}
function buttonOnClickA()
{
	//alert("A");
	
	//Move player down
        gameobjects[0].y += 10;
		barY += 10;
		console.log(gameobjects[0].name + " at X: " + gameobjects[0].x + "  Y: " + gameobjects[0].y);
		animate();
}
function buttonOnClickB()
{
	//alert("B");
	
	//Move player right
        gameobjects[0].x += 10;
		barX += 10;
		console.log(gameobjects[0].name + " at X: " + gameobjects[0].x + "  Y: " + gameobjects[0].y);
		animate();
}



// Handle Active Browser Tag Animation
window.requestAnimationFrame(gameloop);

// Handle Keypressed
window.addEventListener('keyup', input);
window.addEventListener('keydown', input);


