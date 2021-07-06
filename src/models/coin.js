//import * as THREE from '../../node_modules/three/src/Three.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { degreesToRadians } from '../utils/utilities.js'
import { colors, dimen } from '../utils/const.js';

const materialGold = new THREE.MeshLambertMaterial({
    color: colors.gold,
    roughness: 0.5,
    metalness: 1.0,
});

const coinThickness = 0.18 * dimen.COIN.radius;
const textScale = 0.16 * dimen.COIN.radius;
const extrudeThickness = coinThickness / 4;
const bevelThickness = 0.25;
const textThickness = extrudeThickness + bevelThickness;
const extrudeOptions = {
    depth: extrudeThickness,
    steps: 1,
    curveSegments: 24,
    bevelEnabled: true,
    bevelSize: bevelThickness,
    bevelThickness: bevelThickness,
    bevelSegments: 2,
};

export function create(debug) {
    // create the base coin geometry
    let ringGeometry = new THREE.TorusGeometry(
        dimen.COIN.radius, (0.1 * dimen.COIN.radius), 8, 64
    );
    let cylGeometry = new THREE.CylinderGeometry(
        dimen.COIN.radius, dimen.COIN.radius, coinThickness, 16
    );
    cylGeometry.rotateX(Math.PI / 2);

    let cyl = new THREE.Mesh(cylGeometry, materialGold)
    let ring = new THREE.Mesh(ringGeometry, materialGold)

    let oneShape = new THREE.Shape();
    oneShape.moveTo(-3, 1);
    oneShape.lineTo(-3, 2);
    oneShape.bezierCurveTo(-2.75, 1.75, -0.75, 3.5, -1, 4);
    oneShape.lineTo(1, 4);
    oneShape.lineTo(1, -3);
    oneShape.lineTo(3, -3);
    oneShape.lineTo(3, -4);
    oneShape.lineTo(-3, -4);
    oneShape.lineTo(-3, -3);
    oneShape.lineTo(-1, -3);
    oneShape.lineTo(-1, 2);
    oneShape.bezierCurveTo(-0.8, 1.8, -2.8, 0.8, -3, 1);
    let oneGeometry = new THREE.ExtrudeGeometry(oneShape, extrudeOptions);
    let oneMesh = new THREE.Mesh(oneGeometry, materialGold);

    oneMesh.position.z -= (extrudeThickness / 2) * textScale; // center
    oneMesh.position.z += (coinThickness) / 2; // offset to edge
    oneMesh.position.z -= (textThickness / 2) * textScale; // adjust
    oneMesh.scale.set(textScale, textScale, textScale);

    let coinGeometry = new THREE.Group();

    coinGeometry.add(cyl);
    coinGeometry.add(ring);
    coinGeometry.add(oneMesh);


    let cubeGeometry = new THREE.BoxGeometry(dimen.COIN.radius * 2, dimen.COIN.radius * 2, dimen.COIN.radius * 2, 6, 6, 6);
    let wireMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
 
    if(!debug) { 
        wireMaterial.transparent = true;
        wireMaterial.opacity = 0;
    }
    let collisionCoin = new THREE.Mesh(cubeGeometry, wireMaterial);

    coinGeometry.castShadow = true;
    coinGeometry.receiveShadow = false;

    return {coin: coinGeometry, collisionCoin: collisionCoin};



}