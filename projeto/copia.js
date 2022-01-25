//<script src="cm-chessboard/chessboardState.js"></script>
//<script src="cm-chessboard/chessboardMoveInput.js"></script>
//<script type="module" src="./cm-chessboard/chessboardView.js"></script>
//<script src="cm-chessboard/chessboard.js"></script>
//<script src="js/chess.js">

import {INPUT_EVENT_TYPE, COLOR, Chessboard, MARKER_TYPE} from "../cm-chessboard-master/src/cm-chessboard/Chessboard.js"

const chess = new Chess()
var promotion
var result
var move
var ifpgn


function inputHandler(event) {

    
    console.log("event", event)
    event.chessboard.removeMarkers(undefined, MARKER_TYPE.dot)
    event.chessboard.removeMarkers(undefined, MARKER_TYPE.square)
    if (event.type === INPUT_EVENT_TYPE.moveStart) {
        const moves = chess.moves({square: event.square, verbose: true});
        event.chessboard.addMarker(event.square, MARKER_TYPE.square)
        for (const move of moves) {
            event.chessboard.addMarker(move.to, MARKER_TYPE.dot)
        }
        return moves.length > 0
    } else if (event.type === INPUT_EVENT_TYPE.moveDone) {
        if(chess.get(event.squareFrom).type == 'p' && event.squareTo[1] == 8){
            promotion = prompt('promote to q, r, b or n?')
            move = {from: event.squareFrom, to: event.squareTo, promotion: promotion}
            const result = chess.move(move)
        }
        else{
        const move = {from: event.squareFrom, to: event.squareTo}
        result = chess.move(move)}
        if (result) {
            event.chessboard.removeMarkers(undefined, MARKER_TYPE.square)
            event.chessboard.disableMoveInput()
            event.chessboard.setPosition(chess.fen())
            const possibleMoves = chess.moves({verbose: true})
            if (possibleMoves.length > 0) {
                const randomIndex = Math.floor(Math.random() * possibleMoves.length)
                const randomMove = possibleMoves[randomIndex]
                setTimeout(() => { // smoother with 500ms delay
                    chess.move({from: randomMove.from, to: randomMove.to})
                    event.chessboard.enableMoveInput(inputHandler, COLOR.white)
                    event.chessboard.setPosition(chess.fen())
                }, 500)
            }
        }
        else {
            console.warn("invalid move", move)
        }
        if(chess.game_over()){
            ifpgn = prompt('Acabou!\nQuer o PGN da partida?')
            if(ifpgn){
                console.log(chess.pgn())
            }
        }
        return result
    }
    
}


const board = new Chessboard(document.getElementById("board"), {
    responsive: true,
    position: chess.fen(),
    sprite: {url: "/cm-chessboard-master/assets/images/chessboard-sprite-staunty.svg"},
    style: {moveFromMarker: undefined, moveToMarker: undefined}, // disable standard markers
    orientation: COLOR.white
})
board.enableMoveInput(inputHandler, COLOR.white)
