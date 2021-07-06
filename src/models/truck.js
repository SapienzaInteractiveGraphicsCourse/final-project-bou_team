//import * as THREE from '../../node_modules/three/src/Three.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { colors, dimen } from '../utils/const.js';

const vehicleColors = [colors.green, colors.blue, colors.yellow, colors.red];

export function create(debug) {
    const truck = new THREE.Group();
    const color = RandomCol(vehicleColors);

    const backWheelR = Wheel();
    backWheelR.position.set(1.5, -1, 4.5);
    backWheelR.rotateY(Math.PI / 2);

    truck.add(backWheelR);

    const frontWheelR = Wheel();
    frontWheelR.position.set(1.5, -1, -5);
    frontWheelR.rotateY(Math.PI / 2);
    truck.add(frontWheelR);

    const centerWheelR = Wheel();
    centerWheelR.position.set(1.5, -1, -1);
    centerWheelR.rotateY(Math.PI / 2);
    truck.add(centerWheelR);

    const backWheelL = Wheel();
    backWheelL.position.set(-1.5, -1, 4.5);
    backWheelL.rotateY(Math.PI / 2);

    truck.add(backWheelL);

    const centerWheelL = Wheel();
    centerWheelL.position.set(-1.5, -1, -1);
    centerWheelL.rotateY(Math.PI / 2);

    truck.add(centerWheelL);

    const frontWheelL = Wheel();
    frontWheelL.position.set(-1.5, -1, -5);
    frontWheelL.rotateY(Math.PI / 2);
    truck.add(frontWheelL);

    const main =
        new THREE.Mesh(new THREE.BoxBufferGeometry(dimen.TRUCK.MAIN.width, dimen.TRUCK.MAIN.height, dimen.TRUCK.MAIN.depth),
        new THREE.MeshLambertMaterial({ color: color }));
        
    main.position.set(0, 1, 1.7);
    
    
    truck.add(main);

    const truckFrontTexture = getTruckFrontTexture();
    truckFrontTexture.center = new THREE.Vector2(0.4, 0.4);
    truckFrontTexture.rotation = Math.PI / 2;

    const truckBackTexture = getTruckFrontTexture();
    truckBackTexture.center = new THREE.Vector2(0.35, 0.35);
    truckBackTexture.rotation = Math.PI / 2;

    const truckRSideTexture = getTruckSideTexture();
    truckRSideTexture.center = new THREE.Vector2(0.5,0.5);
    truckRSideTexture.rotation = Math.PI / 2;

    const truckLSideTexture = getTruckSideLTexture();
    truckLSideTexture.center = new THREE.Vector2(0.5,0.5);
    truckLSideTexture.rotation = Math.PI / 2;


    const cabin = new THREE.Mesh(
        new THREE.BoxBufferGeometry(dimen.TRUCK.CABIN.width, dimen.TRUCK.CABIN.height, dimen.TRUCK.CABIN.depth), [
        new THREE.MeshLambertMaterial({ map: truckLSideTexture }),
        new THREE.MeshLambertMaterial({ map: truckRSideTexture }),
        new THREE.MeshLambertMaterial({ color: colors.white }),//top
        new THREE.MeshLambertMaterial({ color: colors.white }), //bottom
        new THREE.MeshLambertMaterial({ color: colors.white }),
        new THREE.MeshLambertMaterial({ map: truckFrontTexture })]);

    cabin.position.set(0, 0.5, -5);
    truck.add(cabin);
    createLight(cabin, -1);
    createLight(cabin, 1);

    function createLight(base, shift) {
        let bulb = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshBasicMaterial());
        bulb.scale.setScalar(0.3);
        bulb.position.set(shift, 0.125, 1);
        base.add(bulb);
        let light = new THREE.SpotLight(0xffffff, 5, 20, THREE.Math.degToRad(30), 1);
        light.position.set(shift, 0.125, 1);
        base.add(light);
        let lightTarget = new THREE.Object3D();
        lightTarget.position.set(shift, 0.08, -1 );
        base.add(lightTarget);
        light.target = lightTarget;
    }

    const collisionTruckGeometry = new THREE.BoxGeometry(3, 7, 13, 5, 5, 5);
    const wireMaterial = new THREE.MeshBasicMaterial({ color: color, wireframe: true});
    const collisionTruck = new THREE.Mesh(collisionTruckGeometry, wireMaterial);

    if(!debug) { 
        wireMaterial.transparent = true;
        wireMaterial.opacity = 0;
    }
    truck.castShadow = true;

    return {object: truck, collisionObject: collisionTruck};
}

function getTruckFrontTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;

    const context = canvas.getContext("2d");
    context.fillStyle = colors.white;
    context.fillRect(0, 0, 128, 32);

    context.fillStyle = colors.black;
    context.fillRect(58, 0, 40, 32);

    return new THREE.CanvasTexture(canvas);
}
function getTruckSideLTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;

    const context = canvas.getContext("2d");

    context.fillStyle = colors.white;
    context.fillRect(0, 0, 128, 32);

    context.fillStyle = colors.black;
    context.fillRect(58, 17, 40, 20);
    context.fillRect(38, 58, 60, 24);

    return new THREE.CanvasTexture(canvas);
}


function getTruckSideTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;

    const context = canvas.getContext("2d");

    context.fillStyle = colors.white;
    context.fillRect(0, 0, 128, 32);

    context.fillStyle = colors.black;
    context.fillRect(58, 0, 40, 20);
    context.fillRect(38, 58, 60, 24);

    return new THREE.CanvasTexture(canvas);
}


function RandomCol(array) {
    var random = Math.floor(Math.random() * (array.length))

    return array[random];
}

function Wheel() {
    return new THREE.Mesh(new THREE.BoxBufferGeometry(dimen.TRUCK.WHEEL.width, dimen.TRUCK.WHEEL.height, dimen.TRUCK.WHEEL.depth),
        new THREE.MeshLambertMaterial({ color: colors.black }));;
}