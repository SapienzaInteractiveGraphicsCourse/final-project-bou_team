//import * as THREE from '../../node_modules/three/src/Three.js';
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { degreesToRadians } from '../utils/utilities.js'
import { colors, dimen, partId } from '../utils/const.js';
import { tweenJumpHelper, tweenRotationHelper } from '../animations/moveHelper.js';

const normal = new THREE.TextureLoader().load('/src/assets/textures/NormalMapTshirt.png');
const createtexture = new THREE.TextureLoader().load('/src/assets/textures/DiffuseTshirt.png');
const bump = new THREE.TextureLoader().load('/src/assets/textures/NormalMapTshirt.png');
const Hatpirate = new THREE.TextureLoader().load('/src/assets/textures/pirate.png');
const face = new THREE.TextureLoader().load('/src/assets/textures/face.png');

const materialBody = new THREE.MeshStandardMaterial({ color: colors.pink })
const materialWand = new THREE.MeshStandardMaterial({ color: colors.brown })
const materialPants = new THREE.MeshStandardMaterial({ color: colors.darkGray })
const material = new THREE.MeshStandardMaterial({ color: colors.pink })
const Headmaterial = new THREE.MeshStandardMaterial({ map: face })
const HeadColor = new THREE.MeshStandardMaterial({ color: colors.Gray })
const HatmaterialUp = new THREE.MeshStandardMaterial({ map: Hatpirate })
const Hatmaterial = new THREE.MeshStandardMaterial({ color: colors.black })
const materialTshirtB = new THREE.MeshPhongMaterial( { 
    color: colors.white,
    normalMap : normal,
    map :  createtexture,
    bumpMap: bump,
    bumpScale  :  0.45,
});
const materialTshirtA = new THREE.MeshStandardMaterial({ color: colors.white })
const materialShorts = new THREE.MeshStandardMaterial({ color: colors.black })

const maxWalkTheta = 25;
var thetaWalkIncrement = 0.5;
var currentWalkTheta = 0;

const maxRunTheta = 40;
var thetaRunIncrement = 1.3;
var currentRunTheta = 0;

const maxRunThetaLower = 40;
var thetaRunIncrementLower = 1.3;
var currentRunThetaLower = 0;



/* const partId = {
    BODY: 0, HEAD: 1, LEFT_UPPER_ARM: 2, LEFT_LOWER_ARM: 3,
    RIGHT_UPPER_ARM: 4,
    RIGHT_LOWER_ARM: 5,
    WAND: 6,
    LEFT_UPPER_LEG: 7,
    LEFT_LOWER_LEG: 8,
    RIGHT_UPPER_LEG: 9,
    RIGHT_LOWER_LEG: 10,
} */
var humanThetaBack = [0, 0, 180, 0, 180, 0, 0, 0, 0, 0, 0]

var humanTheta = [0, 0, 180, 0, 180, 0, 0, 0, 0, 0, 0]

var humanRunTheta = [0, 0, 180, 180, 180, 180, 0, 0, 0, 0, 0]

var humanPositionJump1 = [0, 1.95, 0];
var humanThetaJump1 = [2.5, 0, 190, 75, 190, 75, 0, -25, 25, -25, 25]

var humanPositionJump2 = [0, 2.95, 0];
var humanThetaJump2 = [5, 0, 30, 160, 30, 160, 0, -15, 15, -15, 15]

var humanPositionJump3 = [0, 3.30, 0];
var humanThetaJump3 = [5, 0, 30, 160, 30, 160, 0, 0, 15, -15, 15]


export function create(debug) {
    let human = new THREE.Group();

    // Init Geometry

    //#region BODY
    let body = new THREE.Mesh(
        new THREE.BoxGeometry(dimen.BODY.width, dimen.BODY.height, dimen.BODY.depth),
        materialBody
    );
    let tShirt = new THREE.Mesh(
        new THREE.BoxGeometry(dimen.TSHIRT.BODY.width, dimen.TSHIRT.BODY.height, dimen.TSHIRT.BODY.depth),[ 
            materialTshirtA, //left side 
            materialTshirtA, // right side
            materialTshirtA, //top
            materialTshirtA, // bottom
            materialTshirtB, 
            materialTshirtA
        ]
    );
    let Shorts = new THREE.Mesh(
        new THREE.BoxGeometry(dimen.SHORTS.UPPER.width, dimen.SHORTS.UPPER.height, dimen.SHORTS.UPPER.depth),
        materialShorts
    );
    tShirt.position.set(0,0.27,0);
    Shorts.position.set(0,-0.75,0);
    body.position.set(0, 0, 0);
    body.name = "body"
    body.castShadow = true;
    body.add(tShirt);
    body.add(Shorts);
    human.add(body);

    //#endregion

    //#region HEAD
    let head = new THREE.Mesh(
        new THREE.BoxGeometry(dimen.HEAD.width, dimen.HEAD.height, dimen.HEAD.depth),[
        HeadColor,
        HeadColor,
        HeadColor,
        HeadColor,
        Headmaterial,
        HeadColor
        ]);
    let hat = new THREE.Mesh(
        new THREE.BoxGeometry(dimen.HAT.width, dimen.HAT.height, dimen.HAT.depth),[
            Hatmaterial, //left side
            Hatmaterial, //right side
            HatmaterialUp, //top
            Hatmaterial, //bottom
            Hatmaterial, 
            Hatmaterial
        ]
    );
    let hatTail = new THREE.Mesh(
        new THREE.BoxGeometry(dimen.HATTAIL.width, dimen.HATTAIL.height, dimen.HATTAIL.depth),
        Hatmaterial
    );
    hat.position.set(0, dimen.BODY.height / 2.5 - dimen.HEAD.height , 0)
    hatTail.position.set(0, dimen.BODY.height / 6 - dimen.HEAD.height , -0.25)
    head.position.set(0, dimen.BODY.height / 2 + dimen.HEAD.height / 2, 0);
    head.name = "head"
    hat.add(hatTail);
    head.add(hat);
    human.add(head);
    //#endregion

    //#region ARMS

    let leftArm = assembleArm(true);

    human.add(leftArm);

    let rightArm = assembleArm(false);

    human.add(rightArm);

    //#endregion

    //#region WAND

    let wand = new THREE.Mesh(
        new THREE.BoxGeometry(dimen.WAND.width, dimen.WAND.height, dimen.WAND.depth),
        materialWand
    );

    wand.position.set(0, dimen.ARM.LOWER.height, dimen.ARM.LOWER.depth);

    wand.rotateX(degreesToRadians(90))
    wand.name = "wand"

    rightArm.getObjectByName("rightLowerArm").add(wand);
    //#endregion

    //#region LEGS
    let leftLeg = assembleLeg(true)
    human.add(leftLeg);

    let rightLeg = assembleLeg(false);
    human.add(rightLeg);

    //#endregion

    let cubeGeometry = new THREE.BoxGeometry(1.5, 5, 1.5, 6, 6, 6);
    let wireMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    if (!debug) {
        wireMaterial.transparent = true;
        wireMaterial.opacity = 0;
    }
    let collisionHuman = new THREE.Mesh(cubeGeometry, wireMaterial);

    human.castShadow = true;
    human.receiveShadow = false;
    human.rotateX(degreesToRadians(humanTheta[partId.BODY]))
    human.position.set(humanPositionJump1[0], humanPositionJump1[1], humanPositionJump1[2])

    return { human: human, collisionHuman: collisionHuman };
}


export function jump(human, collisionHuman, handleJump) {
    handleJump();

    let body = human.getObjectByName("body").rotation;
    let leftUpperArm = human.getObjectByName("leftUpperArm").rotation;
    let rightUpperArm = human.getObjectByName("rightUpperArm").rotation;
    let leftLowerArm = human.getObjectByName("leftLowerArm").rotation;
    let rightLowerArm = human.getObjectByName("rightLowerArm").rotation;
    let rightUpperLeg = human.getObjectByName("rightUpperLeg").rotation;
    let leftUpperLeg = human.getObjectByName("leftUpperLeg").rotation;
    let rightLowerLeg = human.getObjectByName("rightLowerLeg").rotation;
    let leftLowerLeg = human.getObjectByName("leftLowerLeg").rotation;

    tweenRotationHelper(body, degreesToRadians(humanThetaJump1[partId.BODY]), degreesToRadians(humanThetaJump2[partId.BODY]), degreesToRadians(humanThetaJump3[partId.BODY]), degreesToRadians(humanTheta[partId.BODY]));
    tweenRotationHelper(leftUpperArm, degreesToRadians(humanThetaJump1[partId.LEFT_UPPER_ARM]), degreesToRadians(humanThetaJump2[partId.LEFT_UPPER_ARM]), degreesToRadians(humanThetaJump3[partId.LEFT_UPPER_ARM]), degreesToRadians(humanTheta[partId.LEFT_UPPER_ARM]))
    tweenRotationHelper(rightUpperArm, degreesToRadians(humanThetaJump1[partId.RIGHT_UPPER_ARM]), degreesToRadians(humanThetaJump2[partId.RIGHT_UPPER_ARM]), degreesToRadians(humanThetaJump3[partId.RIGHT_UPPER_ARM]), degreesToRadians(humanTheta[partId.RIGHT_UPPER_ARM]))

    tweenRotationHelper(leftLowerArm, degreesToRadians(humanThetaJump1[partId.LEFT_LOWER_ARM]), degreesToRadians(humanThetaJump2[partId.LEFT_LOWER_ARM]), degreesToRadians(humanThetaJump3[partId.LEFT_LOWER_ARM]), degreesToRadians(180))
    tweenRotationHelper(rightLowerArm, degreesToRadians(humanThetaJump1[partId.RIGHT_LOWER_ARM]), degreesToRadians(humanThetaJump2[partId.RIGHT_LOWER_ARM]), degreesToRadians(humanThetaJump3[partId.RIGHT_LOWER_ARM]), degreesToRadians(180))

    tweenRotationHelper(rightUpperLeg, degreesToRadians(humanThetaJump1[partId.RIGHT_UPPER_LEG]), degreesToRadians(humanThetaJump2[partId.RIGHT_UPPER_LEG]), degreesToRadians(humanThetaJump3[partId.RIGHT_UPPER_LEG]), degreesToRadians(humanTheta[partId.RIGHT_UPPER_LEG]))
    tweenRotationHelper(leftUpperLeg, degreesToRadians(humanThetaJump1[partId.LEFT_UPPER_LEG]), degreesToRadians(humanThetaJump2[partId.LEFT_UPPER_LEG]), degreesToRadians(humanThetaJump3[partId.LEFT_UPPER_LEG]), degreesToRadians(humanTheta[partId.LEFT_UPPER_LEG]))

    tweenRotationHelper(rightLowerLeg, degreesToRadians(humanThetaJump1[partId.RIGHT_LOWER_LEG]), degreesToRadians(humanThetaJump2[partId.RIGHT_LOWER_LEG]), degreesToRadians(humanThetaJump3[partId.RIGHT_LOWER_LEG]), degreesToRadians(humanTheta[partId.RIGHT_LOWER_LEG]))
    tweenRotationHelper(leftLowerLeg, degreesToRadians(humanThetaJump1[partId.LEFT_LOWER_LEG]), degreesToRadians(humanThetaJump2[partId.LEFT_LOWER_LEG]), degreesToRadians(humanThetaJump3[partId.LEFT_LOWER_LEG]), degreesToRadians(humanTheta[partId.LEFT_LOWER_LEG]))

    tweenJumpHelper(human.position, collisionHuman.position, humanPositionJump1, humanPositionJump2, humanPositionJump3, humanPositionJump1)

}



export function walk(human) {
    if (currentWalkTheta >= maxWalkTheta || currentWalkTheta <= -maxWalkTheta) { thetaWalkIncrement = -thetaWalkIncrement; }
    currentWalkTheta += thetaWalkIncrement;

    humanTheta[partId.LEFT_UPPER_ARM] += thetaWalkIncrement;
    humanTheta[partId.RIGHT_UPPER_ARM] -= thetaWalkIncrement;
    humanTheta[partId.LEFT_UPPER_LEG] += thetaWalkIncrement;
    humanTheta[partId.RIGHT_UPPER_LEG] -= thetaWalkIncrement;

    //onsole.log(manTheta[partId.RIGHT_ARM])
    human.getObjectByName("rightUpperArm").rotation.x = degreesToRadians(humanTheta[partId.RIGHT_UPPER_ARM]);
    human.getObjectByName("leftUpperArm").rotation.x = degreesToRadians(humanTheta[partId.LEFT_UPPER_ARM]);

    human.getObjectByName("rightUpperLeg").rotation.x = degreesToRadians(humanTheta[partId.RIGHT_UPPER_LEG]);
    human.getObjectByName("leftUpperLeg").rotation.x = degreesToRadians(humanTheta[partId.LEFT_UPPER_LEG]);
}

export function run(human) {
    if (currentRunTheta >= maxRunTheta || currentRunTheta <= -maxRunTheta) { thetaRunIncrement = -thetaRunIncrement; }
    if (currentRunThetaLower >= maxRunThetaLower || currentRunThetaLower < 0) {
        thetaRunIncrementLower = -thetaRunIncrementLower;
    }

    currentRunTheta += thetaRunIncrement;
    currentRunThetaLower += thetaRunIncrementLower;

    humanRunTheta[partId.LEFT_UPPER_ARM] += thetaRunIncrement;
    humanRunTheta[partId.RIGHT_UPPER_ARM] -= thetaRunIncrement;

    humanRunTheta[partId.LEFT_LOWER_ARM] -= thetaRunIncrementLower;
    humanRunTheta[partId.RIGHT_LOWER_ARM] -= thetaRunIncrementLower;

    humanRunTheta[partId.LEFT_UPPER_LEG] += thetaRunIncrement;
    humanRunTheta[partId.RIGHT_UPPER_LEG] -= thetaRunIncrement;

    humanRunTheta[partId.LEFT_LOWER_LEG] += thetaRunIncrementLower;
    humanRunTheta[partId.RIGHT_LOWER_LEG] += thetaRunIncrementLower;

    //onsole.log(manTheta[partId.RIGHT_ARM])
    human.getObjectByName("leftUpperArm").rotation.x = degreesToRadians(humanRunTheta[partId.LEFT_UPPER_ARM]);
    human.getObjectByName("rightUpperArm").rotation.x = degreesToRadians(humanRunTheta[partId.RIGHT_UPPER_ARM]);

    human.getObjectByName("leftLowerArm").rotation.x = degreesToRadians(humanRunTheta[partId.LEFT_LOWER_ARM]);
    human.getObjectByName("rightLowerArm").rotation.x = degreesToRadians(humanRunTheta[partId.RIGHT_LOWER_ARM]);

    human.getObjectByName("rightUpperLeg").rotation.x = degreesToRadians(humanRunTheta[partId.RIGHT_UPPER_LEG]);
    human.getObjectByName("leftUpperLeg").rotation.x = degreesToRadians(humanRunTheta[partId.LEFT_UPPER_LEG]);

    human.getObjectByName("rightLowerLeg").rotation.x = degreesToRadians(humanRunTheta[partId.RIGHT_LOWER_LEG]);
    human.getObjectByName("leftLowerLeg").rotation.x = degreesToRadians(humanRunTheta[partId.LEFT_LOWER_LEG]);

}


export function restPose(human) {

    humanTheta = [0, 0, 180, 0, 180, 0, 0, 0, 0, 0, 0]
    humanRunTheta = [0, 0, 180, 180, 180, 180, 0, 0, 0, 0, 0]

    currentRunThetaLower = 0;

    currentWalkTheta = 0;

    currentRunTheta = 0;


    human.getObjectByName("leftUpperArm").rotation.x = degreesToRadians(humanRunTheta[partId.LEFT_UPPER_ARM]);
    human.getObjectByName("rightUpperArm").rotation.x = degreesToRadians(humanRunTheta[partId.RIGHT_UPPER_ARM]);

    human.getObjectByName("leftLowerArm").rotation.x = degreesToRadians(humanRunTheta[partId.LEFT_LOWER_ARM]);
    human.getObjectByName("rightLowerArm").rotation.x = degreesToRadians(humanRunTheta[partId.RIGHT_LOWER_ARM]);

    human.getObjectByName("rightUpperLeg").rotation.x = degreesToRadians(humanRunTheta[partId.RIGHT_UPPER_LEG]);
    human.getObjectByName("leftUpperLeg").rotation.x = degreesToRadians(humanRunTheta[partId.LEFT_UPPER_LEG]);

    human.getObjectByName("rightLowerLeg").rotation.x = degreesToRadians(humanRunTheta[partId.RIGHT_LOWER_LEG]);
    human.getObjectByName("leftLowerLeg").rotation.x = degreesToRadians(humanRunTheta[partId.LEFT_LOWER_LEG]);
}

function assembleArm(isLeft) {
    let upperArm = new THREE.Mesh(
        new THREE.BoxGeometry(dimen.ARM.UPPER.width, dimen.ARM.UPPER.height, dimen.ARM.UPPER.depth),
        material
    );
    let tShirt = new THREE.Mesh(
        new THREE.BoxGeometry(dimen.TSHIRT.SLEEVE.width, dimen.TSHIRT.SLEEVE.height, dimen.TSHIRT.SLEEVE.depth),
        materialTshirtA
    );
    upperArm.position.y += dimen.ARM.UPPER.height / 2;
    tShirt.position.y -= dimen.ARM.UPPER.height/5;
    upperArm.add(tShirt);
    let upperArmJoint = new THREE.Group();
    upperArmJoint.add(upperArm);

    let lowerArm = new THREE.Mesh(
        new THREE.BoxGeometry(dimen.ARM.LOWER.width, dimen.ARM.LOWER.height, dimen.ARM.LOWER.depth),
        material
    );
    lowerArm.position.y += dimen.ARM.LOWER.height / 2;

    let lowerArmJoint = new THREE.Group();
    lowerArmJoint.add(lowerArm);

    upperArm.add(lowerArmJoint);
    lowerArmJoint.rotateY(degreesToRadians(180))

    if (isLeft) {
        upperArmJoint.position.set(-dimen.BODY.width / 2 - dimen.ARM.width / 2, dimen.BODY.height / 2, 0);
        upperArmJoint.rotateX(degreesToRadians(humanTheta[partId.LEFT_UPPER_ARM]));
        upperArmJoint.name = "leftUpperArm";

        lowerArmJoint.position.set(0, dimen.ARM.LOWER.height / 2, 0)
        lowerArmJoint.name = "leftLowerArm";

        lowerArmJoint.rotateX(degreesToRadians(humanTheta[partId.LEFT_LOWER_ARM]))
    }
    else {
        upperArmJoint.position.set(dimen.BODY.width / 2 + dimen.ARM.width / 2, dimen.BODY.height / 2, 0)
        upperArmJoint.rotateX(degreesToRadians(humanTheta[partId.RIGHT_UPPER_ARM]))
        upperArmJoint.name = "rightUpperArm"

        lowerArmJoint.position.set(0, dimen.ARM.LOWER.height / 2, 0)
        lowerArmJoint.name = "rightLowerArm";


        //lowerArmJoint.rotateX(degreesToRadians(humanTheta[partId.RIGHT_UPPER_ARM]))
        lowerArmJoint.rotateX(degreesToRadians(humanTheta[partId.RIGHT_LOWER_ARM]))
    }

    return upperArmJoint;
}

function assembleLeg(isLeft) {

    let upperLeg = new THREE.Mesh(
        new THREE.BoxGeometry(dimen.LEG.LOWER.width, dimen.LEG.LOWER.height, dimen.LEG.LOWER.depth),
        material
    );
    let Shorts = new THREE.Mesh(
        new THREE.BoxGeometry(dimen.SHORTS.LOWER.width, dimen.SHORTS.LOWER.height, dimen.SHORTS.LOWER.depth),
        materialShorts
    );
    upperLeg.position.y -= dimen.LEG.UPPER.height;
    Shorts.position.y +=  dimen.LEG.UPPER.height/6;
    upperLeg.add(Shorts);

    let upperLegJoint = new THREE.Group();

    let lowerLeg = new THREE.Mesh(
        new THREE.BoxGeometry(dimen.LEG.LOWER.width, dimen.LEG.LOWER.height, dimen.LEG.LOWER.depth),
        material
    );
    lowerLeg.position.y -= dimen.LEG.LOWER.height / 2;

    let lowerLegJoint = new THREE.Group();
    lowerLegJoint.add(lowerLeg);

    upperLegJoint.add(upperLeg);
    upperLeg.add(lowerLegJoint);

    if (isLeft) {
        upperLegJoint.position.set(-dimen.BODY.width / 3, -dimen.LEG.UPPER.height + dimen.LEG.UPPER.width / 2, 0);
        upperLegJoint.rotateX(degreesToRadians(humanTheta[partId.LEFT_UPPER_LEG]))

        lowerLegJoint.position.set(0, -dimen.LEG.LOWER.height / 2, 0)

        lowerLegJoint.rotateX(degreesToRadians(humanTheta[partId.LEFT_LOWER_LEG]))

        lowerLegJoint.name = "leftLowerLeg";
        upperLegJoint.name = "leftUpperLeg";
    }
    else {
        upperLegJoint.position.set(dimen.BODY.width / 3, -dimen.LEG.UPPER.height + dimen.LEG.UPPER.width / 2, 0);
        upperLegJoint.rotateX(degreesToRadians(humanTheta[partId.RIGHT_UPPER_LEG]))

        lowerLegJoint.position.set(0, -dimen.LEG.LOWER.height / 2, 0)

        lowerLegJoint.rotateX(degreesToRadians(humanTheta[partId.RIGHT_LOWER_LEG]))


        lowerLegJoint.name = "rightLowerLeg";
        upperLegJoint.name = "rightUpperLeg";
    }

    return upperLegJoint;
}

