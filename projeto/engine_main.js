import Eval from "./evaluation_function.js"

export default function makemove (board, game){
    var possibleMoves = moveordering(game)
    var bestmove
    var alpha = -99999999
    var aval
    for(var j = 0; j < possibleMoves.length; j++){
        game.move(possibleMoves[j])
        aval = -search(game, 2, -9999999, -alpha)
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
    game.move(bestmove)
    if (board){
        board.setPosition(game.fen())
    }
    console.log('search: ' + alpha/100)
}

function search(game, depth, alpha, beta){


    if (depth ===0) {return dinamicEval(game, alpha, beta)}

    const movelist = moveordering(game)
    
    if (movelist.length === 0){
        if (game.in_check()) {
            return -9999999;
        }
        else {
                return 0;
            }
    }

    for (var i = 0; i < movelist.length; i++){
        game.move(movelist[i])
        var temp = -search (game, depth - 1, -beta, -alpha)
        game.undo()
        if (temp >= beta) {
            return beta
        }
        if (temp > alpha) {
            alpha = temp
        }
    }
    return alpha
}   

 function moveordering (game){
    var movelist = game.moves({verbose: true})
    var movesordered = []
    var chave
    for (var i = 0; i < movelist.length; i++){
        game.move(movelist[i])
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
        if (movelist[i] && movelist[i].flags.includes('k')){
            movesordered.push(movelist[i])
            movelist[i] = null
        }
    }
    for (var i = 0; i < movelist.length; i++){
        if (movelist[i] && movelist[i].flags.includes('q')){
            movesordered.push(movelist[i])
            movelist[i] = null
        }
    }
    for (var i = 0; i < movelist.length; i++){
        if (movelist[i] && movelist[i].flags.includes('e')){
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

function dinamicEval (game, alpha, beta){

    var temp
    temp = Eval(game.turn(), game)
    if (temp >= beta) {
        return beta
    }
    if (temp > alpha) {
        alpha = temp
    }
    const movelist = game.moves({verbose: true})

    for (var i = 0; i < movelist.length; i++){
        if (movelist[i].flags.includes('c')){
            game.move(movelist[i])
            temp = -dinamicEval(game, -beta, -alpha)
            game.undo()
            if (temp >= beta) {
                return beta
            }
            if (temp > alpha) {
				alpha = temp
			}
        }
    }
    return alpha
}
