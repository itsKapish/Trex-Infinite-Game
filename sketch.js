var ground, ground_img, invisibleGround;
var trex ,trex_running, trex_collided, realTrex_roaring;
var jumpSound, checkpointSound, dieSound;
var cloud, cloud_flying, cloud_group;
var cactus, cactus_group, cactus_obstacle1, cactus_obstacle2, cactus_obstacle3, cactus_obstacle4, cactus_obstacle5, cactus_obstacle6;

var score = 0;

var PLAY = 1;
var END = 0;
var gamestate = PLAY;

var gameOver, gameOver_img
var restart, restart_img

function preload()
{
  
   gameOver_img = loadImage("gameOver.png");  
   restart_img = loadImage("restart.png");   
  
   trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");

   trex_collided = loadAnimation("trex_collided.png");
   realTrex_roaring = loadAnimation("trex.png");  
  
   jumpSound = loadSound("jump.mp3");
   checkpointSound = loadSound("checkPoint.mp3");
   dieSound = loadSound("die.mp3");
  
   ground_img = loadImage("ground2.png"); 
  
   cloud_flying = loadImage("cloud.png");
  
   cactus_obstacle1 = loadImage("obstacle1.png");
   cactus_obstacle2 = loadImage("obstacle2.png");
   cactus_obstacle3 = loadImage("obstacle3.png");
   cactus_obstacle4 = loadImage("obstacle4.png");
   cactus_obstacle5 = loadImage("obstacle5.png");
   cactus_obstacle6 = loadImage("obstacle6.png");
}

function setup()
{
  createCanvas(600,200)
  
  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("roaring", realTrex_roaring);
  trex.addAnimation("colliding", trex_collided);
  
  trex.scale = 0.5;
  
  trex.debug = false;
  //Xoffset, //Yoffset, //Radius of the Circle
  trex.setCollider("circle", 0,0,40); 
  
 //create the ground
  ground = createSprite(300,175,600,20);
  ground.addImage(ground_img);
  
  
  //creates the Invisible Ground
  invisibleGround = createSprite(300,185,600,5);
  invisibleGround.visible = false
  
  //creates the Gameover sign
  gameOver = createSprite(300,75);
  gameOver.addImage(gameOver_img);
    
  //creates the Restart button
  restart = createSprite(300,125)
  restart.addImage(restart_img);
   
  cloud_group = new Group(); 
  
  cactus_group = new Group(); 
  
}
 
function draw(){
  background("white");
  
  console.log();
  
  //section of Gamestate Play
  
  if(gamestate === PLAY)
  {
    
   gameOver.visible = false
   restart.visible = false
    
   ground.velocityX = -(6 + Math.round(score/500));
    
    if(score % 500 === 0 && score > 0){
    checkpointSound.play();  
    } 
    
  //behaviour of the ground  
  if(ground.x < 0){
    ground.x = ground.width/2 
  } 
    
  //making the trex jump  
  if(keyDown("space") && (trex.y > 158)){
     trex.velocityY = -14;
     jumpSound.play();
  }
   
  //making the real trex
  if(keyDown("r")){
  trex.changeAnimation("roaring", realTrex_roaring); 
  trex.scale = 0.1  
  }  
      
   //adding gravity
  trex.velocityY = trex.velocityY + 0.8  
  
    
  //incrementation of the Score
  score = score + Math.round(getFrameRate()/60);
   
  //creating a scope for the Gamestate End
    
  if(trex.isTouching(cactus_group)){
  dieSound.play();
  gamestate = END  
  }
    
           
  spawnclouds();  
  spawncactus();
         
  }
  
  else 
  
  //section of Gamestate End
   
  if(gamestate === END)
  {
    
    ground.velocityX = 0
    
    cloud_group.setVelocityXEach(0); 
    cactus_group.setVelocityXEach(0);
    
    cloud_group.setLifetimeEach(-1); 
    cactus_group.setLifetimeEach(-1);  
    
    trex.changeAnimation("colliding", trex_collided);
    trex.velocityY = 0
    trex.scale = 0.5
    
    gameOver.visible = true
    restart.visible = true
    
    if(mousePressedOver(restart)){
     restartgame();
    } 
    
  } 
  
  //collides the Trex with the Invisible Ground
  trex.collide(invisibleGround);
      
  //the score
  textSize(15)
  text ("Score : " + score, 500,35);
    
  
 drawSprites();
}



function spawnclouds()
{
  
  if(frameCount % 80 === 0)
  {
    
    //creates the cloud
    cloud = createSprite(600,75);
    cloud.addImage(cloud_flying); 
    cloud.scale = 0.5
    
    cloud.velocityX = -2
     
    cloud.y = Math.round(random(20,75));
    
    trex.depth = cloud.depth + 1
      
    cloud.lifetime = 300;
    
    cloud_group.add(cloud);
    
  }
  
}


function spawncactus()
{
  
  if(frameCount % 80 === 0)
  {
    
    //creates the cactus
    cactus = createSprite(600,160);
    cactus.velocityX = -(6 + Math.round(score/500));
    
    var rand = Math.round(random(1,6)); 
    
    switch(rand)
    {
      case 1 : cactus.addImage(cactus_obstacle1);
      break;
      
      case 2 : cactus.addImage(cactus_obstacle2);
      break;
      
      case 3 : cactus.addImage(cactus_obstacle3);
      break;
      
      case 4 : cactus.addImage(cactus_obstacle4);
      break;
    
      case 5 : cactus.addImage(cactus_obstacle5);
      break;
      
      case 6 : cactus.addImage(cactus_obstacle6);
      break;
      
      default : break;
        
    }
           
    cactus.scale = 0.5         
    
    cactus.lifetime = 300;
    
    cactus_group.add(cactus);
    
  }
  
}



 function restartgame()
{
  
  gameOver.visible = false
  restart.visible = false
  
  gamestate = PLAY  

  score = 0
  cactus_group.destroyEach();
  cloud_group.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  
}

