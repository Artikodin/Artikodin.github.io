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
        ],
        loadComplete
    );
    bufferLoader.load();
}

function loadComplete(bufferList) {
    console.log('load finish');
    let analyseur,
        arrayFreq,
        arrayDomaine,
        bufferSource,
        startedAt = 0,
        pausedAt = 0,
        playing;
    const play = () => {
        const offset = pausedAt;
        // On initialise le buffer
        bufferSource = context.createBufferSource();
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
        bufferSource.start(0, offset);

        // On initialise la taille du tableau
        arrayFreq = new Uint8Array(analyseur.fftSize);

        arrayDomaine = new Uint8Array(analyseur.fftSize);
        // On remplit le tableau avec les frequences du son

        startedAt = context.currentTime - offset;
        pausedAt = 0;
        playing = true;
    };

    const pause = () => {
        const elapsed = context.currentTime - startedAt;
        console.log(elapsed)
        stop();
        pausedAt = elapsed;
    };

    const stop = () => {
        if (bufferSource) {
            bufferSource.disconnect();
            bufferSource.stop(0);
            bufferSource = null;
        }
        pausedAt = 0;
        startedAt = 0;
        playing = false;
    };
    play();
    // On initialise le buffer
    // bufferSource = context.createBufferSource();
    // // On selectionne la musique à joué en fonction de celle presente dans la liste
    // let i = 0;
    // bufferSource.buffer = bufferList[i];

    // // On initialise l'analyser
    // analyseur = context.createAnalyser();

    // // On connect le buffer à l'analyser et l'analyser au context de destination(enceintes)
    // bufferSource.connect(analyseur);
    // analyseur.connect(context.destination);

    // // Boucle le son et le met en play
    // bufferSource.loop = true;
    // bufferSource.start();

    // // On initialise la taille du tableau
    // arrayFreq = new Uint8Array(analyseur.fftSize);

    // arrayDomaine = new Uint8Array(analyseur.fftSize);
    // // On remplit le tableau avec les frequences du son

    function getArrayFreq() {
        analyseur.getByteFrequencyData(arrayFreq);
        return arrayFreq;
    }
    function getArrayDomaine() {
        analyseur.getByteTimeDomainData(arrayDomaine);
        return arrayDomaine;
    };


    ////////////////////////////////////////////////////////////////////////////////////
    //                  index.js													  //
    ////////////////////////////////////////////////////////////////////////////////////

    const sceneEl = document.querySelector('#main-scene');

    let sphereArray = [];

    const addEntityToScene = (components) => {
        const element = document.createElement('a-entity')
        for (var key in components) {
            element.setAttribute(key, components[key]);
        }
        sceneEl.appendChild(element)
    }

    const addCustomTagToScene = (tag, components) => {
        const element = document.createElement(tag)
        for (var key in components) {
            element.setAttribute(key, components[key]);
        }
        sceneEl.appendChild(element)
    }



    // Fonction qui ajoute les composant goutte à la scène
    const makeItRain = (i) => {
        sphereArray.push(document.createElement('a-entity'));
        sphereArray[i].setAttribute('drop', '');
        sceneEl.appendChild(sphereArray[i]);
    }

    for (let i = 0; i < 0; i++) {
        makeItRain(i)
    }


    var el = document.querySelector('#nyan');


    const testEl = document.querySelector('#test');
    testEl.addEventListener('click', () => {
        // el.body.applyForce(
        //     /* impulse */        new CANNON.Vec3(0, 50, 0),
        //     /* world position */ new CANNON.Vec3(0, 1, -2)
        // );
        // el.body.velocity.set(0, 100, 0);
        // el.body.angularVelocity.set(0, 100, 0);
        // el.body.quaternion.set(0, 100, 0);
        // el.body.position.set(0, 100, 0);
        // el.object3D.position.set(0, 100, 0);
        // sceneEl.setAttribute('physics', 'gravity: 0.1');
        console.log(el.sceneEl.object3D.world)
        console.log(window.CANNON.World)
        // console.log(sceneEl.body)
        // console.log(sceneEl.world)
        // if (playing) {
        //     console.log('pause')
        //     pause();
        // } else {
        //     console.log('play')
        //     play();
        // }
    })

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

    const randomValueBetweenPosNeg = (i, j) => {
        let randomValue = Math.floor(Math.random() * j) + i;
        randomValue *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
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
            // console.log("1 : ",randomValueBetweenPosNeg(0, 15))
            // console.log("2 : ",randomValueBetweenPosNeg(0, 15))
            // Création de la forme de la goutte
            this.geometry = new THREE.BoxBufferGeometry(data.width, data.height, data.depth);
            // Ajout de la couleur à la goutte
            this.material = new THREE.MeshStandardMaterial({ color: data.color });
            // Création de la goutte avec la méthode Mesh
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            // Ajoute la goutte à l'entité
            el.setObject3D('mesh', this.mesh);
            // Positionne la goutte aléatoirement
            el.object3D.position.set(randomValueBetweenPosNeg(-15, 15), randomValueBetween(20, 30), randomValueBetweenPosNeg(-15, 15));
        },
        // Méthode executée plusieurs fois par seconde
        // Elle anime la goutte qui tombe du ciel
        tick: function () {
            const currentPosition = this.el.object3D.position;
            currentPosition.y -= randomValueBetween(.01, .5);
            if (currentPosition.y < -.5) {
                this.reset();
            }
            if (playing) {
                console.log(getArrayFreq());
            }
        },
        // Méthode qui repositionne la goutte aléatoirement dans le ciel
        reset: function () {
            this.el.object3D.position.y = randomValueBetween(20, 30);
        }
    });


    ////////////////////////////////////////////////////////////////////////////////////
    //                   square.js													  //
    ////////////////////////////////////////////////////////////////////////////////////

    let once = true;
    AFRAME.registerComponent('square', {
        schema: {
            width: { type: 'number', default: 1 },
            height: { type: 'number', default: 1 },
            depth: { type: 'number', default: 1 },
            color: { type: 'color', default: '#FF0000' },
            posX: { type: 'number', default: 0 },
            posY: { type: 'number', default: 3 },
            posZ: { type: 'number', default: -2 },
        },

        init: function () {
            var data = this.data;
            var el = this.el;
            this.geometry = new THREE.BoxBufferGeometry(data.width, data.height, data.height);
            this.material = new THREE.MeshStandardMaterial({ color: data.color });
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            el.setObject3D('mesh', this.mesh);
            el.object3D.position.set(data.posX, data.posY, data.posZ);
        },
        tick: function () {
            if (once) {
                console.log(this.el.body)
                this.el.body.velocity.y = 10;
                console.log(this.el.body)
                once = false;
            }
            // this.el.body.position.y += 10
        },
    });

    ////////////////////////////////////////////////////////////////////////////////////
    //                   triangle.js												  //
    ////////////////////////////////////////////////////////////////////////////////////

    AFRAME.registerComponent('triangle', {
        schema: {
            radius: { type: 'number', default: 1 },
            height: { type: 'number', default: 1 },
            radialSegments: { type: 'number', default: 3 },
            color: { type: 'color', default: '#FFE500' },
            posX: { type: 'number', default: 0 },
            posY: { type: 'number', default: 3 },
            posZ: { type: 'number', default: -2 },
        },

        init: function () {
            var data = this.data;
            var el = this.el;
            this.geometry = new THREE.ConeGeometry(data.radius, data.height, data.radialSegments);
            this.material = new THREE.MeshStandardMaterial({ color: data.color });
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            el.setObject3D('mesh', this.mesh);
            el.object3D.position.set(0, 3, -2);
            el.object3D.position.set(data.posX, data.posY, data.posZ);
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////
    //                   sphere.js													  //
    ////////////////////////////////////////////////////////////////////////////////////

    AFRAME.registerComponent('sphere', {
        schema: {
            radius: { type: 'number', default: 1 },
            widthSegments: { type: 'number', default: 32 },
            heightSegments: { type: 'number', default: 32 },
            color: { type: 'color', default: '#000080' },
            posX: { type: 'number', default: 0 },
            posY: { type: 'number', default: 3 },
            posZ: { type: 'number', default: -2 },
        },

        init: function () {
            var data = this.data;
            var el = this.el;
            this.geometry = new THREE.SphereGeometry(data.radius, data.widthSegments, data.heightSegments);
            this.material = new THREE.MeshStandardMaterial({ color: data.color });
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            el.setObject3D('mesh', this.mesh);
            el.object3D.position.set(data.posX, data.posY, data.posZ);
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////
    //                   cylinder.js												  //
    ////////////////////////////////////////////////////////////////////////////////////

    AFRAME.registerComponent('cylinder', {
        schema: {
            radiusTop: { type: 'number', default: .5 },
            radiusBottom: { type: 'number', default: .5 },
            height: { type: 'number', default: 1 },
            radialSegments: { type: 'number', default: 32 },
            color: { type: 'color', default: '#008000' },
            posX: { type: 'number', default: 0 },
            posY: { type: 'number', default: 3 },
            posZ: { type: 'number', default: -2 },
        },

        init: function () {
            var data = this.data;
            var el = this.el;
            this.geometry = new THREE.CylinderBufferGeometry(data.radiusTop, data.radiusBottom, data.height, data.radialSegments);
            this.material = new THREE.MeshStandardMaterial({ color: data.color });
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            el.setObject3D('mesh', this.mesh);
            el.object3D.position.set(data.posX, data.posY, data.posZ);
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////
    //                   smooth-appear.js											  //
    ////////////////////////////////////////////////////////////////////////////////////

    AFRAME.registerComponent('smooth-appear', {
        schema: {
            scale: { type: 'number', default: 0 }
        },

        init: function () {
            this.el.object3D.scale.set(this.data.scale, this.data.scale, this.data.scale)
        },
        tick: function () {
            if (this.el.object3D.scale.x < 1 || this.el.object3D.scale.y < 1 || this.el.object3D.scale.z < 1) {
                this.el.object3D.scale.x += .1
                this.el.object3D.scale.y += .1
                this.el.object3D.scale.z += .1
            }
        },
    });

    ////////////////////////////////////////////////////////////////////////////////////
    //                   levitate.js				     							  //
    ////////////////////////////////////////////////////////////////////////////////////

    AFRAME.registerComponent('levitate', {
        schema: {
            scale: { type: 'number', default: 0 }
        },

        init: function () {

        },
        tick: function () {
            this.el.object3D.position.y += 10
            if (playing) {
            }
        },
    });

    ////////////////////////////////////////////////////////////////////////////////////
    //                   events.js				     							  //
    ////////////////////////////////////////////////////////////////////////////////////

    AFRAME.registerComponent('fusing-event', {
        schema: {
            playEnabled: { type: 'color', default: 'green' },
            playDisabled: { type: 'color', default: '#073a00' },
            pauseEnabled: { type: 'color', default: 'red' },
            pauseDisabled: { type: 'color', default: '#4c0000' }
        },

        init: function () {
            var data = this.data;
            var el = this.el;

            el.addEventListener('fusing', function () {
                if (el.getAttribute('id') === 'play' && !playing) {
                    document.querySelector('#play').setAttribute('color', data.playEnabled);
                    document.querySelector('#pause').setAttribute('color', data.pauseDisabled);
                    play();
                } else {
                    document.querySelector('#pause').setAttribute('color', data.pauseEnabled);
                    document.querySelector('#play').setAttribute('color', data.playDisabled);
                    pause();
                }
            });

            el.addEventListener('click', function () {
                if (el.getAttribute('id') === 'play' && !playing) {
                    document.querySelector('#play').setAttribute('color', data.playEnabled);
                    document.querySelector('#pause').setAttribute('color', data.pauseDisabled);
                    play();
                } else {
                    document.querySelector('#pause').setAttribute('color', data.pauseEnabled);
                    document.querySelector('#play').setAttribute('color', data.playDisabled);
                    pause();
                }
            });
        }
    });

    addCustomTagToScene('a-cylinder', {
        "position": "-1, 0, -1",
        "color": "green",
        "segments-radial": "3",
        "scale": ".6 .8 .6",
        "rotation": "0 -30 0",
        "id": "play",
        "fusing-event": ""
    });

    addCustomTagToScene('a-box', {
        "position": "1, 0, -1",
        "color": "#4c0000",
        "scale": ".8 .8 .8",
        "id": "pause",
        "fusing-event": ""
    });


    // for (let i = 0; i < 5; i++) {
    //     addEntityToScene({
    //         'square': `posX: ${randomValueBetweenPosNeg(3, 15)}; posZ: ${randomValueBetweenPosNeg(3, 15)};`,
    //         'dynamic-body': 'shape: Box',
    //     });
    //     addEntityToScene({
    //         'sphere': `posX: ${randomValueBetweenPosNeg(3, 15)}; posZ: ${randomValueBetweenPosNeg(3, 15)};`,
    //         'dynamic-body': 'shape: sphere; sphereRadius: 1',
    //     });
    //     addEntityToScene({
    //         'triangle': `posX: ${randomValueBetweenPosNeg(3, 15)}; posZ: ${randomValueBetweenPosNeg(3, 15)};`,
    //         'dynamic-body': 'shape: box;',
    //     });
    //     addEntityToScene({
    //         'cylinder': `posX: ${randomValueBetweenPosNeg(3, 15)}; posZ: ${randomValueBetweenPosNeg(3, 15)};`,
    //         'dynamic-body': 'shape: Cylinder;',
    //     });
    // }

    // addEntityToScene({
    //     'square': ``,
    //     'dynamic-body': 'shape: Box',
    //     'levitate':''
    // });




}
