//import * as THREE from '../../node_modules/three/src/Three.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { degreesToRadians } from '../utils/utilities.js'
import { colors, boar_dimen, partId, dimen } from '../utils/const.js';

const bmap = new THREE.TextureLoader().load("../src/assets/textures/boar_skin2.jpg");
const materialBody = new THREE.MeshPhongMaterial({
    color: colors.brown3,
    emissive   :  new THREE.Color("rgb(7,3,5)"),
    //specular   :  new THREE.Color("rgb(255,113,0)"),
    shininess  :  20,
    bumpMap    :  bmap,
    bumpScale  :  0.45,
  });
const materialFace = new THREE.MeshLambertMaterial({ color: colors.brown })
const materialFang = new THREE.MeshLambertMaterial({color: colors.white})

const material = new THREE.MeshPhongMaterial({
    color: colors.brown2,
    emissive   :  new THREE.Color("rgb(7,3,5)"),
    //specular   :  new THREE.Color("rgb(255,113,0)"),
    shininess  :  20,
    bumpMap    :  bmap,
    bumpScale  :  0.45,
  });

const maxRunTheta = 20;
var thetaRunIncrement = 1.3;
var currentRunTheta = 0;

const maxRunThetaLower = 20;
var thetaRunIncrementLower = 1.3;
var currentRunThetaLower = 0;

var boarTheta = [0, 0, 180, 0, 180, 0, 0, 0, 0, 0, 0]
var boarRunTheta = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

export function create(debug) {
    let boar = new THREE.Group();

    // Init Geometry

    //#region BODY
    let body = new THREE.Mesh(
        new THREE.CylinderGeometry(boar_dimen.BODY.radiusTop, boar_dimen.BODY.radiusBottom, boar_dimen.BODY.height * 2, 8, 1, false, 3),
        materialBody
    );

    body.rotateZ(-Math.PI * 0.5);

    body.position.set(0, 0, 0);
    body.name = "body"

    boar.add(body);

    //#endregion

    //#region HEAD
    let head = new THREE.Mesh(
        new THREE.CylinderGeometry(boar_dimen.HEAD.radiusTop, boar_dimen.HEAD.radiusBottom, boar_dimen.HEAD.height, 32, 1, false, 3),
        material
    );

    head.rotateZ(-Math.PI * 0.6);

    head.position.set(boar_dimen.BODY.width / 2, boar_dimen.BODY.height / 2 + boar_dimen.HEAD.height / 3, 0);
    head.name = "head"

    boar.add(head);
    //#endregion

    //#region EAR

    let leftEar = new THREE.Mesh(
        new THREE.BoxGeometry(boar_dimen.EAR.width, boar_dimen.EAR.height, boar_dimen.EAR.depth),
        materialFace
    );

    leftEar.position.set(boar_dimen.BODY.width / 2, boar_dimen.BODY.height/2 + boar_dimen.HEAD.height/1.3, boar_dimen.HEAD.depth/4);
    leftEar.name = "leftEar"

    boar.add(leftEar)

    let rightEar = new THREE.Mesh(
        new THREE.BoxGeometry(boar_dimen.EAR.width, boar_dimen.EAR.height, boar_dimen.EAR.depth),
        materialFace
    );

    rightEar.position.set(boar_dimen.BODY.width / 2, boar_dimen.BODY.height/2 + boar_dimen.HEAD.height/1.3, -boar_dimen.HEAD.depth/4);
    rightEar.name = "rightEar"

    boar.add(rightEar)
    //#endregion

    //#region NOSE

    let nose = new THREE.Mesh(
        new THREE.CylinderGeometry(boar_dimen.NOSE.radiusTop, boar_dimen.NOSE.radiusBottom, boar_dimen.NOSE.height),
        materialFace
    );

    nose.rotateZ(-Math.PI * 0.6);

    nose.position.set(boar_dimen.BODY.width / 2 + boar_dimen.HEAD.height/2, boar_dimen.BODY.height /3 + boar_dimen.HEAD.height/3, 0);
    nose.name = "nose"

    boar.add(nose)
    //#endregion

    //#region FANGS
    let leftFang = new THREE.Mesh(
        new THREE.CylinderGeometry(boar_dimen.FANG.radiusTop, boar_dimen.FANG.radiusBottom, boar_dimen.FANG.height),
        materialFang
    );

    leftFang.rotateZ(-Math.PI * 0.4);

    leftFang.position.set(boar_dimen.BODY.width/1.52, boar_dimen.BODY.height/1.8, boar_dimen.HEAD.depth/4.3);
    leftFang.name = "leftFang"

    boar.add(leftFang)

    let rightFang = new THREE.Mesh(
        new THREE.CylinderGeometry(boar_dimen.FANG.radiusTop, boar_dimen.FANG.radiusBottom, boar_dimen.FANG.height),
        materialFang
    );

    rightFang.rotateZ(-Math.PI * 0.4);

    rightFang.position.set(boar_dimen.BODY.width/1.52, boar_dimen.BODY.height/1.8, -boar_dimen.HEAD.depth/4.3);
    rightFang.name = "rightFang"

    boar.add(rightFang)
    //#endregion

    //#region TAIL
    let tail = new THREE.Mesh(
        new THREE.CylinderGeometry(boar_dimen.TAIL.radiusTop, boar_dimen.TAIL.radiusBottom, boar_dimen.TAIL.height),
        materialFace
    );

    tail.rotateZ(-Math.PI * 0.4);

    tail.position.set(-boar_dimen.BODY.width / 2, boar_dimen.BODY.height/4, 0);
    tail.name = "tail"

    boar.add(tail)
    //#endregion

    //#region LEGS
    let leftFrontLeg = assembleFrontLeg(true)
    boar.add(leftFrontLeg);

    let rightFrontLeg = assembleFrontLeg(false);
    boar.add(rightFrontLeg);

    let leftBackLeg = assembleBackLeg(true)
    boar.add(leftBackLeg);

    let rightBackLeg = assembleBackLeg(false);
    boar.add(rightBackLeg);
    //#endregion

    boar.translateY(boar_dimen.BODY.height/2);

    let cubeGeometry = new THREE.BoxGeometry(3.2, 3, 1.2, 6, 6, 6);
    let wireMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
 
    if(!debug) { 
        wireMaterial.transparent = true;
        wireMaterial.opacity = 0;
    }
    let collisionBoar = new THREE.Mesh(cubeGeometry, wireMaterial);

    return {object: boar, collisionObject: collisionBoar};
}

function assembleFrontLeg(isLeft) {

    let upperLeg = new THREE.Mesh(
        new THREE.BoxGeometry(boar_dimen.LEG.LOWER.width, boar_dimen.LEG.LOWER.height, boar_dimen.LEG.LOWER.depth),
        material
    );

    upperLeg.position.y -= boar_dimen.LEG.UPPER.height;

    let upperLegJoint = new THREE.Group();

    let lowerLeg = new THREE.Mesh(
        new THREE.BoxGeometry(boar_dimen.LEG.LOWER.width, boar_dimen.LEG.LOWER.height, boar_dimen.LEG.LOWER.depth),
        material
    );
    lowerLeg.position.y -= boar_dimen.LEG.LOWER.height / 2;

    let lowerLegJoint = new THREE.Group();
    lowerLegJoint.add(lowerLeg);

    upperLegJoint.add(upperLeg);
    upperLeg.add(lowerLegJoint);

    if (isLeft) {
        upperLegJoint.position.set(boar_dimen.BODY.width / 3, boar_dimen.BODY.height/4, boar_dimen.BODY.depth /3);
        upperLegJoint.rotateX(degreesToRadians(boarTheta[partId.LEFT_UPPER_LEG]))

        lowerLegJoint.position.set(0, -boar_dimen.LEG.LOWER.height / 2, 0)

        lowerLegJoint.rotateX(degreesToRadians(boarTheta[partId.LEFT_LOWER_LEG]))

        lowerLegJoint.name = "leftFrontLowerLeg";
        upperLegJoint.name = "leftFrontUpperLeg";
    }
    else {
        upperLegJoint.position.set(boar_dimen.BODY.width / 3, boar_dimen.BODY.height/4, -boar_dimen.BODY.depth /3);
        upperLegJoint.rotateX(degreesToRadians(boarTheta[partId.RIGHT_UPPER_LEG]))

        lowerLegJoint.position.set(0, -boar_dimen.LEG.LOWER.height / 2, 0)

        lowerLegJoint.rotateX(degreesToRadians(boarTheta[partId.RIGHT_LOWER_LEG]))


        lowerLegJoint.name = "rightFrontLowerLeg";
        upperLegJoint.name = "rightFrontUpperLeg";
    }

    return upperLegJoint;
}

function assembleBackLeg(isLeft) {

    let upperLeg = new THREE.Mesh(
        new THREE.BoxGeometry(boar_dimen.LEG.LOWER.width, boar_dimen.LEG.LOWER.height, boar_dimen.LEG.LOWER.depth),
        material
    );

    upperLeg.position.y -= boar_dimen.LEG.UPPER.height;

    let upperLegJoint = new THREE.Group();

    let lowerLeg = new THREE.Mesh(
        new THREE.BoxGeometry(boar_dimen.LEG.LOWER.width, boar_dimen.LEG.LOWER.height, boar_dimen.LEG.LOWER.depth),
        material
    );
    lowerLeg.position.y -= boar_dimen.LEG.LOWER.height / 2;

    let lowerLegJoint = new THREE.Group();
    lowerLegJoint.add(lowerLeg);

    upperLegJoint.add(upperLeg);
    upperLeg.add(lowerLegJoint);

    if (isLeft) {
        upperLegJoint.position.set(-boar_dimen.BODY.width / 3, boar_dimen.BODY.height/4, boar_dimen.BODY.depth /3);
        upperLegJoint.rotateX(degreesToRadians(boarTheta[partId.LEFT_UPPER_LEG]))

        lowerLegJoint.position.set(0, -boar_dimen.LEG.LOWER.height / 2, 0)

        lowerLegJoint.rotateX(degreesToRadians(boarTheta[partId.LEFT_LOWER_LEG]))

        lowerLegJoint.name = "leftBackLowerLeg";
        upperLegJoint.name = "leftBackUpperLeg";
    }
    else {
        upperLegJoint.position.set(-boar_dimen.BODY.width / 3, boar_dimen.BODY.height/4, -boar_dimen.BODY.depth /3);
        upperLegJoint.rotateX(degreesToRadians(boarTheta[partId.RIGHT_UPPER_LEG]))

        lowerLegJoint.position.set(0, -boar_dimen.LEG.LOWER.height / 2, 0)

        lowerLegJoint.rotateX(degreesToRadians(boarTheta[partId.RIGHT_LOWER_LEG]))


        lowerLegJoint.name = "rightBackLowerLeg";
        upperLegJoint.name = "rightBackUpperLeg";
    }

    return upperLegJoint;
}

export function run(boar, collisionBoar) {
    if (currentRunTheta >= maxRunTheta || currentRunTheta <= -maxRunTheta) { thetaRunIncrement = -thetaRunIncrement; }
    if (currentRunThetaLower >= maxRunThetaLower || currentRunThetaLower < 0) {
        thetaRunIncrementLower = -thetaRunIncrementLower;
    }

    currentRunTheta += thetaRunIncrement;
    currentRunThetaLower += thetaRunIncrementLower;

    boarRunTheta[partId.LEFT_UPPER_ARM] += thetaRunIncrement;
    boarRunTheta[partId.RIGHT_UPPER_ARM] -= thetaRunIncrement;

    boarRunTheta[partId.LEFT_LOWER_ARM] -= thetaRunIncrementLower;
    boarRunTheta[partId.RIGHT_LOWER_ARM] -= thetaRunIncrementLower;

    boarRunTheta[partId.LEFT_UPPER_LEG] += thetaRunIncrement;
    boarRunTheta[partId.RIGHT_UPPER_LEG] -= thetaRunIncrement;

    boarRunTheta[partId.LEFT_LOWER_LEG] -= thetaRunIncrementLower;
    boarRunTheta[partId.RIGHT_LOWER_LEG] -= thetaRunIncrementLower;

/*     boar.translateX(0.05)
    collisionBoar.translateX(0.05) */

    boar.getObjectByName("leftFrontUpperLeg").rotation.z = degreesToRadians(boarRunTheta[partId.LEFT_UPPER_ARM]);
    boar.getObjectByName("rightFrontUpperLeg").rotation.z = degreesToRadians(boarRunTheta[partId.RIGHT_UPPER_ARM]);

    boar.getObjectByName("leftFrontLowerLeg").rotation.z = degreesToRadians(boarRunTheta[partId.LEFT_LOWER_ARM]);
    boar.getObjectByName("rightFrontLowerLeg").rotation.z = degreesToRadians(boarRunTheta[partId.RIGHT_LOWER_ARM]);

    boar.getObjectByName("rightBackUpperLeg").rotation.z = degreesToRadians(boarRunTheta[partId.RIGHT_UPPER_LEG]);
    boar.getObjectByName("leftBackUpperLeg").rotation.z = degreesToRadians(boarRunTheta[partId.LEFT_UPPER_LEG]);

    boar.getObjectByName("rightBackLowerLeg").rotation.z = degreesToRadians(boarRunTheta[partId.RIGHT_LOWER_LEG]);
    boar.getObjectByName("leftBackLowerLeg").rotation.z = degreesToRadians(boarRunTheta[partId.LEFT_LOWER_LEG]);

}