class Game {
  constructor(){

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(100,200);
    car1.addImage("car1",car1_img);
    car2 = createSprite(500,200);
    car2.addImage("car2",car2_img);
    cars = [car1, car2];
  }

  play(){
    form.hide();
    
    Player.getPlayerInfo();
    player.getCarsAtEnd();
    
    if(allPlayers !== undefined){
      background(255,255,255);
      image(track, 0,-displayHeight*4,displayWidth, displayHeight*5);
      
      //var display_position = 100;
      
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x1;
      var x2;
      var y;
  
      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;
        
        //position the cars a little away from each other in x direction
        x1 = allPlayers[plr].xPosition1;
        x2 = allPlayers[plr].xPosition2;
        //use data form the database to display the cars in y direction
        y = (displayHeight+20) - allPlayers[plr].distance;

      
        cars[index-1].x = x;
        cars[index-1].y = y;
       // console.log(index, player.index)

      
        if (index === player.index){
          stroke(10);
          fill("red");
          ellipse(x,y,60,60);
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y;
        }
       
        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }

    }

    if(keyIsDown(UP_ARROW) && player.index !== null){
      player.distance +=10
      player.update();
    }
   
    if(keyIsDown(RIGHT_ARROW) && player.index !== null){
      player.xPosition1 +=10
      player.update();
    }
    if(keyIsDown(LEFT_ARROW) && player.index !== null){
      player.xPosition1 -=10
      player.update();
    }
  
    if(player.xPosition1 > displayWidth/2-20){
      player.xPosition=displayWidth/2-20
      player.update();
    }
    if(player.xPosition1 < 10){
      player.xPosition=10
      player.update();
    }
    if(player.xPosition2 > displayWidth-10){
      player.xPosition=displayWidth-10
      player.update();
    }
    if(player.xPosition2 > displayWidth/2+20){
      player.xPosition=displayWidth/2+20
      player.update();
    }

    if(player.distance > 4000){
      gameState = 2;
      player.rank +=1
      Player.updateCarsAtEnd(player.rank)
    }
    if(player.distance < 2150){
      if(keyIsDown(38) && player.index !== null){
          yVel += 0.9;
          if(keyIsDown(37)){
              xVel -= 0.2;
          }
          if(keyIsDown(39)){
              xVel += 0.2;
          }
      }else if(keyIsDown(38) && yVel > 0 && player.index !== null){
          yVel -= 0.1;
          xVel *= 0.9;
      }else{
          yVel *= 0.985;
          xVel *= 0.985;
      }
    }

  //move the car
  player.distance += yVel;
  yVel *= 0.98;
  player.xPos += xVel;
  xVel *= 0.985;
  player.update();
   
    drawSprites();
  }

  end(){
    console.log("Game Ended");
    console.log(player.rank);
  }
}
