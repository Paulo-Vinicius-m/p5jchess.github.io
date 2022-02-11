
var tela = 0;
var som

function preload(){
  wking=loadImage('libraries/wking.png')
  bking=loadImage('libraries/bking.png')
  prof = loadImage('libraries/professor1.png')
  eu = loadImage('libraries/eu3.png')
  wpawn = loadImage('libraries/wpawn.png')
  bpawn = loadImage('libraries/bpawn.png')
  fonte = loadFont ('libraries/Serat.ttf')
  som = loadSound('libraries/soundefect.wav')
}

function setup() {
  createCanvas(1366, 661);
  textFont(fonte)
}

function draw() {
  clear();
  background(90, 90, 95)

  // Tela do menu
  if(tela == 0) {
    // Título do jogo (um bem ruim por sinal kkkk)
    textSize(47);
    textAlign(CENTER);
    text("P5.JChess", 683,120);

    // Botões para as outras telas
    textSize(29);
    rect(613, 240, 140, 45, 10);
    text("JOGAR", 683,273);

    // Botão tutorial
    textSize(19);
    rect(613, 315, 140, 45, 10);
    text("COMO JOGAR", 683, 346);

    // Botão créditos
    textSize(25);
    rect(613, 390, 140, 45, 10);
    text("CRÉDITOS", 683,422);

    // Função que faz os peões mudarem de cor
    mouse_on_button()
  }

  // Tela pré-jogo
  if(tela == 1) {
    // Indicação de em qual tela o usuário está
    textSize(33);
    textAlign(CENTER);
    text("JOGAR", 683,50);

    // A linha que separa o nome da tela do conteúdo dela
    line(0, 80, 1365, 80) 

    // Função que cria o botão de voltar para o menu
    voltar()

    // Botões que direcionam o usuário para o html do tabuleiro
    rect(603, 300, 70, 70, 10);
    image(wking, 608, 305, 60, 60);
    rect(693, 300, 70, 70, 10);
    image(bking, 698, 305, 60, 60);
  }

  // Tela do tutorial
  if (tela == 2) {
    // Botão de voltar
    voltar()

    // Indicação de em qual tela o usuário está
    textSize(33);
    textAlign(CENTER);
    text("Como Jogar", 683,50);

    // A linha que separa o nome da tela do conteúdo dela
    line(0, 80, 1365, 80)

    // Texto sobre o jogo 
    textSize(21)
    text('Esse é apenas um jogo de xadrez normal contra um adversário programado por mim. \nEscolha suas peças e parta para o xeque-mate! Caso você não saiba as regras do xadrez, \nvocê pode aprender a jogar por meio desse link:', 683, 250)
    rect(565, 370, 238, 45, 10);

    // Botão que direciona pro tutorial do lichess
    textSize(21)
    text ('Tutorial do lichess.org', 683, 400)

    // Botão que faz o peão mudar de cor
    mouse_on_button()
  }
 


  if (tela == 3){
    // Indicação de em qual tela o usuário está
    textSize(33);
    textAlign(CENTER);
    text("CRÉDITOS", 683, 50);

    // A linha que separa o nome da tela do conteúdo dela
    line(0, 80, 1365, 80)

    //botao voltar
    voltar()

    // Imagens
    image(prof, 150, 205, 144, 228)
    image(eu, 1070, 355, 149, 228)

    // Quem é quem
    textSize(27)
    text('Educador:', 375, 170)
    text('Aluno:', 1000, 320)

    // Breve introdução
    textSize(20)
    text('Orivaldo Santana, Professor de programação \nna Escola de Ciências & Tecnologia da UFRN.', 522, 303)
    text('Bacharelando de Ciências & Tecnologia na UFRN\n e enxadrista amador.', 822, 470)

  }
}

function mousePressed() {

  // Detecção de cliques no menu
  if(tela == 0) {
    // Hitbox do botão jogar
    if(mouseX>613 && mouseX<753 && mouseY>240 && mouseY<285) {
      som.play()
      tela=1;
    }

    // Hitbox do botão tutorial
    else {
      if(mouseX>613 && mouseX<753 && mouseY>315 && mouseY<360) {
        som.play()
        tela=2;
      }

      // Hitbox do botão créditos
      else {
        if(mouseX>613 && mouseX<753 && mouseY>390 && mouseY<435) {
        som.play()
        tela=3;

        }
      }
    }
  }

  // Detecção de cliques na tela pré-jogo
  if(tela == 1) {
    // Hitbox do botão voltar
     if(mouseX>1281 && mouseX<1345 && mouseY>26 && mouseY<50) {
       som.play()
        tela=0;
     }

     // Hitbox do botão jogar de brancas
     if(mouseX>603 && mouseX<673 && mouseY>300 && mouseY<370) {
       som.play()
       window.location.href = 'https://pv-lindo.github.io/p5jchess.github.io/jogo_main.html?cor=white'
     }

     // Hitbox do botão jogar de pretas
     if(mouseX>693 && mouseX<763 && mouseY>300 && mouseY<370) {
       som.play()
       window.location.href = 'https://pv-lindo.github.io/p5jchess.github.io/jogo_main.html?cor=black';
     }
  }

  // Detecção de cliques no tutorial
  if(tela == 2) {
    // Hitbox do botão voltar
    if(mouseX>1281 && mouseX<1345 && mouseY>26 && mouseY<50) {
      som.play()
      tela=0;
    }

    // Hitbox do botão de redirecionar pro tutorial
    if(mouseX>565 && mouseX<802 && mouseY>370 && mouseY<415){
      som.play()
      window.location.href = 'https://lichess.org/learn#/1'
    }
 }

 // Detecção de cliques nos créditos
  if(tela == 3) {
    // Hitzone do botão voltar
    if(mouseX>1281 && mouseX<1345 && mouseY>26 && mouseY<50) {
      som.play()
      tela=0;

    }
  }
}

function voltar () {
  //botao voltar
  textSize(20);
  rect(1284, 26, 64, 33, 10);
  text("Voltar", 1316, 50);
}

function mouse_on_button () {

  //função que desenha o peão preto ou branco de acordo com a posição do mouse
  if (tela===0){
    image (bpawn, 560, 238, 37, 47)
    image (bpawn, 560, 313, 37, 47)
    image (bpawn, 560, 388, 37, 47)

    if(mouseX>613 && mouseX<753 && mouseY>240 && mouseY<285) {
      image (wpawn, 560, 238, 37, 47)
    }
    else{
      if(mouseX>613 && mouseX<753 && mouseY>315 && mouseY<360) {
        image (wpawn, 560, 313, 37, 47)

      }
      else{
        if(mouseX>613 && mouseX<753 && mouseY>390 && mouseY<435) {
          image (wpawn, 560, 388, 37, 47)

        }
      }
    }
  }

  if (tela==2){

    image (bpawn, 512, 368, 37, 47)

    if(mouseX>565 && mouseX<802 && mouseY>370 && mouseY<415){
      image (wpawn, 512, 368, 37, 47)
    }
  }
}
