import Eval from "./evaluation_function.js"
import {moveordering2, ordercaptures} from "./moveordering2.js"

export default function makemove (board, game){
    var possibleMoves = moveordering2(game)
    var bestmove
    var alpha = -99999999
    var aval
    var t1 = new Date()

    // Calcula lance por lance usando alpha-beta pruning
    for (var j = 0; j < possibleMoves.length; j++){
        game.fast_move(possibleMoves[j])
        aval = -search(game, 1, -9999999, -alpha)
        game.undo()
        console.log('n: '+j+' > '+possibleMoves[j].from +' '+possibleMoves[j].to)
        if (aval > alpha){
            alpha = aval
            bestmove = possibleMoves[j]
        }
        if (possibleMoves[j].flags.includes('c')) {
            console.log(possibleMoves[j])
        }
    }

    // Faz o lance que ele avaliou como melhor e atualiza a ilustração do tabuleiro
    game.fast_move(bestmove)
    game.set_comment(alpha.toString())
    if (board){
        board.setPosition(game.fen())
    }

    // Avisa no console quanto tempo a engine demorou calculando e a avaliação dela sobre a posição
    var t2 = new Date() - t1
    console.log('search: ' + alpha/100 + '\ntime: ' + t2/1000)

    // Detecta se a partida acabou
    if (game.game_over()){
        if (game.in_checkmate()){alert('Xeque-mate!')}
        else {alert('Empate!')}
        return console.log(game.pgn())
    }
}

// Função que calcula usando alpha-beta pruning
function search(game, depth, alpha, beta){

    // Se chegou na profundidade de análise desejada, continuar calculando até chegar numa
    // posição "estática" e ai sim avaliar o lance
    if (depth ===0) {return dinamicEval(game, alpha, beta)}

    // Gerar a lista de lances possíveis na ordem dos lances provavelmente bons para
    // para os provavelmente ruins com o objetivo de aumentar a eficiência da busca
    const movelist = moveordering(game)
    
    // Verifica se a partida acabou
    if (game.game_over()){
        if (game.in_draw()) {
            return 0;
        }
        else {
                return -9999999;
            }
    }

    // Chama de novo a função de busca para avaliar quão bons são as respostas do adversário
    for (var i = 0; i < movelist.length; i++){
        game.fast_move(movelist[i])
        var temp = -search (game, depth - 1, -beta, -alpha)
        game.undo()
        if (temp >= beta) {
            return beta
        }
        if (temp > alpha) {
            alpha = temp
        }
    }
    // Retorna a avaliação da posição que ocorre após as jogadas mais precisas por
    // parte tanto da engine quanto do jogador
    return alpha
}   

// Gerar a lista de lances possíveis na ordem dos lances provavelmente bons para
// para os provavelmente ruins com o objetivo de aumentar a eficiência da busca
// pois caso um lance tenha um desenrolar ruim inevitável, ele não continuará sendo analisado
// na função makemove eu usei um subistuto melhor, embora as vezes mais lento, presente no arquivo "moveordering2.js"
 function moveordering (game){
    var movelist = game.moves({verbose: true})
    var movesordered = []

    for (var i = 0; i < movelist.length; i++){
        game.fast_move(movelist[i])
        if (game.in_check()){
            movesordered.push(movelist[i])
            movelist[i] = null
        }
        game.undo()
    }
    for (var i = 0; i < movelist.length; i++){
        if (movelist[i] && movelist[i].flags.includes('c')){
            movesordered.push(movelist[i])
            movelist[i] = null
        }
    }
    for (var i = 0; i < movelist.length; i++){
        if (movelist[i] && movelist[i].flags.includes('p')){
            movesordered.push(movelist[i])
            movelist[i] = null
        }
    }
    for (var i = 0; i < movelist.length; i++){
        if (movelist[i] && (movelist[i].flags.includes('k') || movelist[i].flags.includes('q') || movelist[i].flags.includes('e'))){
            movesordered.push(movelist[i])
            movelist[i] = null
        }
    }
   
    for (var i = 0; i < movelist.length; i++){
        if (movelist[i]){
            movesordered.push(movelist[i])
        }
    }
    return movesordered
}

// Função que continua calculando até chegar numa
// posição "estática" para poder atribuir uma nota pra posição
function dinamicEval (game, alpha, beta){

    // Coloca uma espectativa mínima para não perder muito tempo
    // analisando trocas ruins. (assume que não está em zugzwang)
    var aval = Eval(game.turn(), game)
    if (aval >= beta) {
        return beta
    }
    if (aval > alpha) {
        alpha = aval
    }
    const movelist = ordercaptures(game)
    
    for (var i = 0; i < movelist.length; i++){
        if (movelist[i].move.flags.includes('c')){
            game.fast_move(movelist[i].move)
            aval = -dinamicEval(game, -beta, -alpha)
            game.undo()
            if (aval >= beta) {
                return beta
            }
            if (aval > alpha) {
				alpha = aval
			}
        }
    }

    return alpha
}

// Ainda estou trabalhando nisso...
/*export default function iterativedeepening(board, game, depth){
    var possibleMoves = moveordering(game)
    var bestmove
    var bestmoveposition
    var t1 = new Date()

    for (var currentdepth = 0; currentdepth<depth; currentdepth++){
        if (bestmove){
            possibleMoves[bestmoveposition] = possibleMoves[0]
            possibleMoves[0] = bestmove
        }
        var alpha = -99999999
        var aval

        for (var j = 0; j < possibleMoves.length; j++){

            game.fast_move(possibleMoves[j])
            aval = -search(game, 1, -9999999, -alpha)
            game.undo()
            console.log('n: '+j+' > '+possibleMoves[j].from +' '+possibleMoves[j].to)
            if (aval > alpha){
                alpha = aval
                bestmove = possibleMoves[j]
                bestmoveposition = j
            }
            if (possibleMoves[j].flags.includes('c')) {
                console.log(possibleMoves[j])
            }
        }
    }
    game.fast_move(bestmove)
    if (board){
        board.setPosition(game.fen())
    }
    var t2 = new Date() - t1
    console.log('search: ' + alpha/100 + '\ntime: ' + t2/1000)
    if (game.game_over()){
        if (game.in_check()){ alert('Xeque-mate!')}
        else {alert('Empate!')}
        return console.log(game.pgn())
    }
}*/
