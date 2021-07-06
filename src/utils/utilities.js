export function degreesToRadians(degree) {
    return degree * Math.PI / 180
}

export function radiansToDegree(radians) {
    return radians * 180 / Math.PI
}

export function isNearTo(pt, center, r) {

    let lhs = Math.pow(pt[0] - center[0], 2) + Math.pow(pt[1] -center[1], 2);
    let rhs = Math.pow(r, 2);

    //console.log(pt, center, lhs, rhs);

    return lhs <= rhs ? 1 : 0;
}