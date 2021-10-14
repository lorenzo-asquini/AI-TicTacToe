var cSide;
var lineDistance;

var canvasBounding;

var board = [];

var mouseX;
var mouseY;

var startsCPU;  //true if the cpu starts
var isFirstMoveCPU; //true if it is the first move for the CPU

var playerTurn;  //true if it is the human turn

var stop;  //true if someone won

function Start(){

    var sWidth = window.innerWidth;
    var sHeight = window.innerHeight;

    cSide = Math.min(0.8*sWidth, 0.8*sHeight);  //side of the canvas
    lineDistance = Math.round(cSide/3); //distance between lines

    startsCPU = false;
    playerTurn = false;

    whoStarts();

    for (var i = 0; i < 3; i++){
        board[i] = ['_', '_', '_',]; //empty board
    }

    //canvas dimension set
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    canvas.style.border = "3px solid #000000";
    canvas.width = cSide;
    canvas.height = cSide;
    var leftSpace = (sWidth-cSide)/2;
    canvas.style.left = leftSpace.toString()+"px";
    canvasBounding = canvas.getBoundingClientRect();

    //register click
    mouseX = 0;
    mouseY = 0;
    canvas.addEventListener("click", getClickPosition, false);

    //start game
    isFirstMoveCPU = true;
    stop = false;
    setInterval(function(){game(ctx)}, 10); //New frame every 10ms
}

function whoStarts(){

    if (document.getElementById("CPU").checked){  //CPU starts
        startsCPU = true;

    }else if (document.getElementById("you").checked) {  //human starts
        playerTurn = true;

    }else if (document.getElementById("random").checked){  //random start
        var rand = Math.floor(Math.random()*2);

        if (rand == 0){
            startsCPU = true;

        }else if (rand == 1){
            playerTurn = true;
        }
    }

    if(startsCPU){
        document.getElementById('starterWinner').innerHTML = "CPU starts!";

    }else if(playerTurn){
        document.getElementById('starterWinner').innerHTML = "You start!";
    }

    return;

}

function getClickPosition(e) {

    //x and y position of mouse
    mouseX = e.clientX - canvasBounding.left;
    mouseY = e.clientY - canvasBounding.top;

    return;

}

function drawAll(ctx){

    for (var i = 1; i < 3; i++){ //vertical lines

        ctx.beginPath();
        ctx.moveTo(i*lineDistance, 0);
        ctx.lineTo(i*lineDistance, cSide);
        ctx.stroke();

    }

    for (var i = 1; i < 3; i++){  //horizontal lines

        ctx.beginPath();
        ctx.moveTo(0, i*lineDistance);
        ctx.lineTo(cSide, i*lineDistance);
        ctx.stroke();

    }

    for (var i = 0; i < 3; i++){  //draw inserted signs
        for (var k = 0; k < 3; k++){
            if(board[i][k] != '_'){
                ctx.fillStyle = "black";
                ctx.font = lineDistance.toString()+"px Verdana";
                ctx.textAlign="center";
                ctx.textBaseline = "middle";
                ctx.fillText(board[i][k], (k+0.5)*lineDistance, (i+0.5)*lineDistance);
            }
        }
    }

    return;
}

function humanInsert(){

    if (playerTurn){
        for (var i = 0; i < 3; i++){  //get human click
            for (var k = 0; k < 3; k++){
                if ((mouseX > k*lineDistance)&&(mouseX < (k+1)*lineDistance)){  //x bound
                    if((mouseY > i*lineDistance)&&(mouseY < (i+1)*lineDistance)){  //y bound
                        if(board[i][k] == '_'){
                            board[i][k] = 'X';
                            playerTurn = false;
                        }
                    }
                }
            }
        }
    }

    return;

}

function firstMoveCPU(){  //CPU first move. Center or corner

    if(!playerTurn){

        var rand = Math.floor(Math.random()*2);

        if ((rand == 0)&&(board[1][1] == '_')){  //center if free
            board[1][1] = 'O';

        }else{

            do{  //iteratively search for a free random corner
                var pos = [0,2];
                var posX = pos[Math.floor(Math.random()*2)];
                var posY = pos[Math.floor(Math.random()*2)];

            }while(board[posX][posY] != '_');

            board[posX][posY] = 'O';

        }
    }

    return;
}

function horizontal_BlockWin_CPU(symbol1, symbol2){  //horizontal win/block. For preventing loss or winning (CPU only)

    var s1 = symbol1;  //if preventing loss, s1 is blocked, s2 is blocker
    var s2 = symbol2;  //if winning, s1 = s2

    for(var i = 0; i < 3; i++){
        if((board[i][0] == '_')&&(board[i][1] == s1)&&(board[i][2] == s1)){
            board[i][0] = s2;
            return true;
        }
    }

    for(var i = 0; i < 3; i++){
        if((board[i][0] == s1)&&(board[i][1] == '_')&&(board[i][2] == s1)){
            board[i][1] = s2;
            return true;
        }
    }

    for(var i = 0; i < 3; i++){
        if((board[i][0] == s1)&&(board[i][1] == s1)&&(board[i][2] == '_')){
            board[i][2] = s2;
            return true;
        }
    }
}

function vertical_BlockWin_CPU(symbol1, symbol2){  //vertical win/block. For preventing loss or winning (CPU only)

    var s1 = symbol1;  //if preventing loss, s1 is blocked, s2 is blocker
    var s2 = symbol2;  //if winning, s1 = s2

    for(var i = 0; i < 3; i++){
        if((board[0][i] == '_')&&(board[1][i] == s1)&&(board[2][i] == s1)){
            board[0][i] = s2;
            return true;
        }
    }

    for(var i = 0; i < 3; i++){
        if((board[0][i] == s1)&&(board[1][i] == '_')&&(board[2][i] == s1)){
            board[1][i] = s2;
            return true;
        }
    }

    for(var i = 0; i < 3; i++){
        if((board[0][i] == s1)&&(board[1][i] == s1)&&(board[2][i] == '_')){
            board[2][i] = s2;
            return true;
        }
    }
}

function diagonal_BlockWin_CPU(symbol1, symbol2){  //diagonal win/block. For preventing loss or winning (CPU only)

    var s1 = symbol1;  //if preventing loss, s1 is blocked, s2 is blocker
    var s2 = symbol2;  //if winning, s1 = s2


    if((board[0][0] == s1)&&(board[1][1] == s1)&&(board[2][2] == '_')){
        board[2][2] = s2;
        return true;
    }

    if((board[0][0] == s1)&&(board[1][1] == '_')&&(board[2][2] == s1)){
        board[1][1] = s2;
        return true;
    }

    if((board[0][0] == '_')&&(board[1][1] == s1)&&(board[2][2] == s1)){
        board[0][0] = s2;
        return true;
    }

    if((board[0][2] == s1)&&(board[1][1] == s1)&&(board[2][0] == '_')){
        board[2][0] = s2;
        return true;
    }

    if((board[0][2] == s1)&&(board[1][1] == '_')&&(board[2][0] == s1)){
        board[1][1] = s2;
        return true;
    }

    if((board[0][2] == '_')&&(board[1][1] == s1)&&(board[2][0] == s1)){
        board[0][2] = s2;
        return true;
    }
}

function winCPU(){  //CPU tries to win

    if(horizontal_BlockWin_CPU('O', 'O')){
        return true;

    }else if(vertical_BlockWin_CPU('O', 'O')){
        return true;

    }else if(diagonal_BlockWin_CPU('O', 'O')){
        return true;
    }

}

function blockPlayerWin(){  //CPU blocks human win

    if(!playerTurn){

        if (horizontal_BlockWin_CPU('X', 'O')){  //X is blocked
            return true;

        }else if (vertical_BlockWin_CPU('X', 'O')){
            return true;

        }else if (diagonal_BlockWin_CPU('X', 'O')){
            return true;
        }
    }
}

function intelCPUmoves(){  //intellingent CPU moves

    var s = 'O';
    var rand = Math.floor(Math.random()*2);

    //horizontal moves
    for(var i = 0; i < 3; i++){
        if((board[i][0] == '_')&&(board[i][1] == '_')&&(board[i][2] == s)){
            if (rand == 0){
                board[i][0] = s;
            }else {
                board[i][1] = s;
            }
            return true;
        }
    }

    for(var i = 0; i < 3; i++){
        if((board[i][0] == s)&&(board[i][1] == '_')&&(board[i][2] == '_')){
            if (rand == 0){
                board[i][1] = s;
            }else {
                board[i][2] = s;
            }
            return true;
        }
    }

    for(var i = 0; i < 3; i++){
        if((board[i][0] == '_')&&(board[i][1] == s)&&(board[i][2] == '_')){
            if (rand == 0){
                board[i][0] = s;
            }else {
                board[i][2] = s;
            }
            return true;
        }
    }

    //vertical moves
    for(var i = 0; i < 3; i++){
        if((board[0][i] == '_')&&(board[1][i] == '_')&&(board[2][i] == s)){
            if (rand == 0){
                board[0][i] = s;
            }else {
                board[1][i] = s;
            }
            return true;
        }
    }

    for(var i = 0; i < 3; i++){
        if((board[0][i] == s)&&(board[1][i] == '_')&&(board[2][i] == '_')){
            if (rand == 0){
                board[1][i] = s;
            }else {
                board[2][i] = s;
            }
            return true;
        }
    }

    for(var i = 0; i < 3; i++){
        if((board[0][i] == '_')&&(board[1][i] == s)&&(board[2][i] == '_')){
            if (rand == 0){
                board[0][i] = s;
            }else {
                board[2][i] = s;
            }
            return true;
        }
    }

    //diagonal moves
    if((board[0][0] == '_')&&(board[1][1] == '_')&&(board[2][2] == s)){
        if (rand == 0){
            board[0][0] = s;
        }else {
            board[1][1] = s;
        }
        return true;
    }

    if((board[0][0] == s)&&(board[1][1] == '_')&&(board[2][2] == '_')){
        if (rand == 0){
            board[1][1] = s;
        }else {
            board[2][2] = s;
        }
        return true;
    }

    if((board[0][0] == '_')&&(board[1][1] == s)&&(board[2][2] == '_')){
        if (rand == 0){
            board[0][0] = s;
        }else {
            board[2][2] = s;
        }
        return true;
    }

    if((board[0][2] == '_')&&(board[1][1] == '_')&&(board[2][0] == s)){
        if (rand == 0){
            board[0][2] = s;
        }else {
            board[1][1] = s;
        }
        return true;
    }

    if((board[0][2] == s)&&(board[1][1] == '_')&&(board[2][0] == '_')){
        if (rand == 0){
            board[1][1] = s;
        }else {
            board[2][0] = s;
        }
        return true;
    }

    if((board[0][2] == '_')&&(board[1][1] == s)&&(board[2][0] == '_')){
        if (rand == 0){
            board[0][2] = s;
        }else {
            board[2][0] = s;
        }
        return true;
    }
}

function fillCPUmove(symbol){ //no intelligent moves left, fill first gap

    var s = 'O';

    for (var i = 0; i < 3; i++){
        for (var k = 0; k < 3; k++){
            if(board[i][k] == '_'){
                board[i][k] = s;
                return;
            }
        }
    }
}

function movesCPU(){  //moves of the CPU

    if (!playerTurn){

        if(isFirstMoveCPU){
            firstMoveCPU();
            isFirstMoveCPU = false;
            return true;
        }

        if (winCPU()){
            return true;

        }else if(blockPlayerWin()){
            return true;

        }else if(intelCPUmoves()){
            return true;

        }else{
            fillCPUmove();
            return true;
        }
    }
}

function winner(symbol){   //if someone won

    var s = symbol;

    for(var i = 0; i < 3; i++){  //horizontal
        if((board[i][0] == s)&&(board[i][1] == s)&&(board[i][2] == s)){
            stop = true;
            return true;
        }
    }

    for(var i = 0; i < 3; i++){  //vertical
        if((board[0][i] == s)&&(board[1][i] == s)&&(board[2][i] == s)){
            stop = true;
            return true;
        }
    }

    if((board[0][0] == s)&&(board[1][1] == s)&&(board[2][2] == s)){  //diagonal 1
        stop = true;
        return true;
    }

    if((board[0][2] == s)&&(board[1][1] == s)&&(board[2][0] == s)){  //diagonal 2
        stop = true;
        return true;
    }

}

function noWinner(){  //needs to be called after checking if someone has won

    for (var i = 0; i < 3; i++){
        for (var k = 0; k < 3; k++){
            if(board[i][k] == '_'){
                return false;
            }
        }
    }

    stop = true;
    return true;

}

function game(ctx){

    if (!stop){

        if (startsCPU){
            firstMoveCPU();
            startsCPU = false;
            isFirstMoveCPU = false;
            playerTurn = true;
        }

        if(movesCPU()){
            playerTurn = true;
        }

        drawAll(ctx);

        winner('O');  //CPU

        if(noWinner()){
            document.getElementById('starterWinner').innerHTML = "NO WINNER!";
        }

        humanInsert();

        drawAll(ctx);

        winner('X');  //Human player

        if(noWinner()){
            document.getElementById('starterWinner').innerHTML = "NO WINNERS!";
        }

    }else{
        if(winner('X')){
            document.getElementById('starterWinner').innerHTML = "YOU WIN!";
        }else if(winner('O')){
            document.getElementById('starterWinner').innerHTML = "CPU WINS!";
        }
    }

    return;

}
