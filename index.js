import * as HUMAN from './src/models/human.js';
import * as CAR from "./src/models/car.js";
import * as TRUCK from "./src/models/truck.js";
import * as BOAR from "./src/models/boar.js";
import * as BIRD from "./src/models/bird.js";
import * as COIN from "./src/models/coin.js";
//import * as THREE from '../node_modules/three/src/Three.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import * as TREE from './src/models/tree.js';

import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { degreesToRadians, isNearTo } from './src/utils/utilities.js'
import { moveAnimal, moveObject, rotatingObject, stopObject } from './src/animations/moveHelper.js';
import { bell_sound, bird_sound, boar_sound, car_sound, coin_sound, colors, gasp_sound, kill_sound, losePage, objectsId, retryProgress, truck_sound, yeah_sound, treePositions } from './src/utils/const.js';

let ready = false

let camera, scene, renderer;
var human, collisionHuman;
var coin, collisionCoin;

var animal, collisionAnimal, animalTweens;
var object, collisionObject, objectTweens;

var cars = [];
var trucks = [];
var birds = [];
var boars = [];

var hitDetected = false;
var coinDetected = false;
var laneFlag = false;
var carsOrAnimals = false;
var isJumping = false;

var started = false;

var collidableMeshList = [];
var collidableCoinList = [];
var clock = new THREE.Clock();
var toggleRunWalk = true;
var speedWalk = 0.4;
var speedRun = 0.7;
var hit = 1;
var coins = 0;

var moving = false;
var debug = false;

var height, width;

var coinSpotlight, target;

var spawnPoint = -70;
var camDistance = 36;

var keypressed = {
    W: false, // W
    S: false, // S
    A: false, // A
    D: false, // D
}

var lightIntensity = 0.2;

function init() {
    // Init scene

    scene = new THREE.Scene();
    height = window.innerHeight;
    width = window.innerWidth;

    // Init camera (PerspectiveCamera) and lights
    camera = new THREE.OrthographicCamera(width / - camDistance, width / camDistance, height / camDistance, height / - camDistance, -50, 150);

    camera.position.set(0, 3, -10);

    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);

    const ambentLight = new THREE.AmbientLight("RGB(0,0,50)", lightIntensity);
    scene.add(ambentLight);

    const dirLight = new THREE.DirectionalLight("RGB(0,0,50)", lightIntensity);
    scene.add(dirLight);

    const spotLight0 = new THREE.SpotLight(0xffffff, lightIntensity);
    spotLight0.position.set(50, 20, 10);
    spotLight0.angle = Math.PI / 2;
    spotLight0.penumbra = 0.5;
    spotLight0.decay = 1;
    spotLight0.distance = 200;

    spotLight0.castShadow = true;
    spotLight0.shadow.mapSize.width = 512;
    spotLight0.shadow.mapSize.height = 512;
    spotLight0.shadow.camera.near = 10;
    spotLight0.shadow.camera.far = 200;
    spotLight0.shadow.focus = 1;
    /*var helper = new THREE.SpotLightHelper(spotLight0);
    scene.add(helper);
    const helper1 = new THREE.CameraHelper( spotLight0.shadow.camera );
    scene.add( helper1 );*/
    scene.add(spotLight0);

    const spotLight1 = new THREE.SpotLight(0xffffff, lightIntensity);
    spotLight1.position.set(-50, 20, 61);
    spotLight1.angle = Math.PI / 2;
    spotLight1.penumbra = 0.3;
    spotLight1.decay = 1;
    spotLight1.distance = 200;

    spotLight1.castShadow = true;
    spotLight1.shadow.mapSize.width = 512;
    spotLight1.shadow.mapSize.height = 512;
    spotLight1.shadow.camera.near = 10;
    spotLight1.shadow.camera.far = 200;
    spotLight1.shadow.focus = 1;
    /*var helper = new THREE.SpotLightHelper(spotLight1);
    scene.add(helper);
    const helper1 = new THREE.CameraHelper( spotLight1.shadow.camera );
    scene.add( helper1 );*/
    scene.add(spotLight1);

    coinSpotlight = new THREE.SpotLight(0xffffff, 0.9);
    coinSpotlight.position.set(20, 30, 10);

    coinSpotlight.angle = Math.PI / 50;
    coinSpotlight.decay = 2;
    coinSpotlight.distance = 300;
    coinSpotlight.penumbra = 0.5;

    coinSpotlight.castShadow = true;
    coinSpotlight.shadowMap = true;
    coinSpotlight.shadow.mapSize.width = 512;
    coinSpotlight.shadow.mapSize.height = 512;
    coinSpotlight.shadow.camera.near = 10;
    coinSpotlight.shadow.camera.far = 200;
    coinSpotlight.shadow.focus = 1;

    scene.add(coinSpotlight);


    // Init floor and scene


    var floorTexture = new THREE.TextureLoader().load("../assets/textures/street.png");
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);

    var floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture, side: THREE.DoubleSide });
    var floorGeometry = new THREE.PlaneGeometry(300, 300, 10, 10);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Init figure

    let humanBundle = HUMAN.create(debug);
    human = humanBundle.human;
    collisionHuman = humanBundle.collisionHuman;
    collidableMeshList.push(collisionHuman);

    scene.add(human);
    scene.add(collisionHuman);

    generateTrees();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    //renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Render to canvas element
    document.body.appendChild(renderer.domElement);

    translateCollidable(2.5, 2, 0)
    /* 
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.update(); */

    generateCars(5);

    if (document.getElementById("progress")) document.getElementById("progress").remove();
    if (document.getElementById("init")) document.getElementById("init").remove();
    document.getElementById("life").style.visibility = "visible";
    document.getElementById("coins").style.visibility = "visible";

    let coinBundle = COIN.create(debug);
    coin = coinBundle.coin;
    coin.position.set(20, 1, 10);
    collisionCoin = coinBundle.collisionCoin;
    collisionCoin.position.set(20, 1, 10);
    rotatingObject(coin, collisionCoin);
    scene.add(coin);
    scene.add(collisionCoin);
    target = coin;
    coinSpotlight.target = target;

    scene.add(coinSpotlight.target);
    collidableCoinList.push(collisionCoin);


    animate();

}

function clearScene() {
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    var element = document.getElementsByTagName("canvas"), index;

    for (index = element.length - 1; index >= 0; index--) {
        element[index].parentNode.removeChild(element[index]);
    }

    started = false
    cars = [];
    trucks = [];
    birds = [];
    boars = [];

    hitDetected = false;
    coinDetected = false;

    started = false;

    collidableMeshList = [];
    collidableCoinList = [];
    clock = new THREE.Clock();
    toggleRunWalk = true;
    hit = 1;
    document.getElementById('lifes').innerHTML = "&nbsp &nbsp " + hit;
    coins = 0;
    document.getElementById('points').innerHTML = "&nbsp &nbsp " + coins;

    moving = false;
    debug = false;
}

function generateAnimals(n) {

    for (let index = 0; index < n; index++) {
        let randomZ = Math.floor(Math.random() * 60) - 5;

        let spawnBird = Math.floor(Math.random() * 9) < 7 ? true : false;

        let objectBundle = spawnBird ? BIRD.create(debug) : BOAR.create(debug);

        object = objectBundle.object;
        collisionObject = objectBundle.collisionObject;

        object.receiveShadow = true;

        if (spawnBird) translateCarCollidable(spawnPoint, 3, randomZ, object, collisionObject);
        else translateCarCollidable(spawnPoint, 0.5, 15, object, collisionObject);

        scene.add(object);
        scene.add(collisionObject);

        objectTweens = spawnBird ? moveAnimal(object, collisionObject, true, index) : moveAnimal(object, collisionObject, false, index)
        spawnBird ? birds[index] = objectTweens : boars[index] = objectTweens;

    }

}

function incrementAnimalNumber() {
    let index;

    let randomZ = Math.floor(Math.random() * 60) - 5;

    let spawnBird = Math.floor(Math.random() * 9) > 7 ? true : false;

    let objectBundle = spawnBird ? BIRD.create(debug) : BOAR.create(debug);

    object = objectBundle.object;
    collisionObject = objectBundle.collisionObject;

    object.receiveShadow = true;

    if (spawnBird) {
        translateCarCollidable(spawnPoint, 3, randomZ, object, collisionObject);
        setTimeout(function () {
            generateSound("bird");
        }, 1000);
        index = birds.length;
    }
    else {
        translateCarCollidable(spawnPoint, 0.5, 15, object, collisionObject);
        setTimeout(function () {
            generateSound("boar");
        }, 1000);
        index = boars.length;

    }

    scene.add(object);
    scene.add(collisionObject);

    objectTweens = spawnBird ? moveAnimal(object, collisionObject, true, index) : moveAnimal(object, collisionObject, false, index)
    spawnBird ? birds[index] = objectTweens : boars[index] = objectTweens;


}

function generateCars(n) {

    for (let index = 0; index < n; index++) {
        let spawnCar = Math.floor(Math.random() * 9) < 5 ? true : false;

        let objectBundle = spawnCar ? CAR.Car(debug) : TRUCK.create(debug);

        object = objectBundle.object;
        collisionObject = objectBundle.collisionObject;

        object.receiveShadow = true;

        //collidableMeshList.push(collisionObject);
        if (spawnCar) {
            laneFlag ? translateCarCollidable(-spawnPoint, 1, 10, object, collisionObject) : translateCarCollidable(spawnPoint, 1, 40, object, collisionObject)
            laneFlag ? rotateCarCollidable(-90, object, collisionObject) : rotateCarCollidable(90, object, collisionObject);
        }
        else {
            laneFlag ? translateCarCollidable(-spawnPoint, 1, 20, object, collisionObject) : translateCarCollidable(spawnPoint, 1, 50, object, collisionObject)
            laneFlag ? rotateCarCollidable(90, object, collisionObject) : rotateCarCollidable(-90, object, collisionObject);
        }

        scene.add(object);
        scene.add(collisionObject);

        objectTweens = moveObject(object, collisionObject, index, laneFlag)
        spawnCar ? cars[index] = objectTweens : trucks[index] = objectTweens;

        laneFlag = !laneFlag;
    }
}

function incrementCarNumber() {
    let index;
    let spawnCar = Math.floor(Math.random() * 9) < 7 ? true : false;

    let objectBundle = spawnCar ? CAR.Car(debug) : TRUCK.create(debug);

    object = objectBundle.object;
    collisionObject = objectBundle.collisionObject;

    object.receiveShadow = true;

    //collidableMeshList.push(collisionObject);
    if (spawnCar) {
        index = cars.length;
        laneFlag ? translateCarCollidable(spawnPoint, 1, 10, object, collisionObject) : translateCarCollidable(spawnPoint, 1, 40, object, collisionObject)
        rotateCarCollidable(90, object, collisionObject);
    }
    else {
        index = trucks.length;
        laneFlag ? translateCarCollidable(spawnPoint, 1, 20, object, collisionObject) : translateCarCollidable(spawnPoint, 1, 50, object, collisionObject)
        rotateCarCollidable(-90, object, collisionObject);
    }

    scene.add(object);
    scene.add(collisionObject);

    objectTweens = moveObject(object, collisionObject, index)
    spawnCar ? cars[index] = objectTweens : trucks[index] = objectTweens;

    laneFlag = !laneFlag;
}

function generateTrees() {
    var tree;

    for (let i = 0; i < treePositions.length; i++) {
        tree = TREE.create(Math.floor(Math.random() * 9) < 5 ? true : false);

        tree.position.set(treePositions[i].x, treePositions[i].y, treePositions[i].z);
        scene.add(tree);
    }

}

function animate() {
    if (moving) {
        toggleRunWalk ? HUMAN.run(human) : HUMAN.walk(human);
    }
    else {
        if (!isJumping) HUMAN.restPose(human);
    }

    boars.map((item) => {
        BOAR.run(item.object, item.collisionObject)
        checkCollision(objectsId.BOAR_ID, item.collisionObject, collidableMeshList, false)
    })
    birds.map((item) => {
        BIRD.fly(item.object, item.collisionObject)
        checkCollision(objectsId.BIRD_ID, item.collisionObject, collidableMeshList, false)
    })

    cars.map((item) => { checkCollision(objectsId.CAR_ID, item.collisionObject, collidableMeshList, false) })
    trucks.map((item) => { checkCollision(objectsId.TRUCK_ID, item.collisionObject, collidableMeshList, false) })

    checkCollision(objectsId.HUMAN_ID, collisionHuman, collidableCoinList, true)

    renderer.render(scene, camera);

    requestAnimationFrame(animate);

}

function checkCollision(objectId, fromObj, collidableList, isCoin) {
    // collision detection:
    //   determines if any of the rays from the human's origin to each vertex
    //	 intersects any face of a mesh in the array of target meshes
    //   for increased collision accuracy, add more vertices to the cube;
    //	 for example, new THREE.CubeGeometry( 64, 64, 64, 8, 8, 8, wireMaterial )
    //   HOWEVER: when the origin of the ray is within the target mesh, collisions do not occur
    var originPoint = fromObj.position;

    const positionAttribute = fromObj.geometry.getAttribute('position');
    const vertex = new THREE.Vector3();

    for (let vertexIndex = 0; vertexIndex < positionAttribute.count; vertexIndex++) {

        vertex.fromBufferAttribute(positionAttribute, vertexIndex);

        var directionVector = vertex.applyMatrix4(fromObj.matrix).sub(fromObj.position);

        var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize(), 0, 10);
        var collisionResults = ray.intersectObjects(collidableList);

        if (collisionResults.length > 0 && collisionResults[0].distance <= directionVector.length()) {
            isCoin ? gotCoin() : detectedHit();
            break;
        }

        if (collisionResults.length > 0 && collisionResults[0].distance <= directionVector.length() * 3) {
            switch (objectId) {
                case objectsId.CAR_ID:
                    generateSound("car");
                    generateSound("gasp")
                    break;
                case objectsId.TRUCK_ID:
                    generateSound("truck");
                    generateSound("gasp")
                    break;
                case objectsId.BOAR_ID:
                    generateSound("gasp");
                    break;
                case objectsId.BIRD_ID:
                    generateSound("gasp");
                    break;
                default:
                    break;
            }
        }
    }

}

function onWindowResize() {
    // After making changes to aspect
    camera.updateProjectionMatrix();
    // Reset size
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function translateCollidable(x, y, z) {
    human.position.set(x, y, z);
    collisionHuman.position.set(x, y, z);
}

function incrementCollidable(x, y, z) {
    human.position.x += x;
    human.position.y += y;
    human.position.z += z;

    collisionHuman.position.x += x;
    collisionHuman.position.y += y;
    collisionHuman.position.z += z;
}

function translateCarCollidable(x, y, z, car, collisionObject, isCar) {

    car.position.set(x, y, z);
    collisionObject.position.set(x, y, z);
}

function rotateCarCollidable(theta, car, collisionObject) {
    collisionObject.rotation.y = degreesToRadians(theta)
    car.rotation.y = degreesToRadians(theta)
}

function detectedHit() {
    if (!hitDetected) {
        generateSound("kill");
        generateSound("bell");
        hit--;
        console.log("hit")
        stopObject(objectTweens)

        if (hit == 0) {
            updateScore(coins);
            loadLosePage();
            document.getElementById('score').innerHTML = coins;
            document.getElementById('best_score').innerHTML = localStorage.getItem('score');

            document.getElementById("retryButton").onclick = function () {
                document.getElementById("sound9").innerHTML = "";
                document.getElementById("lose").remove();
                document.getElementById("content").innerHTML = retryProgress;
                clearScene()
                setTimeout(function () {
                    init();
                }, 400);
            }
        }

        document.getElementById('lifes').innerHTML = "&nbsp &nbsp " + hit;
        hitDetected = true;
    }

}

function updateScore(score) {
    var currScore = localStorage.getItem('score');
    if (currScore != null && score > currScore)
        localStorage.setItem('score', score);
    else if (currScore == null)
        localStorage.setItem('score', score);
}

function gotCoin() {
    if (started) {
        console.log("got coin!")
        generateSound("coin");
        generateSound("yeah");
        coins++;

        let x = Math.floor(Math.random() * 50), y = Math.floor(Math.random() * 6) + 1, z = Math.floor(Math.random() * 50);

        for (let index = 0; index < treePositions.length; index++) {
            if (isNearTo([x, z], [treePositions[index].x, treePositions[index].z], 5)) {
                console.log("this point should be shifted")

                console.log([x, z], [treePositions[index].x, treePositions[index].z])
                x += 8;
                z += 8;
            }
        }

        coin.position.set(x, y, z);
        collisionCoin.position.set(x, y, z);
        coinSpotlight.position.set(x, y + 20, z);

        // carsOrAnimals? incrementCarNumber() : incrementAnimalNumber();
        // carsOrAnimals = !carsOrAnimals;
        incrementAnimalNumber();

        document.getElementById('points').innerHTML = "&nbsp &nbsp " + coins;
    }
}

function onDocumentKeyDown(event) {
    var keyCode = event.which;

    if (keyCode == 87) { // W

        moving = true;
        incrementCollidable(0, 0, !toggleRunWalk ? speedWalk : speedRun);
        human.rotation.y = degreesToRadians(0);
    } else if (keyCode == 83) { // S
        moving = true;
        incrementCollidable(0, 0, !toggleRunWalk ? -speedWalk : -speedRun);
        human.rotation.y = degreesToRadians(-180);
    } else if (keyCode == 65) {  // A
        moving = true;
        human.rotation.y = degreesToRadians(90);
        incrementCollidable(!toggleRunWalk ? speedWalk : speedRun, 0, 0);
    } else if (keyCode == 68) { // D
        moving = true;
        human.rotation.y = degreesToRadians(-90);
        incrementCollidable(!toggleRunWalk ? -speedWalk : -speedRun, 0, 0);
    }
    else if (keyCode == 16) { // SHIFT
        toggleRunWalk = !toggleRunWalk
    }

    if (started == false) started = true

    toggleKeyPressed(keyCode)
};

function handleJump(setter) {
    setter ? isJumping = false : isJumping = !isJumping;
}

function generateSound(object) {
    switch (object) {
        case "car":
            document.getElementById("sound1").innerHTML = car_sound;
            break;
        case "truck":
            document.getElementById("sound2").innerHTML = truck_sound;
            break;
        case "boar":
            document.getElementById("sound3").innerHTML = boar_sound;
            break;
        case "bird":
            document.getElementById("sound4").innerHTML = bird_sound;
            break;
        case "kill":
            document.getElementById("sound5").innerHTML = kill_sound;
            break;
        case "coin":
            document.getElementById("sound6").innerHTML = coin_sound;
            break;
        case "yeah":
            document.getElementById("sound7").innerHTML = yeah_sound;
            break;
        case "gasp":
            document.getElementById("sound8").innerHTML = gasp_sound;
            break;
        case "bell":
            document.getElementById("sound9").innerHTML = bell_sound;
            break;
        default:
            break;
    }
}

function toggleKeyPressed(keyCode) {
    switch (keyCode) {
        case 87:
            keypressed.W = !keypressed.W
            handleJump(true)
            break;
        case 83:
            keypressed.S = !keypressed.S
            handleJump(true)
            break;
        case 65:
            keypressed.A = !keypressed.A
            handleJump(true)
            break;
        case 68:
            keypressed.D = !keypressed.D
            handleJump(true)
            break;
        case 32:
            HUMAN.jump(human, collisionHuman, handleJump)
            break;
        default:
            break;
    }
}

function loadLosePage() {
    document.getElementById("content").innerHTML = losePage;
}

function onDocumentKeyRelease() { moving = false; };

window.addEventListener('resize', onWindowResize, false);
document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyRelease, false);

document.getElementById("playButton").onclick = function () {
    document.getElementById("play").remove();
    document.getElementById("progress").style.visibility = "visible";
    setTimeout(function () {
        init();
    }, 200);
};
