// Função para avaliar funções "estáticas"
export default function Eval (color, game) {

    var meupar = 0
    var paroponente = 0
    var casadobispo
    var casadobispoadversario
    var peao = []
    var peaoadversario = []
    var pieces = 0
    var evaluation = 0

    // Verifica se o jogo acabou e retorna a avaliação da posição
    if (game.moves().length === 0){
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
                        if (game.board()[i][j].type == 'q') { evaluation = evaluation + 900; pieces++}
                        if (game.board()[i][j].type == 'n') { evaluation = evaluation + 300; pieces++}
                        if (game.board()[i][j].type == 'b') { evaluation = evaluation + 315; meupar++; casadobispo = ((i+j)%2); pieces++}
                        if (game.board()[i][j].type == 'r') { evaluation = evaluation + 500; pieces++}
                        if (game.board()[i][j].type == 'p') { evaluation = evaluation + 100; peao.push(((i+j)%2)); pieces++}
                    }
                    if (game.board()[i][j].color != color) {
                        if (game.board()[i][j].type == 'q') { evaluation = evaluation - 900; pieces++}
                        if (game.board()[i][j].type == 'n') { evaluation = evaluation - 300; pieces++}
                        if (game.board()[i][j].type == 'b') { evaluation = evaluation - 315; paroponente++; casadobispoadversario = ((i+j)%2); pieces++}
                        if (game.board()[i][j].type == 'r') { evaluation = evaluation - 500; pieces++}
                        if (game.board()[i][j].type == 'p') { evaluation = evaluation - 100; peaoadversario.push(((i+j)%2)); pieces++}
                    }
                }
            }
        }
        
        // Dá uma valorizada no par de bispos ;) e vê se tem bispos bons ou maus
        if (meupar == 2){
            evaluation = evaluation + 100 - peao.length
        }
        else {
            if (meupar == 1){
                for (var k=0; k<peao.length; k++){
                    if (peao[k] == casadobispo){
                        evaluation--
                    }
                }
            }
        }
        if (paroponente == 2){
            evaluation = evaluation - 100 + peaoadversario.length
        }
        else {
            if (paroponente == 1){
                for (var k=0; k<peao.length; k++){
                    if (peaoadversario[k] == casadobispoadversario){
                        evaluation++
                    }
                }
            }
        }
        // Valoriza a mobilidade das peças mas incentiva as trocas pra evitar posições muito complexas
        evaluation = (evaluation + game.moves().length) - pieces
        
        return evaluation
    } 
}
