////////////////////////////////////////////////////////////////////////////////////
//                  Partie Web Audio API										  //
////////////////////////////////////////////////////////////////////////////////////
window.addEventListener("load", init());
function init() {
    console.log('initialiser');
    context = new (window.AudioContext || window.webkitAudioContext)();

    bufferLoader = new BufferLoader(
        context,
        [
            'assets/ClemBeatz_Lucioles.mp3',
            // 'sound/migos.mp3',	
            // 'sound/starbound.mp3',	
            // 'sound/Vald - Ma meilleure amie.mp3',	
        ],
        loadComplete
    );
    bufferLoader.load();
}

function loadComplete(bufferList) {
    console.log('load finish');
    // On initialise le buffer
    const bufferSource = context.createBufferSource();
    // On selectionne la musique à joué en fonction de celle presente dans la liste
    let i = 0;
    bufferSource.buffer = bufferList[i];

    // On initialise l'analyser
    analyseur = context.createAnalyser();

    // On connect le buffer à l'analyser et l'analyser au context de destination(enceintes)
    bufferSource.connect(analyseur);
    analyseur.connect(context.destination);

    // Boucle le son et le met en play
    bufferSource.loop = true;
    bufferSource.start();

    // On initialise la taille du tableau
    arrayFreq = new Uint8Array(analyseur.fftSize);

    arrayDomaine = new Uint8Array(analyseur.fftSize);
    // On remplit le tableau avec les frequences du son

    
    analyseur.getByteFrequencyData(arrayFreq); 
    console.log(arrayFreq);
    analyseur.getByteTimeDomainData(arrayDomaine); 
    console.log(arrayDomaine);


    ////////////////////////////////////////////////////////////////////////////////////
    //                  index.js													  //
    ////////////////////////////////////////////////////////////////////////////////////

    const sceneEl = document.querySelector('#main-scene');

    let sphereArray = [];

    // Fonction qui ajoute les composant goutte à la scène
    const makeItRain = (i) => {
        sphereArray.push(document.createElement('a-entity'));
        sphereArray[i].setAttribute('drop', '');
        sceneEl.appendChild(sphereArray[i]);
    }

    for (let i = 0; i < 1; i++) {
        makeItRain(i)
    }


    ////////////////////////////////////////////////////////////////////////////////////
    //                  utils.js													  //
    ////////////////////////////////////////////////////////////////////////////////////

    // La fonction randomValueBetween retourne une valeur aléatoire comprise entre deux nombres.
    const randomValueBetween = (i, j) => {
        let randomValue = Math.random() * j + i;
        randomValue = randomValue.toFixed(2);
        randomValue = parseFloat(randomValue);
        return randomValue;
    }


    ////////////////////////////////////////////////////////////////////////////////////
    //                   drop.js													  //
    ////////////////////////////////////////////////////////////////////////////////////

    // Création du composant goutte
    AFRAME.registerComponent('drop', {
        // Initialisation des valeurs par default
        schema: {
            width: { type: 'number', default: .008 },
            height: { type: 'number', default: 1 },
            depth: { type: 'number', default: .008 },
            color: { type: 'color', default: '#000' }
        },

        init: function () {
            var data = this.data;
            var el = this.el;
            // Création de la forme de la goutte
            this.geometry = new THREE.BoxBufferGeometry(data.width, data.height, data.depth);
            // Ajout de la couleur à la goutte
            this.material = new THREE.MeshStandardMaterial({ color: data.color });
            // Création de la goutte avec la méthode Mesh
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            // Ajoute la goutte à l'entité
            el.setObject3D('mesh', this.mesh);
            // Positionne la goutte aléatoirement
            el.object3D.position.set(randomValueBetween(-15, 15), randomValueBetween(20, 30), randomValueBetween(-15, 15));
        },
        // Méthode executée plusieurs fois par seconde
        // Elle anime la goutte qui tombe du ciel
        tick: function () {
            const currentPosition = this.el.object3D.position;
            currentPosition.y -= randomValueBetween(.01, .5);
            if (currentPosition.y < -.5) {
                this.reset();
            }
            analyseur.getByteTimeDomainData(arrayDomaine)
            console.log(arrayDomaine);
        },
        // Méthode qui repositionne la goutte aléatoirement dans le ciel
        reset: function () {
            this.el.object3D.position.y = randomValueBetween(20, 30);
        }
    });
}
