//import * as THREE from '../../node_modules/three/src/Three.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { degreesToRadians } from '../utils/utilities.js';
import { colors, bird_dimen, partId, dimen } from '../utils/const.js';

//const materialBody = new THREE.MeshBasicMaterial({ color: colors.yellow })
const materialFace = new THREE.MeshLambertMaterial({ color: colors.black })
const material = new THREE.MeshLambertMaterial({ color: colors.brown3 })

const texture = new THREE.TextureLoader().load( "../final-project-bou_team/src/assets/textures/bird_skin.jpg" );
const materialBody = new THREE.MeshLambertMaterial( { map: texture } );

const maxRunTheta = 20;
var thetaRunIncrement = 1.3;
var currentRunTheta = 0;

const maxRunThetaLower = 20;
var thetaRunIncrementLower = 1.3;
var currentRunThetaLower = 0;

var birdTheta = [0, 0, 180, 0, 180, 0, 0, 0, 0, 0, 0]
var birdRunTheta = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

export function create(debug) {
    let bird = new THREE.Group();

    // Init Geometry

    //#region BODY
    let body = new THREE.Mesh(
        new THREE.CylinderGeometry(bird_dimen.BODY.radiusTop, bird_dimen.BODY.radiusBottom, bird_dimen.BODY.height * 2, 8, 1, false, 3),
        materialBody
    );

    body.rotateZ(-Math.PI * 0.5);

    body.position.set(0, 0, 0);
    body.name = "body"

    bird.add(body);

    //#endregion

    //#region HEAD
    let head = new THREE.Mesh(
        new THREE.CylinderGeometry(bird_dimen.HEAD.radiusTop, bird_dimen.HEAD.radiusBottom, bird_dimen.HEAD.height, 32, 1, false, 3),
        materialBody
    );

    head.rotateZ(-Math.PI * 0.6);

    head.position.set(bird_dimen.BODY.width + bird_dimen.HEAD.width, bird_dimen.BODY.height / 2.5, 0);
    head.name = "head"

    bird.add(head);
    //#endregion

    //#region NOSE

    let nose = new THREE.Mesh(
        new THREE.CylinderGeometry(bird_dimen.NOSE.radiusTop, bird_dimen.NOSE.radiusBottom, bird_dimen.NOSE.height),
        materialFace
    );

    nose.rotateZ(-Math.PI * 0.6);

    nose.position.set(bird_dimen.BODY.width + bird_dimen.HEAD.width *1.5, bird_dimen.BODY.height /4, 0);
    nose.name = "nose"

    bird.add(nose)
    //#endregion

    
    //#region TAIL
    let tail = new THREE.Mesh(
        new THREE.CylinderGeometry(bird_dimen.TAIL.radiusTop, bird_dimen.TAIL.radiusBottom, bird_dimen.TAIL.height, 3),
        materialBody
    );

    tail.rotateZ(-Math.PI * 0.7);

    tail.position.set(-bird_dimen.BODY.width*6, bird_dimen.BODY.height/3, 0);
    tail.name = "tail"

    bird.add(tail)
    //#endregion

    //#region WINGS
    let leftLowerWing = assembleWings(true)
    leftLowerWing.rotateY(-Math.PI * 0.1);
    bird.add(leftLowerWing);

    let rightLowerWing = assembleWings(false)
    rightLowerWing.rotateY(Math.PI * 0.1);
    bird.add(rightLowerWing);

    //#endregion

    let cubeGeometry = new THREE.BoxGeometry(2, 0.7, 1.2, 6, 6, 6);
    let wireMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
 
    if(!debug) { 
        wireMaterial.transparent = true;
        wireMaterial.opacity = 0;
    }
    let collisionBird = new THREE.Mesh(cubeGeometry, wireMaterial);
    
    
    collisionBird.position.set(0, 3.2, 3);
    bird.translateY(bird_dimen.BODY.height*5);
    bird.translateZ(3)

    return {object: bird, collisionObject: collisionBird};
}

function assembleWings(isLeft) {

    let upperWing = new THREE.Mesh(
        new THREE.BoxGeometry(bird_dimen.WINGS.LOWER.width, bird_dimen.WINGS.LOWER.height, bird_dimen.WINGS.LOWER.depth),
        materialBody
    );

    upperWing.position.y -= bird_dimen.WINGS.UPPER.height;

    let upperWingJoint = new THREE.Group();

    let lowerWing = new THREE.Mesh(
        new THREE.BoxGeometry(bird_dimen.WINGS.LOWER.width, bird_dimen.WINGS.LOWER.height, bird_dimen.WINGS.LOWER.depth),
        materialBody
    );
    lowerWing.position.y -= bird_dimen.WINGS.LOWER.height / 2;

    let lowerWingJoint = new THREE.Group();
    lowerWingJoint.add(lowerWing);

    upperWingJoint.add(upperWing);
    upperWing.add(lowerWingJoint);

    if (isLeft) {
        upperWingJoint.position.set(bird_dimen.BODY.width, bird_dimen.BODY.height/6, bird_dimen.BODY.depth);
        upperWingJoint.rotateX(degreesToRadians(birdTheta[partId.LEFT_UPPER_LEG]))

        lowerWingJoint.position.set(0, 0.01, bird_dimen.WINGS.LOWER.depth/1.5)

        lowerWingJoint.rotateX(degreesToRadians(birdTheta[partId.LEFT_LOWER_LEG]))

        lowerWingJoint.name = "leftLowerWing";
        upperWingJoint.name = "leftUpperWing";
    }
    else {
        upperWingJoint.position.set(bird_dimen.BODY.width, bird_dimen.BODY.height/6, -bird_dimen.BODY.depth);
        upperWingJoint.rotateX(degreesToRadians(birdTheta[partId.RIGHT_UPPER_LEG]))

        lowerWingJoint.position.set(0, 0.01, -bird_dimen.WINGS.LOWER.depth/1.5)

        lowerWingJoint.rotateX(degreesToRadians(birdTheta[partId.RIGHT_LOWER_LEG]))


        lowerWingJoint.name = "rightLowerWing";
        upperWingJoint.name = "rightUpperWing";
    }

    return upperWingJoint;
}

export function fly(bird, collisionBird) {
    if (currentRunTheta >= maxRunTheta || currentRunTheta <= -maxRunTheta) { thetaRunIncrement = -thetaRunIncrement; }
    if (currentRunThetaLower >= maxRunThetaLower || currentRunThetaLower < 0) {
        thetaRunIncrementLower = -thetaRunIncrementLower;
    }

    currentRunTheta += thetaRunIncrement;
    currentRunThetaLower += thetaRunIncrementLower;

    birdRunTheta[partId.LEFT_UPPER_LEG] += thetaRunIncrement;
    birdRunTheta[partId.RIGHT_UPPER_LEG] -= thetaRunIncrement;

    birdRunTheta[partId.LEFT_LOWER_LEG] += thetaRunIncrementLower;
    birdRunTheta[partId.RIGHT_LOWER_LEG] -= thetaRunIncrementLower;

/*     bird.translateX(0.05)
    collisionBird.translateX(0.05) */

    bird.getObjectByName("leftUpperWing").rotation.x = degreesToRadians(birdRunTheta[partId.LEFT_UPPER_LEG]);
    bird.getObjectByName("rightUpperWing").rotation.x = degreesToRadians(birdRunTheta[partId.RIGHT_UPPER_LEG]);

    bird.getObjectByName("leftLowerWing").rotation.x = degreesToRadians(birdRunTheta[partId.LEFT_LOWER_LEG]);
    bird.getObjectByName("rightLowerWing").rotation.x = degreesToRadians(birdRunTheta[partId.RIGHT_LOWER_LEG]);

}