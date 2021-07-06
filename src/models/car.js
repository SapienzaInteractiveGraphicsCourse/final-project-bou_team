import * as THREE from '../../node_modules/three/src/Three.js';
import { colors, dimen } from '../utils/const.js';

const vehicleColors = [colors.green, colors.blue, colors.yellow, colors.red];
var colorMain = RandomCol(vehicleColors);

export function Car(debug) {
    const car = new THREE.Group();
    const color = vehicleColors[Math.floor(Math.random() * (vehicleColors.length))];

    const backWheelR = Wheel();
    backWheelR.position.set(1.5, -0.9, -2);
    backWheelR.rotateY(Math.PI / 2);

    car.add(backWheelR);

    const frontWheelR = Wheel();
    frontWheelR.position.set(1.5, -0.9, 2);
    frontWheelR.rotateY(Math.PI / 2);
    car.add(frontWheelR);

    const backWheelL = Wheel();
    backWheelL.position.set(-1.5, -0.9, -2);
    backWheelL.rotateY(Math.PI / 2);

    car.add(backWheelL);

    const frontWheelL = Wheel();
    frontWheelL.position.set(-1.5, -0.9, 2);
    frontWheelL.rotateY(Math.PI / 2);
    car.add(frontWheelL);

    const main = new THREE.Mesh(new THREE.BoxBufferGeometry(dimen.CAR.MAIN.width, dimen.CAR.MAIN.height, dimen.CAR.MAIN.depth),[
        new THREE.MeshLambertMaterial({ color: colorMain }),
        new THREE.MeshLambertMaterial({ color: colorMain }),
        new THREE.MeshLambertMaterial({ color: colorMain }),//top
        new THREE.MeshLambertMaterial({ color: colorMain }), //bottom
        new THREE.MeshLambertMaterial({ color: colorMain }),
        new THREE.MeshLambertMaterial({ map: getCarFrontTextureLight() })]);

    main.position.set(0, -0.4, 0);

    car.add(main);

    const carFrontTexture = getCarFrontTexture();
    carFrontTexture.center = new THREE.Vector2(0.4, 0.4);
    carFrontTexture.rotation = Math.PI / 2;

    const carBackTexture = getCarFrontTexture();
    carBackTexture.center = new THREE.Vector2(0.35, 0.35);
    carBackTexture.rotation = Math.PI / 2;

    const carRSideTexture = getCarSideTexture();

    const carLSideTexture = getCarSideTexture();

    const cabin = new THREE.Mesh(
        new THREE.BoxBufferGeometry(dimen.CAR.CABIN.width, dimen.CAR.CABIN.height, dimen.CAR.CABIN.depth), [
        new THREE.MeshLambertMaterial({ map: carLSideTexture }),
        new THREE.MeshLambertMaterial({ map: carRSideTexture }),
        new THREE.MeshLambertMaterial({ color: colors.white }),//top
        new THREE.MeshLambertMaterial({ color: colors.white }), //bottom
        new THREE.MeshLambertMaterial({ map: carBackTexture }),
        new THREE.MeshLambertMaterial({ map: carFrontTexture })]);

    cabin.position.set(0, 0.8, 0);
    car.add(cabin);



    const collisionCarGeometry = new THREE.BoxGeometry(4, 4, 6, 3, 3, 3);
    const wireMaterial = new THREE.MeshBasicMaterial({ color: color, wireframe: true });
    const collisionCar = new THREE.Mesh(collisionCarGeometry, wireMaterial);

    // lights

    createLight(main, -1);
    createLight(main, 1);

    function createLight(base, shift) {
        let bulb = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshBasicMaterial());
        bulb.scale.setScalar(0.3);
        bulb.position.set(shift, 0.125, 1);
        base.add(bulb);
        let light = new THREE.SpotLight(0xffffff, 5, 20, THREE.Math.degToRad(30), 1);
        light.position.set(shift, 0.125, 1);
        base.add(light);
        let lightTarget = new THREE.Object3D();
        lightTarget.position.set(shift, 0.08, 1 + 0.5);
        base.add(lightTarget);
        light.target = lightTarget;
        light.castShadow = true;
    }

    if (!debug) {
        wireMaterial.transparent = true;
        wireMaterial.opacity = 0;
    }
    car.castShadow = true;
    return { object: car, collisionObject: collisionCar };

}

function getCarFrontTextureLight() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;

    const context = canvas.getContext("2d");
    context.fillStyle = colorMain;
    context.fillRect(0, 0, 64, 32);

    return new THREE.CanvasTexture(canvas);
}

function getCarFrontTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;

    const context = canvas.getContext("2d");
    context.fillStyle = colors.white;
    context.fillRect(0, 0, 64, 32);

    context.fillStyle = colors.lightBlue;
    context.fillRect(8, 8, 68, 36);

    return new THREE.CanvasTexture(canvas);
}

function getCarSideTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;

    const context = canvas.getContext("2d");

    context.fillStyle = colors.white;
    context.fillRect(0, 0, 128, 32);

    context.fillStyle = colors.lightBlue;
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);

    return new THREE.CanvasTexture(canvas);
}



function RandomCol(array) {
    var random = Math.floor(Math.random() * (array.length))

    return array[random];
}

function Wheel() {
    const Wheel = new THREE.Mesh(new THREE.BoxBufferGeometry(dimen.CAR.WHEEL.width, dimen.CAR.WHEEL.height, dimen.CAR.WHEEL.depth),
        new THREE.MeshLambertMaterial({ color: colors.black }));
    return Wheel;
}

