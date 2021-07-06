import * as THREE from '../../node_modules/three/src/Three.js';
import { colors, dimen } from '../utils/const.js';

var tree;

export function create(pine){
    if(pine){
        tree  = new THREE.Group();
        const base = new THREE.Mesh(new THREE.CylinderGeometry(dimen.PINETREE.BASE.circleUp,dimen.PINETREE.BASE.circleDown,dimen.PINETREE.BASE.height), 
            new THREE.MeshLambertMaterial({ color : colors.brown}));
        
        base.position.set(0,0.5,0);
        tree.add(base);

        const first = new THREE.Mesh( new THREE.ConeBufferGeometry(dimen.PINETREE.FPYRAMID.width, dimen.PINETREE.FPYRAMID.height, dimen.PINETREE.FPYRAMID.ntriangle), 
            new THREE.MeshLambertMaterial({color: colors.green}));
        
        first.position.set(0,5,0);
        tree.add(first);

        const second = new THREE.Mesh( new THREE.ConeBufferGeometry(dimen.PINETREE.SPYRAMID.width, dimen.PINETREE.SPYRAMID.height, dimen.PINETREE.SPYRAMID.ntriangle), 
            new THREE.MeshLambertMaterial({color: colors.green}));
        
        second.position.set(0,8,0);
        tree.add(second);
        
        const third = new THREE.Mesh( new THREE.ConeBufferGeometry(dimen.PINETREE.TPYRAMID.width, dimen.PINETREE.TPYRAMID.height, dimen.PINETREE.TPYRAMID.ntriangle), 
        new THREE.MeshLambertMaterial({color: colors.green}));

        third.position.set(0,11,0);
        tree.add(third);
    }
    else{

        tree  = new THREE.Group();
        const base = new THREE.Mesh(new THREE.CylinderGeometry(dimen.SIMPLETREE.BASE.circleUp,dimen.PINETREE.BASE.circleDown,dimen.PINETREE.BASE.height), 
            new THREE.MeshLambertMaterial({ color : colors.brown3}));
        
        base.position.set(0,0.5,0);
        tree.add(base);

        const first = new THREE.Mesh( new THREE.SphereGeometry(dimen.SIMPLETREE.CROWN.radius, dimen.SIMPLETREE.CROWN.width, dimen.SIMPLETREE.CROWN.height), 
            new THREE.MeshLambertMaterial({color: colors.green}));
        
        first.position.set(0,4.5,0);
        tree.add(first);

    }
    
    return tree;

}