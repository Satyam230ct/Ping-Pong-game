var ball=document.getElementById("ball");
var rod1=document.getElementById("rod1");
var rod2=document.getElementById("rod2");

const storeName="PPName"; // Act As key for the local Storage
const storeScore="PPMaxScore";
const rod1Name="Rod 1";
const rod2Name="Rod 2";

let score, maxScore, movement, rod, ballSpeedX=2, ballSpeedY=2;

let gameOn=false;
let windowWidth = window.innerWidth, windowHeight = window.innerHeight;

// Using IIFE here
(function(){
        rod=localStorage.getItem(storeName);        // key Searching
        maxScore=localStorage.getItem(storeScore); // key searching
        if(rod==null || maxScore==null){
            alert("This is the first time you are playing this game. Let's Start");
            maxScore=0;
            rod="Rod 1";
        }
        else{
            alert(rod + " has maximum score of "+ maxScore*100);
        }   
        resetBoard(rod);
})();

function resetBoard(rodName){
    rod1.style.left=(windowWidth-rod1.offsetWidth)/2 +'px';
    rod2.style.left=(windowWidth-rod2.offsetWidth)/2 +'px';
    ball.style.left=(windowWidth-ball.offsetWidth)/2 +'px';

    // Lossing Player Will Get The ball
    if(rodName==rod2Name)
    {
        ball.style.top=(rod1.offsetTop+rod1.offsetHeight)+'px';
        ballSpeedY=2;
    }
    else{
        ball.style.top=(rod2.offsetTop-rod2.offsetHeight)+'px';
        ballSpeedY=-2;
    }
    score=0;    gameOn=false;
}

function storeWin(rod,score){
    if(score>maxScore)
    {
        maxScore=score;
        localStorage.setItem(storeName,rod); // Dublication of key will replace with new val
        localStorage.setItem(storeScore,score);
    }
    clearInterval(movement);
    resetBoard(rod);
    alert(rod + "wins with a score of "+ (score*100) + ". Max score is: "+( maxScore*100));
}


window.addEventListener('keypress', function (){
    let rodSpeed=20;
    let rodRect=rod1.getBoundingClientRect();

    if(event.code==="KeyD" && ((rodRect.x+rodRect.width) < window.innerWidth)){ // Applicable to move rtight
        rod1.style.left=(rodRect.x)+rodSpeed+'px';
        rod2.style.left=rod1.style.left;
    }
    else if(event.code==="KeyA" && (rodRect.x>0)){ // Means Eligiable to move left
        let dis_lft=(rodRect.x)-rodSpeed;
        if(dis_lft<0)dis_lft=0;
        rod1.style.left=dis_lft+'px';
        rod2.style.left=rod1.style.left;
    }

    if(event.code==="Enter"){
        if(!gameOn){
            gameOn=true;
            let ballRect=ball.getBoundingClientRect();
            let ballX=ballRect.x;
            let ballY=ballRect.y;
            let ballDia=ballRect.width;
            
            let rod1Height=rod1.offsetHeight;
            let rod2Height=rod2.offsetHeight;
            let rod1Width=rod1.offsetWidth;
            let rod2Width=rod2.offsetWidth;

            movement=setInterval(function(){
                // Move Ball
                ballX+=ballSpeedX;
                ballY+=ballSpeedY;
                
                let rod1X=rod1.getBoundingClientRect().x;
                let rod2X=rod2.getBoundingClientRect().x;

                // Ball New Location
                ball.style.left=ballX+'px';
                ball.style.top=ballY+'px';
                
                if((ballX+ballDia)>=windowWidth || ballX<=0) // Colliding with side walls
                {
                    ballSpeedX=-ballSpeedX; // Reversing The Direction
                }
                
                // It Specifies the Center of the ball on the viewport
                let ballPos=ballX+ballDia/2;
                // Check for Rod1
                if(ballY<=rod1Height){
                    ballSpeedY=-ballSpeedY; // Reverse The Direction
                    score++;
                    // Check if the game ends
                    if((ballPos<rod1X) || (ballPos>(rod1X+rod1Width))){
                        storeWin(rod2Name,score);
                    }
                }
                else if((ballY+ballDia)>=windowHeight-rod2Height) // Means Under Rod2 Zone
                {
                    ballSpeedY=-ballSpeedY; // Reversing The Direction
                    score++;
                    // Check If the game ends or not
                    if((ballPos<rod2X) || (ballPos>rod2X+rod2Width)){
                        storeWin(rod1Name,score);
                    }
                }
            },10);
        }
    }
});
// window.addEventListener('keypress',fun);