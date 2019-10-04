document.addEventListener("DOMContentLoaded", function(){
  (function(globalScope){
    var theGame = {};
    var myGamePiece;
    var myGameObstacle;
    var myGameObstacles = [];
    var myGameScore;
    var myBackgrounds = [];
    var mySound;
  
    function startGame(){
      myGameArea.start();
      myGamePiece = new component(30,20,"flappy-bird.png",10,120, "image piece");
      myGameObstacle = new component(10,200,"green",300,120);
      myGameScore = new component("20px","Arial","black",300,50,"text");
      myBackgrounds.push (new component(700,300,"flappy-bird-background.png",0,0,"image"));
      mySound = new sound("background-music.mp3");
      mySound.play();
      // myUpBtn = new component(30, 30, "green", 50, 10); 
      // myDownBtn = new component(30, 30, "green", 50, 70); 
      // myLeftBtn = new component(30, 30, "green", 20, 40); 
      // myRightBtn = new component(30, 30, "green", 80, 40); 
    }
    
    var myGameArea = {
      canvas: document.createElement("canvas"),
      start: function(){
        this.frameNo = 0;
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);

        //Control by press and hold keys
        // window.addEventListener("keydown", function(event){
        //   myGameArea.keyCodes = (myGameArea.keyCodes || []);
        //   myGameArea.keyCodes[event.keyCode] = true;
        // });
        // window.addEventListener("keyup", function(event){
        //   myGameArea.keyCodes[event.keyCode] = false;
        // });

        //Control by cursor
        // window.addEventListener("mousemove", function(event){
        //   myGameArea.x = event.pageX;
        //   myGameArea.y = event.pageY;
        // });

        // //Control by canvas button
        // window.addEventListener('mousedown', function(event){
        //   myGameArea.x = event.pageX;
        //   myGameArea.y = event.pageY;
        // });

        // window.addEventListener('mouseup', function(event){
        //   myGameArea.x = false;
        //   myGameArea.y = false;
        // });
      },
      clear:function(){
        this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
      },

      stop:function(){
        clearInterval(this.interval);
      }
    };

    function everyInterval(n){
      if(myGameArea.frameNo % n == 0){
        return true;
      }
      return false;
    };

    function sound(src){
      this.sound = document.createElement("audio");
      this.sound.src = src;
      this.sound.setAttribute("preload", "auto");
      this.sound.setAttribute("control", "none");
      this.sound.style.display = "none";
      this.sound.loop = true;
      document.body.appendChild(this.sound);
      this.play = function(){
        this.sound.play();
      };
      this.stop = function(){
        this.sound.pause();
      };
    };
  
    function component(width, height, color, x, y, type){
      this.rotateAngle = 0;
      this.bounce = 0.6;
      this.gravity = 0.05;
      this.gravitySpeed = 0;
      if (type == "image" || type == "image piece") {
        this.image = new Image();
        this.image.src = color;
      }
      this.type = type;
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      this.speedX = 0;
      this.speedY = 0;

      // //Control by canvas button
      // this.clicked = function(){
      //   var clicked = true;
        
      //   if(!(myGameArea.x >= this.x && myGameArea.x <= this.x + this.x + this.width 
      //     && myGameArea.y >= this.y && myGameArea.y <= this.y + this.height)){
      //     clicked = false; 
      //   }
        
      //   return clicked;
      // }

      this.newPos = function(haveGravity){
        if(haveGravity == true){
          this.gravitySpeed += this.gravity;
          this.y += this.gravitySpeed;
        }
        this.x += this.speedX;
        this.y += this.speedY;

        // // Control by mouse cursor
        // if(myGameArea.x && myGameArea.y){
        //   myGamePiece.x = myGameArea.x;
        //   myGamePiece.y = myGameArea.y;
        // }        
      };

      this.hitTheGround = function(){
        if(this.y + this.height >= myGameArea.canvas.height){
          return true;
        }
        return false;
      };

      if(this.type == "text"){
        this.update = function(){
          var ctx = myGameArea.context;
          ctx.font = this.width + " " + this.height;
          ctx.fillStyle = this.color;
          ctx.fillText(this.text, this.x, this.y);
        };
      }
      if(this.type == "image"){
        this.update = function(){
          var ctx = myGameArea.context;
          ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        };
      }
      if(this.type == "image piece"){
        this.update = function(){
          this.rotateAngle++;
          var ctx = myGameArea.context;
          ctx.save();
          ctx.translate(this.x,this.y)
          ctx.rotate(this.rotateAngle * Math.PI/180);
          ctx.drawImage(this.image, this.width/-2, this.height/-2, this.width, this.height);
          ctx.restore();
        };
      }
      if(this.type == undefined){
        this.update = function(){
          var ctx = myGameArea.context;
          ctx.fillStyle = color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
        }
      }

      this.crashWith = function(otherCmp){
        var ret = false;
        var topLeft = {x:this.x, y:this.y};
        var topRight = {x:this.x+this.width, y:this.y};
        var bottomRight = {x:this.x+this.width, y:this.y+this.height};
        var bottomLeft = {x:this.x, y:this.y+this.height};

        if(
            (
              (topLeft.x >= otherCmp.x && topLeft.x <= otherCmp.x + otherCmp.width) &&
              (topLeft.y >= otherCmp.y && topLeft.y <= otherCmp.y + otherCmp.height)
            ) ||
            (
              (bottomRight.x >= otherCmp.x && bottomRight.x <= otherCmp.x + otherCmp.width) &&
              (bottomRight.y >= otherCmp.y && bottomRight.y <= otherCmp.y + otherCmp.height)
            ) ||
            (
              (topRight.x >= otherCmp.x && topRight.x <= otherCmp.x + otherCmp.width) &&
              (topRight.y >= otherCmp.y && topRight.y <= otherCmp.y + otherCmp.height)
            ) ||
            (
              (bottomLeft.x >= otherCmp.x && bottomLeft.x <= otherCmp.x + otherCmp.width) &&
              (bottomLeft.y >= otherCmp.y && bottomLeft.y <= otherCmp.y + otherCmp.height)
            )
        ){
          ret = true;
        }

        return ret;
      };
    };
  
    function updateGameArea(){
      myGameArea.clear();

      myGameArea.frameNo += 1;

      if(myGameArea.frameNo == 1 || everyInterval(150)){
        function getRndInteger(min, max) {
          return Math.floor(Math.random() * (max - min + 1) ) + min;
        }

        var obstacleCoord = {
          x:myGameArea.canvas.width,
          y:getRndInteger(50,myGameArea.canvas.height)
        };

        var coopObstacleCoord = {
          x:myGameArea.canvas.width,
          y:getRndInteger(0, obstacleCoord.y-50)
        };

        myGameObstacles.push(new component(10,myGameArea.canvas.height-obstacleCoord.y,"green",obstacleCoord.x,obstacleCoord.y));
        myGameObstacles.push(new component(10,coopObstacleCoord.y,"green",coopObstacleCoord.x, 0));
      }

      // //Just 1 obstacle
      // myGameObstacle.x -= 1;
      // myGameObstacle.update();

      if(myBackgrounds[myBackgrounds.length - 1].width + myBackgrounds[myBackgrounds.length - 1].x <= myGameArea.canvas.width){
        myBackgrounds.push(new component(700,300,"flappy-bird-background.png",myGameArea.canvas.width,0,"image"));
      }

      for(var i = 0;i<myBackgrounds.length;i++){
        myBackgrounds[i].speedX = -1;
        myBackgrounds[i].newPos();
        myBackgrounds[i].update();
      }     
      
      for(var i = 0;i<myGameObstacles.length;i++){
        myGameObstacles[i].x -= 1;
        myGameObstacles[i].update();
      }

      // //Control by canvas button
      // if(myGamePiece.x && myGamePiece.y){
      //   if(myUpBtn.clicked()){
      //     theGame.moveUp();
      //   }
      //   if(myDownBtn.clicked()){
      //     theGame.moveDown();
      //   }
      //   if(myLeftBtn.clicked()){
      //     theGame.moveLeft();
      //   }
      //   if(myRightBtn.clicked()){
      //     theGame.moveRight();
      //   }
      //   if(!(myUpBtn.clicked() || myDownBtn.clicked() || myLeftBtn.clicked() || myRightBtn.clicked())){
      //     theGame.stop();
      //   }
      // }
      

      //Controll by press and hold keys
      // myGamePiece.speedX = 0;
      // myGamePiece.speedY = 0;
      // if(myGameArea.keyCodes && myGameArea.keyCodes[37]) {myGamePiece.speedX = -1;}
      // if(myGameArea.keyCodes && myGameArea.keyCodes[39]) {myGamePiece.speedX = 1;}
      // if(myGameArea.keyCodes && myGameArea.keyCodes[38]) {myGamePiece.speedY = -1;}
      // if(myGameArea.keyCodes && myGameArea.keyCodes[40]) {myGamePiece.speedY = 1;}
      
      if(myGamePiece.hitTheGround() == true && myGamePiece.speedY != -1){
        theGame.stop();
        theGame.drop();
      }
      myGamePiece.newPos(true);
      myGamePiece.update();  

      // //Just 1 obstacle
      // if(myGamePiece.crashWith(myGameObstacle)){
      //   myGameArea.stop();
      // }

      for(var i = 0;i<myGameObstacles.length;i++){
        if(myGamePiece.crashWith(myGameObstacles[i])){
          var gameOverSound = new sound("game-over-sound.mp3");
          gameOverSound.sound.loop = false;
          gameOverSound.play();
          myGameArea.stop();
          mySound.stop();
        }
      }

      myGameScore.text = "Score" + myGameArea.frameNo;
      myGameScore.update();
            
      // //Control by canvas button
      // myUpBtn.update();
      // myDownBtn.update();
      // myLeftBtn.update();
      // myRightBtn.update();
    };
  
    theGame.moveRight = function (){
      myGamePiece.image.src = "flappy-bird-angry.png";
      myGamePiece.speedX = 1;
    };

    theGame.moveLeft = function (){
      myGamePiece.image.src = "flappy-bird-angry.png";
      myGamePiece.speedX = -1;
    };

    theGame.moveUp = function (){
      myGamePiece.image.src = "flappy-bird-angry.png";
      myGamePiece.speedY = -1;
      myGamePiece.gravitySpeed = 0;
      myGamePiece.gravity = 0;
    };

    theGame.moveDown = function (){
      myGamePiece.image.src = "flappy-bird-angry.png";
      myGamePiece.speedY = 1;
    };

    theGame.stop = function(){
      myGamePiece.image.src = "flappy-bird.png";
      myGamePiece.speedX = 0;
      myGamePiece.speedY = 0;
      myGamePiece.gravity = 0;
      myGamePiece.gravitySpeed = -(myGamePiece.gravitySpeed * myGamePiece.bounce)
    };

    theGame.drop = function(){
      myGamePiece.image.src = "flappy-bird.png";
      myGamePiece.gravity = 0.05;
      myGamePiece.speedY = 0;
    }


    startGame();



    globalScope.theGame = theGame;
  })(window);
});