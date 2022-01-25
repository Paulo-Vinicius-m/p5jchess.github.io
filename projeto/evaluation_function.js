// Pieces values
const bish = 315
const knight = 300
const queen = 900
const rook = 500
const pawn = 100


export default function Eval (color, game) {

    var evaluation = 0
    var side
    if (color[0] == 'w') {
        side = 1
    }
    else{
        side = -1
    }

    if (game.moves().length ===0){
        if (game.in_check()) {
            return (side*9999999);
        }
        else {
            if (game.in_draw() || game.in_stalemate() || game.in_threefold_repetition()) {
                return 0;
            }
        }
    }
    else {
        for (let i = 0; i < 8; i=i+1) {
            for (let j = 0; j < 8; j=j+1) {
                if (game.board()[i][j] == null) { }
                else {
                    if (game.board()[i][j].color == color) {
                        if (game.board()[i][j].type == 'q') { evaluation = evaluation + queen; }
                        if (game.board()[i][j].type == 'n') { evaluation = evaluation + knight; }
                        if (game.board()[i][j].type == 'b') { evaluation = evaluation + bish; }
                        if (game.board()[i][j].type == 'r') { evaluation = evaluation + rook; }
                        if (game.board()[i][j].type == 'p') { evaluation = evaluation + pawn; }
                    }
                    if (game.board()[i][j].color != color) {
                        if (game.board()[i][j].type == 'q') { evaluation = evaluation - queen; }
                        if (game.board()[i][j].type == 'n') { evaluation = evaluation - knight; }
                        if (game.board()[i][j].type == 'b') { evaluation = evaluation - bish; }
                        if (game.board()[i][j].type == 'r') { evaluation = evaluation - rook; }
                        if (game.board()[i][j].type == 'p') { evaluation = evaluation - pawn; }
                    }
                }
            }
        }
        
        return (side*evaluation)
    } 
}
