import {expect, test, describe, vi, beforeEach} from 'vitest';

// Créer un mock plus complet du DOM
const mockElements = {};

// Mock du document
global.document = {
  getElementById: vi.fn(id => {
    // Si l'élément n'existe pas encore, le créer
    if (!mockElements[id]) {
      mockElements[id] = {
        innerText: '',
        value: '',
        style: { display: 'none' },
        disabled: false,
        min: '0',
        max: '50',
        step: '1',
        addEventListener: vi.fn(),
        innerHTML: '',
        onclick: null
      };
    }
    return mockElements[id];
  }),
  addEventListener: vi.fn()
};

// Mock de alert et confirm
global.alert = vi.fn();
global.confirm = vi.fn().mockReturnValue(true);

// Mock de location.reload
global.location = {
  reload: vi.fn()
};

// Mock de console.log
global.console = {
  ...console,
  log: vi.fn()
};

// Importer les fonctions après avoir configuré les mocks
const { Joueur1, boutonValider, recommencer, compare, Jeux, valeurInput } = await import('./script.js');

  // Réinitialiser les mocks avant chaque test
  beforeEach(() => {
    // Vider les éléments mock
    Object.keys(mockElements).forEach(key => delete mockElements[key]);
    
    // Réinitialiser tous les mocks
    vi.clearAllMocks();
  });

  describe('Joueur1', () => {
    test('devrait retourner la valeur numérique quand l\'entrée est valide', () => {
      const inputElement = document.getElementById('chiffreADeviner');
      inputElement.value = "10";
      inputElement.min = "0";
      inputElement.max = "50";

      const result = Joueur1();
      expect(result).toBe(10);
    });

    test('devrait retourner null quand l\'entrée est invalide', () => {
      const inputElement = document.getElementById('chiffreADeviner');
      inputElement.value = "invalid";
      inputElement.min = "0";
      inputElement.max = "50";

      const result = Joueur1();
      expect(result).toBe(null);
      expect(alert).toHaveBeenCalled();
    });

    test('devrait retourner null quand l\'entrée est vide', () => {
      const inputElement = document.getElementById('chiffreADeviner');
      inputElement.value = "";

      const result = Joueur1();
      expect(result).toBe(null);
      expect(alert).toHaveBeenCalledWith("Veuillez entrer un nombre");
    });

    test('devrait retourner null quand le nombre est hors limites', () => {
      const inputElement = document.getElementById('chiffreADeviner');
      inputElement.value = "100";
      inputElement.min = "0";
      inputElement.max = "50";

      const result = Joueur1();
      expect(result).toBe(null);
      expect(alert).toHaveBeenCalledWith("Veuillez entrer un nombre entre 0 et 50");
    });
  });

  describe('boutonValider', () => {
    test('devrait mettre à jour le DOM et retourner la valeur numérique', () => {
      const inputElement = document.getElementById('rangeDonner');
      inputElement.value = "25";
      
      const resultatElement = document.getElementById('resultat');
      const essaiNombreElement = document.getElementById('nombreEssai');
      
      const result = boutonValider();
      
      expect(result).toBe(25);
      expect(resultatElement.innerHTML).toBe("Vous avez donné 25");
      expect(essaiNombreElement.innerText).toContain("Nombre d'essai : 1");
    });
  });

  describe('compare', () => {
    test('devrait retourner false quand le premier argument est null', () => {
      const result = compare(null, 10);
      expect(result).toBe(false);
    });

    test('devrait retourner false et mettre à jour le DOM quand le nombre est trop petit', () => {
      const essaiElement = document.getElementById('essai');
      
      const result = compare(20, 10);
      
      expect(result).toBe(false);
      expect(essaiElement.innerHTML).toBe("Le chiffre est plus grand");
    });

    test('devrait retourner false et mettre à jour le DOM quand le nombre est trop grand', () => {
      const essaiElement = document.getElementById('essai');
      
      const result = compare(10, 20);
      
      expect(result).toBe(false);
      expect(essaiElement.innerHTML).toBe("Le chiffre est plus petit");
    });

    test('devrait retourner true et mettre à jour le DOM quand le nombre est correct', () => {
      const essaiElement = document.getElementById('essai');
      
      const result = compare(10, 10);
      
      expect(result).toBe(true);
      expect(essaiElement.innerHTML).toBe("Vous avez trouvé le chiffre");
    });
  });

  describe('valeurInput', () => {
    test('devrait mettre à jour min quand la valeur est plus petite que le nombre à deviner', () => {
      const inputElement = document.getElementById('rangeDonner');
      inputElement.min = "0";
      inputElement.max = "50";
      
      const result = valeurInput(30, 20);
      
      expect(result.min).toBe(20);
      expect(result.value).toBe(20);
    });

    test('devrait mettre à jour max quand la valeur est plus grande que le nombre à deviner', () => {
      const inputElement = document.getElementById('rangeDonner');
      inputElement.min = "0";
      inputElement.max = "50";
      
      const result = valeurInput(30, 40);
      
      expect(result.max).toBe(40);
      expect(result.value).toBe(40);
    });
  });

  describe('recommencer', () => {
    test('devrait réinitialiser le jeu quand confirm retourne true', () => {
      // Configurer les éléments du DOM avant le test
      const resultatElement = document.getElementById('resultat');
      const essaiElement = document.getElementById('essai');
      const nombreEssaiElement = document.getElementById('nombreEssai');
      const rangeDonnerElement = document.getElementById('rangeDonner');
      const chiffreADevinerElement = document.getElementById('chiffreADeviner');
      const validerJoueur1Element = document.getElementById('validerJoueur1');
      const validerElement = document.getElementById('valider');
      
      // Définir des valeurs initiales
      resultatElement.innerHTML = "Ancien résultat";
      essaiElement.innerHTML = "Ancien essai";
      nombreEssaiElement.innerHTML = "Nombre d'essai : 5";
      rangeDonnerElement.value = "25";
      chiffreADevinerElement.value = "30";
      chiffreADevinerElement.disabled = true;
      validerJoueur1Element.disabled = true;
      validerElement.disabled = true;
      
      // Exécuter la fonction à tester
      recommencer();
      
      // Vérifier que tout a été réinitialisé
      expect(resultatElement.innerHTML).toBe("Le jeu recommence");
      expect(essaiElement.innerHTML).toBe("");
      expect(nombreEssaiElement.innerHTML).toBe("Nombre d'essai : 0");
      expect(rangeDonnerElement.value).toBe("");
      expect(chiffreADevinerElement.value).toBe("");
      expect(chiffreADevinerElement.min).toBe("0");
      expect(chiffreADevinerElement.max).toBe("50");
      expect(rangeDonnerElement.min).toBe("0");
      expect(rangeDonnerElement.max).toBe("50");
      expect(chiffreADevinerElement.disabled).toBe(false);
      expect(validerJoueur1Element.disabled).toBe(false);
      expect(validerElement.disabled).toBe(false);
    });
  });