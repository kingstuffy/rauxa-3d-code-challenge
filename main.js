function init() {
    var scene = new THREE.Scene();
    var gui = new dat.GUI();

    // initialize objects
    var lightLeft = getSpotLight(0.4, 'rgb(255, 220, 180)');
    var lightRight = getSpotLight(1.25, 'rgb(255, 220, 180)');

    lightLeft.position.x = 6;
    lightLeft.position.y = 8;
    lightLeft.position.z = 12;

    lightRight.position.x = 50;
    lightRight.position.y = 14;
    lightRight.position.z = -6;

    // dat.gui
    gui.add(lightLeft, 'intensity', 0, 10);
    gui.add(lightLeft.position, 'x', -50, 50);
    gui.add(lightLeft.position, 'y', -50, 50);
    gui.add(lightLeft.position, 'z', -50, 50);

    gui.add(lightRight, 'intensity', 0, 10);
    gui.add(lightRight.position, 'x', -50, 50);
    gui.add(lightRight.position, 'y', -50, 50);
    gui.add(lightRight.position, 'z', -50, 50);

    // load the environment map
    var path = 'assets/cubemap/';
    var format = '.jpg';
    var fileNames = ['bg', 'bg', 'bg', 'bg', 'bg', 'bg'];

    var reflectionCube = new THREE.CubeTextureLoader().load(fileNames.map(function (fileName) {
        return path + fileName + format;
    }));
    scene.background = reflectionCube;

    // add other objects to the scene
    scene.add(lightLeft);
    scene.add(lightRight);

    // camera
    var camera = new THREE.PerspectiveCamera(
        45, // field of view
        window.innerWidth / window.innerHeight, // aspect ratio
        1, // near clipping plane
        1000 // far clipping plane
    );
    camera.position.z = 20;
    camera.position.x = 0;
    camera.position.y = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // load external geometry
    var loader = new THREE.OBJLoader();
    var textureLoader = new THREE.TextureLoader();

    loader.load('assets/models/bat.obj', function (batObject) {
        var woodTexture = textureLoader.load('assets/models/wood-texture.jpg');
        var faceMaterial = getMaterial('rgb(255, 255, 255)');
        batObject.traverse(function (child) {
            if (child.name) {
                child.material = faceMaterial;
                faceMaterial.roughness = 0.875;
                faceMaterial.map = woodTexture;
                faceMaterial.metalness = 0;
                faceMaterial.bumpScale = 0.175;
            }
        });

        batObject.scale.x = 0.2;
        batObject.scale.y = 0.2;
        batObject.scale.z = 0.2;

        batObject.position.x = 0;
        batObject.position.y = 0;
        batObject.position.y = 0;
        batObject.name = 'bat-object';
        scene.add(batObject);

        gui.add(batObject.rotation, 'x', -Math.PI, Math.PI * 2);
        gui.add(batObject.rotation, 'y', -Math.PI, Math.PI * 2);
        gui.add(batObject.rotation, 'z', -Math.PI, Math.PI * 2);

        gui.add(batObject.position, 'x', 0, 20);
        gui.add(batObject.position, 'y', 0, 20);
        gui.add(batObject.position, 'z', 0, 20);

        var tween1 = new TWEEN.Tween({
            x: 0,
            y: 0,
            z: 0,
            rx: 0,
            ry: 0,
            rz: 0
        })
            .to({
                    x: -0.5,
                    y: -0.3,
                    z: 1,
                    rx: 0,
                    ry: Math.PI,
                    rz: -1
                }, 1000
            )
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
                batObject.position.x = this.x;
                batObject.position.y = this.y;
                batObject.position.z = this.z;

                batObject.rotation.x = this.rx;
                batObject.rotation.y = this.ry;
                batObject.rotation.z = this.rz;
            })
            .start();

        var tween2 = new TWEEN.Tween({
            x: 0,
            y: 0,
            z: 1,
            rx: 0,
            ry: Math.PI,
            rz: -1
        })
            .to({
                    x: -2.5,
                    y: -0.3,
                    z: 1,
                    rx: 1.6,
                    ry: Math.PI,
                    rz: -1
                }, 200
            )
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
                // batObject.position.x = this.x;
                // batObject.position.y = this.y;
                batObject.position.z = this.z;

                batObject.rotation.x = this.rx;
                batObject.rotation.y = this.ry;
                batObject.rotation.z = this.rz;
            });

        var tween3 = new TWEEN.Tween({
            x: -2.5,
            y: -0.3,
            z: 1,
            rx: 1.2,
            ry: Math.PI,
            rz: -1
        })
            .to({
                    x: -2.5,
                    y: -0.3,
                    z: 1,
                    rx: 1.8,
                    ry: Math.PI + 0.4,
                    rz: 1
                }, 200
            )
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
                // batObject.position.x = this.x;
                // batObject.position.y = this.y;
                batObject.position.z = this.z;

                batObject.rotation.x = this.rx;
                batObject.rotation.y = this.ry;
                batObject.rotation.z = this.rz;
            });


        tween2.chain(tween3);
        tween1.chain(tween2);
    });

    // renderer
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    document.getElementById('webgl').appendChild(renderer.domElement);

    update(renderer, scene, camera, controls);

    return scene;
}

function getMaterial(color) {
    var materialOptions = {
        color: color === undefined ? 'rgb(255, 255, 255)' : color,
    };
    return new THREE.MeshStandardMaterial(materialOptions);
}

function getSpotLight(intensity, color) {
    color = color === undefined ? 'rgb(255, 255, 255)' : color;
    var light = new THREE.SpotLight(color, intensity);
    light.castShadow = true;
    light.penumbra = 0.5;

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.bias = 0.001;

    return light;
}

function update(renderer, scene, camera, controls) {
    controls.update();
    TWEEN.update();
    renderer.render(scene, camera);
    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    });
}

var scene = init();
