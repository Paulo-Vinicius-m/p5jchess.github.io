import {INPUT_EVENT_TYPE, COLOR, Chessboard, MARKER_TYPE} from "/p5jchess.github.io/libraries/cm-chessboard-master/cm-chessboard/Chessboard.js"
import makemove from "/p5jchess.github.io/engine.js"
import Eval from "/p5jchess.github.io/evaluation_function.js"
import {Chess} from '/p5jchess.github.io/libraries/chess/chess.js'

// Board => representação gráfica do tabuleiro e input handler
// chess => classe que armazena a posição, lida com as regras do jogo, gera os lances que são possíveis e etc.

// Declaração de variáveis
var promotion
var cor
var config

// Criação da representação do jogo
const chess = new Chess()

// Pega o valor da URL (ver o HTML) que diz com qual cor o usuário irá jogar
if (get){
    cor = get
}
else{
    cor = 'white'
}

// Posições de mate em 3 para teste
//chess.load('5r2/1p4n1/p3n3/2kp1pp1/8/P2B2P1/1P1N1PP1/2R2K2 b - - 1 30')
//chess.load('2r2k2/1p1n1pp1/p2b2p1/8/2KP1PP1/P3N3/1P4N1/5R2 w - - 0 1')

// Se a engine for jogar de brancas, fazer o lance antes de iniciar o tabuleiro
if (cor[0] != chess.turn()) {
    makemove(null, chess)
}

// Configurações da ilustração do tabuleiro: mudar o ponto de vista de acordo com as peças do jogador
if (cor[0] =='w'){ 
    chess.header('white', 'player', 'black', 'engine')
    config = {
    responsive: true,
    position: chess.fen(),
    sprite: {url: "/libraries/cm-chessboard-master/assets/images/chessboard-sprite-staunty.svg"},
    style: {moveFromMarker: undefined, moveToMarker: undefined},
    orientation: COLOR.white
    }
}

else{
    chess.header('white', 'engine', 'black', 'player')
    cor = 'black'
    config = {
    responsive: true,
    position: chess.fen(),
    sprite: {url: "/libraries/cm-chessboard-master/assets/images/chessboard-sprite-staunty.svg"},
    style: {moveFromMarker: undefined, moveToMarker: undefined},
    orientation: COLOR.black}
}

// Iniciar a ilustração do tabuleiro e permitir a interação com ele
const board = new Chessboard(document.getElementById("board"), config)
board.enableMoveInput(inputHandler, COLOR.cor)

function inputHandler(event) {
    
    // "limpa" o tabuleiro
    console.log("event", event)
    event.chessboard.removeMarkers(undefined, MARKER_TYPE.dot)
    event.chessboard.removeMarkers(undefined, MARKER_TYPE.square)

    // Verifica se o jogo ja encerrou. Caso tenha acabado, mostrar no console o histórico da partida
    if(chess.game_over()){

        if(chess.in_checkmate()){
            alert ('Xeque-mate!')
        }
        else{
            alert ('Empate!')
        }

        return console.log(chess.pgn())
    }

    // Detecta se a interação é o início de uma jogada
    if (event.type === INPUT_EVENT_TYPE.moveStart) {
        const moves = chess.moves({square: event.square, verbose: true});
        event.chessboard.addMarker(event.square, MARKER_TYPE.square)
        for (const move of moves) {
            event.chessboard.addMarker(move.to, MARKER_TYPE.dot)
        }
        return moves.length > 0
    }
    // Detecta se a interação é o final da jogada
    else if (event.type === INPUT_EVENT_TYPE.moveDone) {
        // Verifica se o lance é uma promoção e, caso seja, pergunta ao usuário pra qual peça ele vai promover
        if(chess.get(event.squareFrom).type == 'p' && (event.squareTo[1] == 8 || event.squareTo[1] == 1)){
            promotion = prompt('promote to q, r, b or n?')
            move = {from: event.squareFrom, to: event.squareTo, promotion: promotion}
            var result = chess.move(move)
        }
        else{
        var move = {from: event.squareFrom, to: event.squareTo}
        var result = chess.move(move)
        }

        // Atualiza a ilustração do tabuleiro
        event.chessboard.setPosition(chess.fen())
        event.chessboard.disableMoveInput()

        // Verifica se o lance foi ilegal
        if (!result) {
            console.warn("invalid move", move)
        }
    }

    // Verifica se o jogo acabou e, caso não, a engine faz seu lance
    if (cor[0] != chess.turn()) {

        event.chessboard.removeMarkers(undefined, MARKER_TYPE.square)
        if (!chess.game_over()) {
            setTimeout(() => {
            makemove(event.chessboard, chess), 50}
    }
    
    event.chessboard.enableMoveInput(inputHandler, COLOR.cor)
}
