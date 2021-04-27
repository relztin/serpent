console.log('VERSION 1.2.4')
//contexte d'affichage
var canvas = document.getElementById('terrain');
var ctx = canvas.getContext('2d');

tailleCell = 20;
//donc largeur = 20cel * 20cel (car canvas de 400px)
// La taille en pixels du canvas est : canvas.width * canvas.height
// La taille en cellules de la grille du terrain est donnée par :
var largeur = canvas.width / tailleCell;
var hauteur = canvas.height / tailleCell;

//fonctions random
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max + 1));
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Fullscreen :
buttonFullscreen = document.getElementById('buttonFullscreen');
buttonFullscreen.addEventListener('click', function () {
    canvas.requestFullscreen();
})

// ============================================= CLASSE Terrain
class Terrain {
    constructor(l, h) {
        this.l = l; //largeur
        this.h = h; //hauteur
        this.sol = [];

        this.taille = this.l * this.h; //nombre total de cellule

        //Donne un contenu 0 (vide) à chaque cellule du terrain
        for (let x = 0; x < this.taille; x++) {
            this.sol.push(0);
        }

        //ajoute un nombre de rocher dans le terrain
        for (let i = 0; i < 100; i++) {
            // On tire au hasard un indice
            let indice_aléatoire = getRandomInt(this.l * this.h);
            // On écrit la valeur dans le tableau du sol
            this.sol[indice_aléatoire] = 1;
        }

        //ajoute des pommes
        for (let i = 0; i < 10; i++) {
            // On tire au hasard un indice
            let indice_aléatoire = getRandomInt(this.l * this.h);
            // On écrit la valeur dans le tableau du sol
            this.sol[indice_aléatoire] = 3;
        }

        //empèche la création de zones de + de 2 rocher autour de chaque case
        for (let x = 0; x < this.sol.length; x++) {

            let i = x % this.l;
            let j = Math.floor(x / this.l);
            //console.log(i);
            //console.log(j);

            let roche = 0;
            //console.log('verif de la case ' + x);

            if (i > 0 && j > 0) {
                if (this.lit(i + 1, j) === 1) { //case a droite
                    roche++;
                    //let droite = i + 1 + j * largeur;
                }
                if (this.lit(i, j + 1) === 1) { //case en bas
                    roche++;
                    //let bas = i + j + 1 * largeur;
                }
                if (this.lit(i - 1, j) === 1) { //case à gauche
                    roche++;
                    //let gauche = i - 1 + j * largeur;
                }
                if (this.lit(i, j - 1) === 1) { //case en haut
                    roche++;
                    //let haut = i + j - 1 * largeur;
                }

                if (roche >= 2) {
                    //console.log(roche);

                    let i = x % this.l;
                    let j = Math.floor(x / this.l);

                    this.ecrit(i + 1, j, 0);
                    this.ecrit(i, j + 1, 0);
                    this.ecrit(i - 1, j, 0);
                    this.ecrit(i, j - 1, 0);
                }
            }
            roche = 0;

            //crée des zones vides dans les 3 cases de chaque coin pour éviter les blocages
            if (x === 21 || x === 22 || x === 37 || x === 38 || x === 41 || x === 58 || x === 341 || x === 358 || x === 361 || x === 362 || x === 377 || x === 378) {
                this.ecrit(i, j, 0);
            }
        }
        //


        //affiche les bordures du terrain
        for (let x = 0; x < this.sol.length; x++) {

            var i = x % this.l;
            var j = Math.floor(x / this.l);

            //console.log(i);
            //console.log(j);
            //console.log(i + j * this.l);

            if (j === 0 || i === 0) {
                this.sol[x] = 2;
            }
            if (i <= this.l - 1 && j === this.h - 1) {
                this.sol[x] = 2;
            }
            if (i === this.l - 1 && j <= this.h - 1) {
                this.sol[x] = 2;
            }
        }
    }

    affiche() {
        for (var x = 0; x < this.sol.length; x++) {

            var i = x % this.l;
            var j = Math.floor(x / this.l);

            var ipix = i * tailleCell;
            var jpix = j * tailleCell;

            var color;
            if (this.sol[x] === 0) {
                color = 'white';
            } else if (this.sol[x] === 1) {
                color = 'grey';
            } else if (this.sol[x] === 2) {
                color = 'black';
            } else if (this.sol[x] === 3) {
                color = 'yellow';
            }

            ctx.fillStyle = color;
            ctx.fillRect(ipix, jpix, tailleCell, tailleCell);
        }
    }

    lit(i, j) {
        let k = i + j * this.l;
        //console.log('case lu : ' + k + ' | ' + 'code de la case lue : ' + this.sol[k])
        return this.sol[k]; //retourne le code de la case lue
    }

    ecrit(i, j, val) {
        let x = i + j * this.l; // selectionne case x selon ses cooredonnées
        this.sol[x] = val; //donne le code "val" à la case
    }

}

//creation et affichage du terrain
const terrain = new Terrain(20, 20);
console.log(terrain);
terrain.affiche();

// ============================================= CLASSE ANNEAU
class Anneau {

    constructor(i, j, color) {
        this.i = i; // lignes horizontale
        this.j = j; // lignes verticales
        this.color = color;
    }

    affiche() {
        // On dessine le rectangle :
        // Coordonnées du coin supérieur gauche en pixels
        var ipix = this.i * tailleCell
        var jpix = this.j * tailleCell
        // Dessin du rectangle
        ctx.fillStyle = this.color;
        ctx.fillRect(ipix, jpix, tailleCell, tailleCell);
    }

    move(n) {
        const dir = n;
        switch (dir) {
            case 1: // Haut
                this.j--;
                break
            case 2: // Droite
                this.i++;
                break
            case 3: // Bas
                this.j++;
                break
            case 4: // Gauche
                this.i--;
                break
        }

        if (this.i > 19) {
            this.i = 0
        }
        if (this.j > 19) {
            this.j = 0
        }

        if (this.i < 0) {
            this.i = 19
        }
        if (this.j < 0) {
            this.j = 19
        }
    }

    copier(a) {
        this.i = a.i;
        this.j = a.j;
    }

    lit(direction) {
        switch (direction) {
            case 1: // Haut
                var k = this.i + (this.j - 1) * largeur;
                var codeLu = terrain.lit(this.i, (this.j - 1));
                //console.log('Case lue : ' + k + ' | ' + 'code de la case : ' + codeLu);
                return codeLu;
            case 2: // Droite
                var k = (this.i + 1) + this.j * largeur;
                var codeLu = terrain.lit((this.i + 1), this.j);
                //console.log('Case lue : ' + k + ' | ' + 'code de la case : ' + codeLu);
                return codeLu;
            case 3: // Bas
                var k = this.i + (this.j + 1) * largeur;
                var codeLu = terrain.lit(this.i, (this.j + 1));
                //console.log('Case lue : ' + k + ' | ' + 'code de la case : ' + codeLu);
                return codeLu;
            case 4: // Gauche
                var k = (this.i - 1) + this.j * largeur;
                var codeLu = terrain.lit((this.i - 1), this.j);
                //console.log('Case lue : ' + k + ' | ' + 'code de la case : ' + codeLu);
                return codeLu;
        }
    }
}

// ============================================= CLASS SERPENT
class Serpent {
    constructor(lng, i, j) {
        this.lng = lng; //longueur du serpent
        this.i = i; //position initiale de la tête
        this.j = j;
        this.dir = []; //historique de direction de déplacement de la tête
        this.anneaux = []; // tableaux d'anneaux

        // Création de l'anneau de tête
        this.tete = new Anneau(i, j, '#CD5C5C');
        this.anneaux.push(this.tete);

        // Création des anneaux du reste du corps
        for (var l = 1; l < lng - 1; l++) {
            var anneau = new Anneau(i - l, j, '#F08080');
            this.anneaux.push(anneau);
        }

        //Couleur bleu pour la queue
        var queue = new Anneau(this.i - lng + 1, j, '#FFA07A');
        this.anneaux.push(queue);
    }

    affiche() {
        for (var x = 0; x < (this.anneaux).length; x++) {
            this.anneaux[x].affiche();
        }
    }

    move(dir) {

        var tirage = getRandomIntInclusive(0, 9);
        //console.log('tirage : ' + tirage);

        /*if (tirage < 3) { //déplacement aléatoire si tirage compris entre 0 et 3
            //console.log('déplacement aléatoire')
            dir = getRandomIntInclusive(1, 4);
        }*/

        var lecture = this.tete.lit(dir);
        if (lecture === 2) { //face à une bordure => déplacement aléatoire
            dir = getRandomIntInclusive(1, 4);
            this.move(dir);
            this.dir.push(dir);
        } else if (lecture === 1) { //face à un rocher
            //console.log('obstacle');
            var dir = dir + 1;
            if (dir > 4) {
                dir = 1;
            }
            this.move(dir);
            this.dir.push(dir);
        } else if (lecture === 0) { //face à du vide (mais impossible de revenir en arrière)
            if (this.dir[this.dir.length - 1] === 1 && dir === 3) {
                //console.log('déplacement impossible');
                terrain.ecrit(this.anneaux[0].i, this.anneaux[0].j, 1);
                if (terrain.lit(this.anneaux[this.lng - 1].i, this.anneaux[this.lng - 1].j) === 1) {
                    terrain.ecrit(this.anneaux[this.lng - 1].i, this.anneaux[this.lng - 1].j, 0);
                }
                return 0;
            } else if (this.dir[this.dir.length - 1] === 3 && dir === 1) {
                //console.log('déplacement impossible');
                terrain.ecrit(this.anneaux[0].i, this.anneaux[0].j, 1);
                if (terrain.lit(this.anneaux[this.lng - 1].i, this.anneaux[this.lng - 1].j) === 1) {
                    terrain.ecrit(this.anneaux[this.lng - 1].i, this.anneaux[this.lng - 1].j, 0);
                }
                return 0;
            } else if (this.dir[this.dir.length - 1] === 2 && dir === 4) {
                //console.log('déplacement impossible');
                terrain.ecrit(this.anneaux[0].i, this.anneaux[0].j, 1);
                if (terrain.lit(this.anneaux[this.lng - 1].i, this.anneaux[this.lng - 1].j) === 1) {
                    terrain.ecrit(this.anneaux[this.lng - 1].i, this.anneaux[this.lng - 1].j, 0);
                }
                return 0;
            } else if (this.dir[this.dir.length - 1] === 4 && dir === 2) {
                //console.log('déplacement impossible');
                terrain.ecrit(this.anneaux[0].i, this.anneaux[0].j, 1);
                if (terrain.lit(this.anneaux[this.lng - 1].i, this.anneaux[this.lng - 1].j) === 1) {
                    terrain.ecrit(this.anneaux[this.lng - 1].i, this.anneaux[this.lng - 1].j, 0);
                }
                return 0;
            } else {
                for (var i = this.lng - 1; i >= 1; i--) {
                    this.anneaux[i].copier(this.anneaux[i - 1])
                }
                this.anneaux[0].move(dir);
                this.dir.push(dir);

                terrain.ecrit(this.anneaux[0].i, this.anneaux[0].j, 1);
                if (terrain.lit(this.anneaux[this.lng - 1].i, this.anneaux[this.lng - 1].j) === 1) {
                    terrain.ecrit(this.anneaux[this.lng - 1].i, this.anneaux[this.lng - 1].j, 0);
                }
            }
        }
    }

    movePlayer(dir) { //gère les déplacement du joueur, dépose des bordures sous lui-même, pour éviter des bugs de collision

        var tirage = getRandomIntInclusive(0, 9);
        //console.log('tirage : ' + tirage);

        /*if (tirage < 3) { //déplacement aléatoire si tirage compris entre 0 et 3
            //console.log('déplacement aléatoire')
            dir = getRandomIntInclusive(1, 4);
        }*/

        var lecture = this.tete.lit(dir);

        if (lecture === 2) { //face à une bordure => déplacement aléatoire
            dir = getRandomIntInclusive(1, 4);
            this.movePlayer(dir);
            this.dir.push(dir);
        } else if (lecture === 1) { //face à un rocher
            //console.log('obstacle');

            //décommenter pour faire changer de direction lors de la colisiona avec un rocher
            /*var dir = dir + 1;
            if (dir > 4) {
                dir = 1;
            }
            this.move(dir);
            this.dir.push(dir);*/

            let divCanvas = document.getElementById('divCanvas');
            divCanvas.removeChild(canvas);
            document.getElementById('perdu').style.display = 'block';

        } else if (lecture === 0 || lecture === 3) { //face à du vide (mais impossible de revenir en arrière)

            //compte le score du serpent controlable
            //une case jaune = + un anneau
            if (lecture === 3) {
                score++
                affichageScore.innerHTML = score;
                this.allonger();
                console.log('score : ' + score);

                if (nombreDePomme === score) {


                    let divCanvas = document.getElementById('divCanvas');
                    divCanvas.removeChild(canvas);

                    document.getElementById('gagne').style.display = 'block';
                }
            }

            if (this.dir[this.dir.length - 1] === 1 && dir === 3) {
                //console.log('déplacement impossible');
                terrain.ecrit(this.anneaux[0].i, this.anneaux[0].j, 2);
                if (terrain.lit(this.anneaux[this.lng - 1].i, this.anneaux[this.lng - 1].j) === 2) {
                    terrain.ecrit(this.anneaux[this.lng - 1].i, this.anneaux[this.lng - 1].j, 0);
                }
                return 0;
            } else if (this.dir[this.dir.length - 1] === 3 && dir === 1) {
                //console.log('déplacement impossible');
                terrain.ecrit(this.anneaux[0].i, this.anneaux[0].j, 2);
                if (terrain.lit(this.anneaux[this.lng - 1].i, this.anneaux[this.lng - 1].j) === 2) {
                    terrain.ecrit(this.anneaux[this.lng - 1].i, this.anneaux[this.lng - 1].j, 0);
                }
                return 0;
            } else if (this.dir[this.dir.length - 1] === 2 && dir === 4) {
                //console.log('déplacement impossible');
                terrain.ecrit(this.anneaux[0].i, this.anneaux[0].j, 2);
                if (terrain.lit(this.anneaux[this.lng - 1].i, this.anneaux[this.lng - 1].j) === 2) {
                    terrain.ecrit(this.anneaux[this.lng - 1].i, this.anneaux[this.lng - 1].j, 0);
                }
                return 0;
            } else if (this.dir[this.dir.length - 1] === 4 && dir === 2) {
                //console.log('déplacement impossible');
                terrain.ecrit(this.anneaux[0].i, this.anneaux[0].j, 2);
                if (terrain.lit(this.anneaux[this.lng - 1].i, this.anneaux[this.lng - 1].j) === 2) {
                    terrain.ecrit(this.anneaux[this.lng - 1].i, this.anneaux[this.lng - 1].j, 0);
                }
                return 0;
            } else {
                for (var i = this.lng - 1; i >= 1; i--) {
                    this.anneaux[i].copier(this.anneaux[i - 1])
                }
                this.anneaux[0].move(dir);
                this.dir.push(dir);

                terrain.ecrit(this.anneaux[0].i, this.anneaux[0].j, 2);
                if (terrain.lit(this.anneaux[this.lng - 1].i, this.anneaux[this.lng - 1].j) === 2) {
                    terrain.ecrit(this.anneaux[this.lng - 1].i, this.anneaux[this.lng - 1].j, 0);
                }
            }
        }
    }

    allonger() {
        let queue = this.anneaux[this.lng - 1];
        let newQueue = new Anneau(queue.i - 1, queue.j, '#FFA07A');
        this.anneaux.push(newQueue);
        this.lng += 1;

        this.anneaux[this.lng - 2].color = '#F08080';

        console.log(this.anneaux);
    }

    anim() {
        this.move(getRandomIntInclusive(1, 4));
    }

}


//déplacement avec les touches du clavier
window.onkeydown = function (e) {
    var key = e.keyCode || e.which;
    switch (key) {
        case 37: //gauche
            serpent1.movePlayer(4);
            break;
        case 39: //droite
            serpent1.movePlayer(2);
            break;
        case 38: //haut
            serpent1.movePlayer(1);
            break;
        case 40: //bas
            serpent1.movePlayer(3);
            break;
        default:
            break;
    }
};

/*
//Bouton allonger
var allonger = document.getElementById('allonger');
allonger.addEventListener('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    serpent1.allonger();
    terrain.affiche();
    serpent1.affiche();
})
//

//Bouton anim SetInterval
var buttonSetInterval = document.getElementById('buttonSetInterval');

buttonSetInterval.addEventListener('click', function () {
    if (buttonSetInterval.value === 'Animation setInrterval') {
        serpent1.startAnim();
        buttonSetInterval.value = 'Stop Animation setInrterval';
    } else {
        serpent1.stopAnim();
        buttonSetInterval.value = 'Animation setInrterval';
    }
})


//RAF
// Fonction de déclenchement de l'animation
function startRAF() {
    // Appel à requestAnimationFrame pour déclencher la
    // boucle d'animation
    serpent1.animationTimer = requestAnimationFrame(startRAF);
    // Appel de la fonction d'animation de la scène
    serpent1.anim();
}

// Fonction d'arrêt de l'animation
function stopRAF() {
    cancelAnimationFrame(serpent1.animationTimer);
    serpent1.animationTimer = 0;
}

//bouton pour RAF
var buttonRAF = document.getElementById('buttonRAF');

buttonRAF.addEventListener('click', function () {
    if (buttonRAF.value === 'Animation RAF') {
        startRAF();
        buttonRAF.value = 'Stop RAF';
    } else {
        stopRAF();
        buttonRAF.value = 'Animation RAF';
    }
})*/




//création des instances de la classe serpent
//serpent controlable
const serpent1 = new Serpent(4, 13, 13);
serpent1.affiche();

//serpent autonomne
const serpentSolo = new Serpent(4, 6, 4);

//fonction d'annimation serpent autonomne
function anim() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    terrain.affiche();
    serpentSolo.anim();
    serpentSolo.affiche();
    serpent1.affiche();
}

function stopAnim() {

}

var animationTimer = 0;

function startAnim() {
    if (animationTimer == 0) {
        animationTimer = setInterval(anim.bind(), 200);
    }
}

startAnim();



//Score
let divScore = document.getElementById('divScore');
let affichageScore = document.createElement('h1');
let score = 0;

affichageScore.innerHTML = score;
divScore.appendChild(affichageScore);

//Pommes en jeu
let nombreDePomme = 0;
for (let x = 0; x <= terrain.sol.length; x++) {
    let i = x % terrain.l;
    let j = Math.floor(x / terrain.l);

    test = terrain.lit(i, j);
    if (test === 3) {
        nombreDePomme++
    }
}
console.log('Nombre de pommes à récolter = ' + nombreDePomme);