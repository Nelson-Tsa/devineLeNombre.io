let count = 0;
let gameStarted = false;

function Joueur1() {
    const bouton1 = document.getElementById("chiffreADeviner").value;
    const valeur = parseInt(bouton1);
    
    if (!bouton1) {
        alert("Veuillez entrer un nombre");
        return null;
    }
    
    if (isNaN(valeur) || valeur < 0 || valeur > 50) {
        alert("Veuillez entrer un nombre entre 0 et 50");
        document.getElementById("chiffreADeviner").value = "";
        return null;
    }
 
    console.log("Nombre donné par le joueur 1 :", valeur);
    return valeur;
}

function valeurInput(valeurJoueur1, valeurBouton) {
    let inputElement = document.getElementById("rangeDonner");
    let min = parseInt(inputElement.min);
    let max = parseInt(inputElement.max);

    if (valeurBouton < valeurJoueur1 && valeurBouton < max) {
        inputElement.min = valeurBouton;
        inputElement.value = valeurBouton;
    } else if (valeurBouton > valeurJoueur1 && valeurBouton > min) {
        inputElement.max = valeurBouton;
        inputElement.value = valeurBouton;
    }
    return inputElement;
}

function boutonValider() {
    const bouton = document.getElementById("rangeDonner").value;
    document.getElementById("resultat").innerHTML = "Vous avez donné " + bouton;
    console.log("Nombre donné par le joueur 2 :", bouton);
    count++;
    let essaiNombre = document.getElementById("nombreEssai");
    essaiNombre.innerText = "Nombre d'essai : " + count;
    return parseInt(bouton);
}

function recommencer() {
    const recommencerJeux = confirm("Voulez-vous recommencer le jeu ?");
    if (recommencerJeux) {
        document.getElementById("resultat").innerHTML = "Le jeu recommence";
        document.getElementById("essai").innerHTML = "";
        document.getElementById("nombreEssai").innerHTML = "Nombre d'essai : 0";
        document.getElementById("rangeDonner").value = "";
        document.getElementById("chiffreADeviner").value = "";
        document.getElementById("chiffreADeviner").min = "0";
        document.getElementById("chiffreADeviner").max = "50";
        document.getElementById("rangeDonner").min = "0";
        document.getElementById("rangeDonner").max = "50";
        document.getElementById("chiffreADeviner").disabled = false;
        document.getElementById("validerJoueur1").disabled = false;
        document.getElementById("valider").disabled = false;

        count = 0;
        gameStarted = false;
        Jeux();
    }
}

function compare(chiffreJoueur1, chiffreJoueur2) {
    if (chiffreJoueur1 === null) return false;
    
    if (chiffreJoueur2 < chiffreJoueur1) {
        document.getElementById("essai").innerHTML = "Le chiffre est plus grand";
        return false;
    } else if (chiffreJoueur2 > chiffreJoueur1) {
        document.getElementById("essai").innerHTML = "Le chiffre est plus petit";
        return false;
    } else {
        document.getElementById("essai").innerHTML = "Vous avez trouvé le chiffre";
        return true;
    }
}

function Jeux() {
    let chiffreJoueur1 = null;
    
    document.getElementById("validerJoueur1").onclick = function() {
        if (!gameStarted) {
            chiffreJoueur1 = Joueur1();
            
            if (chiffreJoueur1 !== null) {
                gameStarted = true;
                document.getElementById("chiffreADeviner").disabled = true;
                document.getElementById("validerJoueur1").disabled = true;
                
        
            }
        }
    };

    document.getElementById("valider").onclick = function() {
        if (!gameStarted) {
            alert("Le joueur 1 doit d'abord valider son nombre!");
            return;
        }
        const NombreDonner = boutonValider();
        const etatPartie = compare(chiffreJoueur1, NombreDonner);
        
        if (!etatPartie) {
            valeurInput(chiffreJoueur1, NombreDonner);
        } else {
            document.getElementById("valider").disabled = true;
        }
    };
}

// Initialisation du jeu
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("rangeDonner").value = "0";
    Jeux();
});

module.exports = {
    Joueur1,
    valeurInput,
    boutonValider,
    recommencer,
    compare,
    Jeux
};