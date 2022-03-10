function moveordering2 (game){

    // a intenção aqui é ordenar as capturas das provavelmente melhores para as provavelmente piores

    var movelist = game.moves({verbose: true})
    var movesordered = []
    var scores = []

    for (var i = 0; i < movelist.length; i++){

        game.fast_move(movelist[i])
        if (game.in_check()){
            movesordered.push(movelist[i])
            movelist[i] = null
            game.undo()
        }
        
        else if (movelist[i].flags.includes('c')) {
            game.undo()
            scores.push({move: movelist[i], score: (piecevalue(game, movelist[i].to) - piecevalue(game, movelist[i].from))})
            movelist[i] = null
        }
        
        else if (movelist[i].flags.includes('e')){
            game.undo()
            scores.push({move: movelist[i], score: 100})
            movelist[i] = null
        }

        else if (movelist[i].flags.includes('p')){
            game.undo()
            scores.push({move: movelist[i], score: 800})
            movelist[i] = null
        }

        else{
            game.undo()
        }
    }

    if (scores.length > 0){

    scores.sort(function(a,b){return b.score - a.score})

    for (var i = 0; i < scores.length; i++){
        movelist.push(scores[i].move)
    }
    }

    for (var i = 0; i < movelist.length; i++){
        if (movelist[i] && (movelist[i].flags.includes('k') || movelist[i].flags.includes('q'))){
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

function ordercaptures(game){

    var moves = game.moves({verbose: true})
    var scores = []

    // a intenção aqui é ordenar as capturas das provavelmente melhores para as provavelmente piores

    for (var i = 0; i < moves.length; i++){
        
        if (moves[i].flags.includes('c')) {
            scores.push({move: moves[i], score: (piecevalue(game, moves[i].to) - piecevalue(game, moves[i].from))})
        }
        
        else if (moves[i].flags.includes('e')){
            scores.push({move: moves[i], score: 100})
        }
    }

    scores.sort(function(a,b){return b.score - a.score})

    return scores
}

function piecevalue (game, square){

    var type = game.get(square).type

    if (type.includes('p')) {return 100}
    else if (type.includes('r')) {return 500}
    else if (type.includes('b') || type.includes('n')) {return 300}
    else if (type.includes('k')) {return 0}
    else if (type.includes('q')) {return 900}
    else return 0
}

export {moveordering2, ordercaptures}