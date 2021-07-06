
import { degreesToRadians } from '../utils/utilities.js'


export function moveObject(object, collisionObject, index, laneFlag) {
    var random = 500 + ((index + 1) * 1000);
    var tween1 = createjs.Tween.get(object.position, { loop: true }).wait(500).to({ x: laneFlag ? -60 : 60 }, random, createjs.Ease.quartInOut)
    var tween2 = createjs.Tween.get(collisionObject.position, { loop: true }).wait(500).to({ x: laneFlag ? -60 : 60 }, random, createjs.Ease.quartInOut)

    return { tween1: tween1, tween2: tween2, object: object, collisionObject: collisionObject }
}

export function moveAnimal(object, collisionObject, isBird, index) {
    let randomY = Math.floor(Math.random() * 3) + 1;
    let randomZ = Math.floor(Math.random() * 70);


    var randomBird = 3500 + ((index + 1) * 1000);
    var randomBoar = 5500 + ((index + 1) * 1000);

    var tween1 = createjs.Tween
        .get(object.position, { loop: true })
        .wait(500)
        .to({ x: 60, y: isBird ? randomY : 0.5, z: randomZ }, isBird ? randomBird : randomBoar, createjs.Ease.quartInOut)

    var tween2 = createjs.Tween
        .get(collisionObject.position, { loop: true })
        .wait(500)
        .to({ x: 60, y: isBird ? randomY : 0.5, z: randomZ }, isBird ? randomBird : randomBoar, createjs.Ease.quartInOut)

    return { tween1: tween1, tween2: tween2, object: object, collisionObject: collisionObject }
}

export function stopObject(objectTweens) {
    if (objectTweens?.tween1 && objectTweens?.tween2) {

        createjs.Tween.removeAllTweens(objectTweens.tween1)
        createjs.Tween.removeAllTweens(objectTweens.tween2)
    }
}

export function rotatingObject(object) {
    return createjs.Tween
        .get(object.rotation, { loop: true })
        .to({ x: degreesToRadians(360), y: degreesToRadians(360), z: degreesToRadians(360) }, 2000);
}

export function tweenRotationHelper(object, theta1, theta2, theta3, theta4) {
    return createjs.Tween
        .get(object)
        .to({ x: theta1 }, 250, createjs.Ease.quartInOut)
        .to({ x: theta2 }, 250, createjs.Ease.quartInOut)
        .to({ x: theta3 }, 250, createjs.Ease.quartInOut)
        .to({ x: theta4 }, 250, createjs.Ease.quartInOut)
}

export function tweenJumpHelper(object, collisionObject, pos1, pos2, pos3, pos4) {
    createjs.Tween
        .get(object)
        .to({ y: pos1[1], }, 250, createjs.Ease.quartInOut)
        .to({ y: pos2[1], }, 250, createjs.Ease.quartInOut)
        .to({ y: pos3[1], }, 250, createjs.Ease.quartInOut)
        .to({ y: pos4[1], }, 250, createjs.Ease.quartInOut)

    createjs.Tween
        .get(collisionObject)
        .to({ y: pos1[1], }, 250, createjs.Ease.quartInOut)
        .to({ y: pos2[1], }, 250, createjs.Ease.quartInOut)
        .to({ y: pos3[1], }, 250, createjs.Ease.quartInOut)
        .to({ y: pos4[1], }, 250, createjs.Ease.quartInOut)

}