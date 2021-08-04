const navePrincipal = document.querySelector('.player-shooter');
const areaJogavel = document.querySelector('#main-play-area');
const aliensImg = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png', 'img/monster-4.png', 'img/monster-5.png']; // Inimigos;
const instructionsText = document.querySelector('.game-instructions');
const startButtom = document.querySelector('.start-buttom');
const titulo = document.querySelector('.titulo');
let alienInterval;
let pontos = 0;

function voar() { // Função que faz a nave ir para cima ou para baixo;
    if(event.key === 'ArrowUp') { // para cima;
        event.preventDefault();
        subir();
    } else if(event.key === 'ArrowDown') { // para baixo;
        event.preventDefault();
        descer();
    } else if(event.key === " ") { // Função de atirar; 
        event.preventDefault();
        atirar();
    }
};

function subir() { // Move a nave para cima;
    let topPosition = getComputedStyle(navePrincipal).getPropertyValue('top'); // Pega as características css de onde está a nave;
    if(topPosition === "0px") {
        return;
    } else {
        let position = parseInt(topPosition); // Transforma a string em int;
        position -= 50;
        navePrincipal.style.top = `${position}px`; // Vai adicionar o novo valor da posição;
    }
};

function descer() { // Move a nave para baixo;
    let topPosition = getComputedStyle(navePrincipal).getPropertyValue('top');
    if(topPosition === "500px") {
        return;
    } else {
        let position = parseInt(topPosition);
        position += 50;
        navePrincipal.style.top = `${position}px`;
    }
};

// Funções para criação e execução do tiro;

function atirar() {
    let laser = createLaserElement(); // Cria o Laser;
    areaJogavel.appendChild(laser); // Pega a Imagem;
    moveLaser(laser); // Movimenta o tiro;
};

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(navePrincipal).getPropertyValue('left')); // Pega posição x;
    let yPosition = parseInt(window.getComputedStyle(navePrincipal).getPropertyValue('top')); // Pega posição y;
    let nLaser = document.createElement('img'); // Cria um elemento;
    nLaser.src = 'img/shoot.png'; // Adiciona uma imagem a esse elemento;
    nLaser.classList.add('laser'); // Adiciona uma classe para css desse elemento;
    nLaser.style.left = `${xPosition}px`; // Atribui a possição da nave;
    nLaser.style.top = `${yPosition - 10}px`; // Ajusta a posição para o tiro sair do meio da nave;
    return nLaser;
};

function moveLaser(laser) { // Caso o alien seja atingido, trocará o src da img;
    let tempoLaser = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => {
            if(verificaLaserColission(laser, alien)) {
                alien.src = 'img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
                console.log(pontos);
                pontos += 10; // Contabiliza os pontos;
            }
        });

        if(xPosition === 340) {
            laser.remove(); // Se for maior doque a tela ele é removido da tela;
        } else {
            laser.style.left = `${xPosition + 8}px` // Se não, ele se movimenta 8 pixels para frente;
        }
    }, 10); // Tempo entre um tiro e outro;
};

function criarAliens() { // Função para criação de aliens aleatórios;
    let nAlien = document.createElement('img'); // Cria o elemento;
    let aliensRandom = aliensImg[Math.floor(Math.random() * aliensImg.length)]; // Sorteia o Alien q irá aparecer;
    nAlien.src = aliensRandom; // Atribui o sorteio ao elemento;
    nAlien.classList.add('alien'); // Cria a classe;
    nAlien.classList.add('alien-transition'); // Classe para quando ele é atingido;
    nAlien.style.left = '370px'; // Posição de onde ele surge;
    nAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`; // Altura de onde ele surge;
    areaJogavel.appendChild(nAlien); // Adiciona ele a área jogavél;
    moveAlien(nAlien); // Função que faz ele se movimentar;
};

function moveAlien(alien) { // Função que movimenta os inimigos;
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if(xPosition <= 50) { // GAME-OVER;
            if(Array.from(alien.classList).includes('dead-alien')) {
                alien.remove();
            } else {
                gameOver();
            } 
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 30);
};

function verificaLaserColission(laser, alien) { // Função da colissão;
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;

    let AlienTop = parseInt(alien.style.top);
    let AlienLeft = parseInt(alien.style.left);
    let AlienBottom = laserTop - 30;
    
    if(laserLeft != 340 && laserLeft + 40 >= AlienLeft) { // Compara a posição do laser com o alien para verificar se houve colissão;
        if(laserTop <= AlienTop && laserTop >= AlienBottom) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

startButtom.addEventListener('click', (event) => { // Inicia o jogo ao clicar em start;
    start();
});

function start() { // Início do jogo;
    startButtom.style.display = 'none';
    instructionsText.style.display = 'none';
    titulo.style.display = 'none';
    window.addEventListener('keydown', voar);
    alienInterval = setInterval(() => {
        criarAliens();
    }, 2000);
};

function gameOver() { // Função que encerra o jogo;
    window.removeEventListener('keydown', voar);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => {
        alert(`Game Over!\nPontos: ${pontos}`);
        navePrincipal.style.top = "250px";
        startButtom.style.display = "block";
        instructionsText.style.display = "block";
        titulo.style.display = "block";
    });
}

