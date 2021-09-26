
//game globals 
const VELOCITY = 1


const CUBE_WIDTH = 50;
const CUBE_HEIGHT = 50;

//screen size
const MAX_WIDTH = document.body.clientWidth;
const MAX_HEIGHT = document.body.clientHeight;

//canvas size 

const CANVAS_WIDTH = (MAX_WIDTH - (MAX_WIDTH % CUBE_WIDTH))
const CANVAS_HEIGHT = (MAX_HEIGHT - (MAX_HEIGHT % CUBE_HEIGHT))

//treats the cubes as 1 x 1
const GAME_WIDTH = CANVAS_WIDTH / CUBE_WIDTH;
const GAME_HEIGHT = CANVAS_HEIGHT / CUBE_HEIGHT;

//canvas globals 
//might move this down
const CANVAS = document.getElementById("game");
const CTX = CANVAS.getContext("2d");

CANVAS.width = CANVAS_WIDTH;
CANVAS.height = CANVAS_HEIGHT;


class Cube {

  constructor(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.color =  "#" + Math.floor(Math.random()*16777215).toString(16);
  }


  update(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
  }


  draw(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(
      this.xPos * CUBE_WIDTH, 
      this.yPos * CUBE_HEIGHT, 
      CUBE_WIDTH,
      CUBE_HEIGHT
    );

    ctx.fillStyle = this.color;

    let border = Math.round(CUBE_WIDTH * .1);
    ctx.fillRect(
      this.xPos * CUBE_WIDTH + border,  
      this.yPos * CUBE_HEIGHT + border, 
      CUBE_WIDTH - (border * 2),
      CUBE_HEIGHT - (border * 2)
    );
  }


}


class Snake {
  constructor() {
    this.xVelocity = VELOCITY;
    this.yVelocity = 0;
    this.head = new Cube(0,0)
    this.snake = [this.head];
  }



  update() {
    //change cube Velocity
    
    if (this.snake.length > 1) {
      for (let i = this.snake.length - 1; i > 0; i--) {
        let second = this.snake[i];
        let first = this.snake[i - 1];
        second.update(first.xPos, first.yPos);
      }
    }

    let head = this.snake[0];
    let newX = head.xPos + this.xVelocity;
    let newY = head.yPos + this.yVelocity;

    head.update(newX, newY);
  }


  setVelocity(xVelocity, yVelocity) {
    this.xVelocity = xVelocity;
    this.yVelocity = yVelocity;
  }


  increaseLength() {
    let last = this.snake[this.snake.length - 1];
    let xDir = Math.sign(last.xVelocity);
    let yDir = Math.sign(last.yVelocity);
    if (xDir == 0 && yDir == 0) {
      xDir = 1;
    }

    this.snake.push(
      new Cube(
        last.xPos - xDir,
        last.yPos - yDir, 
        last.xVelocity,
        last.yVelocity
      )
    )
  }


  draw(ctx) {
    for (let i = 0; i < this.snake.length; i++) {
      this.snake[i].draw(ctx);  
    }
  }


}

const controls = {
  left : "37",
  right : "39",
  up : "38",
  down : "40",
}


class Game {


  constructor(onSnakeEat, onSnakeCrash) {

    this.onSnakeEat = onSnakeEat;
    this.onSnakeCrash = onSnakeCrash;

    this.snake = new Snake();
    this.createFood();

  }

  createFood() {
    let x = Math.round(Math.random() * (GAME_WIDTH - 1))
    let y = Math.round(Math.random() * (GAME_HEIGHT - 1))
    this.food = new Cube(x, y);
  }


  update() {
    if ( (this.snake.head.xPos == this.food.xPos) && (this.snake.head.yPos == this.food.yPos) ) {
      this.createFood()
      this.snake.increaseLength();
      this.onSnakeEat();
    }

    //collissions
    let head = this.snake.head;


    if (head.xPos >= GAME_WIDTH || head.yPos >= GAME_HEIGHT || head.xPos < 0 || head.yPos < 0)  {
      this.onSnakeCrash(this);
    }

    else {
      //wont work after collsion cause no update 
      CTX.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      this.snake.draw(CTX);
      this.food.draw(CTX);
      this.snake.update();
    }


  }  

  onKeyDown(event) {
    if (event.keyCode == controls.left) {
      this.snake.setVelocity(-VELOCITY, 0);
    }
    else if (event.keyCode == controls.right) {
      this.snake.setVelocity(VELOCITY, 0);

    }
    else if (event.keyCode == controls.up) {
      this.snake.setVelocity(0, -VELOCITY);

    }
    else if (event.keyCode == controls.down) {
      this.snake.setVelocity(0, VELOCITY);
    }
  }

}







class GameHandler{
  constructor() {

    this.game = new Game(
      this.onGameEat.bind(this), 
      this.onGameOver.bind(this)
    );
  }

  onGameEat() {
    //update score view
    console.log("MUNCH")
  }

  onGameOver() {
    //bring up play panel
    console.log("DEAD")
    clearInterval(this.interval);
    document.removeEventListener("keydown", this.keydown);
    createGame()
  }

  run() {
    console.log("running");
    this.keydown = document.addEventListener("keydown", this.game.onKeyDown.bind(this.game))

    this.interval = setInterval(this.game.update.bind(this.game), 120)

  }
}



function createGame() {
  game = new GameHandler();
  game.run();

}


createGame();



