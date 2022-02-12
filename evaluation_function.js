const bish = 315
const knight = 300
const queen = 900
const rook = 500
const pawn = 100
var meupar = 0
var paroponente = 0
var casadobispo
var casadopeao = []
var casadopeaoadversario = []
var cor

// Função para avaliar funções "estáticas"
export default function Eval (color, game) {

    var evaluation = 0

    // Verifica se o jogo acabou e retorna a avaliação da posição
    if (game.moves().length ===0){
        if (game.in_checkmate()) {
            return (-9999999);
        }
        else {
                return 0;
        }
    }
    // Conta as peças da engine e do jogador pra ver quem tem mais meterial
    else {
        for (let i = 0; i < 8; i=i+1) {
            for (let j = 0; j < 8; j=j+1) {
                if (game.board()[i][j] == null) { }
                else {
                    if (game.board()[i][j].color == color) {
                        if (game.board()[i][j].type == 'q') { evaluation = evaluation + queen; }
                        if (game.board()[i][j].type == 'n') { evaluation = evaluation + knight; }
                        if (game.board()[i][j].type == 'b') { evaluation = evaluation + bish; meupar++; casadobispo = ((i+j)%2)===0}
                        if (game.board()[i][j].type == 'r') { evaluation = evaluation + rook; }
                        if (game.board()[i][j].type == 'p') { evaluation = evaluation + pawn; cor = ((i+j)%2)===0; casadopeao.push(cor)}
                    }
                    if (game.board()[i][j].color != color) {
                        if (game.board()[i][j].type == 'q') { evaluation = evaluation - queen; }
                        if (game.board()[i][j].type == 'n') { evaluation = evaluation - knight; }
                        if (game.board()[i][j].type == 'b') { evaluation = evaluation - bish; paroponente++}
                        if (game.board()[i][j].type == 'r') { evaluation = evaluation - rook; }
                        if (game.board()[i][j].type == 'p') { evaluation = evaluation - pawn; cor = ((i+j)%2)===0; casadopeaoadversario.push(cor)}
                    }
                }
            }
        }
        
        // Dá uma valorizada no par de bispos ;) e vê se tem bispos ruins ou bons
        if (meupar == 2){
            evaluation = evaluation + 100 - casadopeao.length
        }
        else {
            if (meupar == 1){
                for (var k=0; k<casadopeao.length; k++){
                    if (casadopeao[k] == casadobispo){
                        evaluation--
                        k = 8
                    }
                }
            }
        }
        if (paroponente == 2){
            evaluation = evaluation - 100 + casadopeaoadversario.length
        }
        else {
            if (paroponente == 1){
                for (var k=0; k<casadopeao.length; k++){
                    if (casadopeaoadversario[k] == casadobispo){
                        evaluation++
                        k = 8
                    }
                }
            }
        }

        // Valoriza a mobilidade das peças
        evaluation = evaluation + game.moves().length
        
        return evaluation
    } 
}
