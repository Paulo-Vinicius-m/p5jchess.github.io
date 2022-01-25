import {INPUT_EVENT_TYPE, COLOR, Chessboard, MARKER_TYPE} from "../cm-chessboard-master/src/cm-chessboard/Chessboard.js"
import makemove from "/engine_main.js"
import Eval from "/evaluation_function.js"
import {Chess} from '/js/chess.js'
 
var promotion
var result
var move
var cor
var config


const chess = new Chess()
cor = get
//chess.load('5r2/1p4n1/p3n3/2kp1pp1/8/P2B2P1/1P1N1PP1/2R2K2 b - - 1 30')
if (cor[0] != chess.turn()) {
    makeRandomMove(null, chess)
}

if (cor[0] =='w'){ 
    config = {
    responsive: true,
    position: chess.fen(),
    sprite: {url: "/cm-chessboard-master/assets/images/chessboard-sprite-staunty.svg"},
    style: {moveFromMarker: undefined, moveToMarker: undefined}, // disable standard markers
    orientation: COLOR.white
    }
}

else{ 
    cor = 'black'
    config = {
    responsive: true,
    position: chess.fen(),
    sprite: {url: "/cm-chessboard-master/assets/images/chessboard-sprite-staunty.svg"},
    style: {moveFromMarker: undefined, moveToMarker: undefined}, // disable standard markers
    orientation: COLOR.black}
}

const board = new Chessboard(document.getElementById("board"), config)
board.enableMoveInput(inputHandler, COLOR.cor)

function inputHandler(event) {
    
    console.log("event", event)
    event.chessboard.removeMarkers(undefined, MARKER_TYPE.dot)
    event.chessboard.removeMarkers(undefined, MARKER_TYPE.square)

    if(chess.game_over()){

        console.log(chess.pgn())
        if(chess.in_check()){
            alert ('Xeque-mate!')
        }
        else{
            alert ('Empate!')
        }

    }


    if (event.type === INPUT_EVENT_TYPE.moveStart) {
        const moves = chess.moves({square: event.square, verbose: true});
        event.chessboard.addMarker(event.square, MARKER_TYPE.square)
        for (const move of moves) {
            event.chessboard.addMarker(move.to, MARKER_TYPE.dot)
        }
        return moves.length > 0
    }
    else if (event.type === INPUT_EVENT_TYPE.moveDone) {
        if(chess.get(event.squareFrom).type == 'p' && (event.squareTo[1] == 8 || event.squareTo[1] == 1)){
            promotion = prompt('promote to q, r, b or n?')
            move = {from: event.squareFrom, to: event.squareTo, promotion: promotion}
            var result = chess.move(move)
        }
        else{
        var move = {from: event.squareFrom, to: event.squareTo}
        var result = chess.move(move)
        }

        event.chessboard.setPosition(chess.fen())
        event.chessboard.disableMoveInput()
        if (!result) {
            console.warn("invalid move", move)
        }
        //return result
    }
    if (cor[0] != chess.turn()) {

        event.chessboard.removeMarkers(undefined, MARKER_TYPE.square)
        if (chess.moves()) {
            setTimeout(() => {
            makemove(event.chessboard, chess)
            console.log('eval: ' + Eval(cor[0], chess)/100)}, 50)
        }
    }
    if(chess.game_over()){
        console.log(chess.pgn())
        if(chess.in_check()){
            alert ('Xeque-mate!')
        }
        else{
            alert ('Empate!')
        }
    }
    event.chessboard.enableMoveInput(inputHandler, COLOR.cor)
}

function makeRandomMove (board, game) {
    var possibleMoves = game.moves()
  
    // exit if the game is over
    if (game.game_over() || game.moves().length===0) return
  
    var randomIdx = Math.floor(Math.random() * possibleMoves.length)
    game.move(possibleMoves[randomIdx])
    if (board){
        board.setPosition(game.fen())
    }
}