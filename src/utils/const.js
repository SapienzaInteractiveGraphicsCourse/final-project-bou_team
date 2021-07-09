
const dimen = {
    BODY: {
        width: 0.9,
        height: 2,
        depth: 0.5,
    },
    TSHIRT: {
        BODY: {
            width: 1.0,
            height: 1.5,
            depth: 0.6,
        },
        SLEEVE: {
            width: 0.3,
            height: 1.5 / 3,
            depth: 0.3,
        }

    },
    SHORTS: {
        UPPER: {
            width: 1.0,
            height: 0.6,
            depth: 0.6,
        },
        LOWER: {
            width: 0.4,
            height: 1.5 / 3,
            depth: 0.6,
        }

    },
    HEAD: {
        width: 0.5,
        height: 0.5,
        depth: 0.5,
    },
    HAT: {
        width: 0.55,
        height: 0.15,
        depth: 0.55,
    },
    HATTAIL: {
        width: 0.15,
        height: 0.5,
        depth: 0.15,
    },
    ARM: {
        UPPER: {
            width: 0.25,
            height: 1.5 / 2,
            depth: 0.25,
        },
        LOWER: {
            width: 0.25,
            height: 1.5 / 2,
            depth: 0.25,
        },
        width: 0.25,
        height: 1.5,
        depth: 0.25,
    },
    LEG: {
        UPPER: {
            width: 0.25,
            height: 1.5 / 2,
            depth: 0.25,
        },
        LOWER: {
            width: 0.25,
            height: 1.5 / 2,
            depth: 0.25,
        },
        width: 0.25,
        height: 1.5,
        depth: 0.25,
    },
    WAND: {
        width: 0.05,
        height: 0.75,
        depth: 0.05,
    },
    CAR: {
        WHEEL: {
            width: 0.8,
            height: 1,
            depth: 0.5,
        },
        MAIN: {
            width: 3,
            height: 1.5,
            depth: 5.5,
        },
        CABIN: {
            width: 3,
            height: 1,
            depth: 2.5,
        }
    },
    TRUCK: {
        WHEEL: {
            width: 1,
            height: 1,
            depth: 0.8,
        },
        MAIN: {
            width: 3,
            height: 4,
            depth: 10,
        },
        CABIN: {
            width: 3,
            height: 2.5,
            depth: 3,
        }
    },
    COIN: {
        radius: 0.5
    },
    PINETREE: {
        BASE: {
            circleUp: 0.5,
            circleDown: 1.0,
            height: 2.0,
        },
        FPYRAMID: {
            width: 4,
            height: 7,
            ntriangle: 7,
        },
        SPYRAMID: {
            width: 3,
            height: 6,
            ntriangle: 7,
        },
        TPYRAMID: {
            width: 2,
            height: 5,
            ntriangle: 7,
        }
    },
    SIMPLETREE: {
        BASE: {
            circleUp: 0.5,
            circleDown: 1.0,
            height: 2.5,
        },
        CROWN: {
            radius: 3.5,
            width: 10,
            height: 10,
        }
    }

}

const boar_dimen = {
    BODY: {
        width: 2,
        height: 0.9,
        depth: 1.2,
        radiusTop: 0.5,
        radiusBottom: 0.5
    },
    HEAD: {
        width: 0.6,
        height: 0.6,
        depth: 0.5,
        radiusTop: 0.25,
        radiusBottom: 0.3
    },
    LEG: {
        UPPER: {
            width: 0.13,
            height: 1 / 2,
            depth: 0.13,
        },
        LOWER: {
            width: 0.13,
            height: 1 / 2,
            depth: 0.13,
        },
        width: 0.13,
        height: 1,
        depth: 0.13
    },
    EAR: {
        width: 0.05,
        height: 0.3,
        depth: 0.13
    },
    NOSE: {
        height: 0.3,
        radiusTop: 0.07,
        radiusBottom: 0.1
    },
    TAIL: {
        height: 0.5,
        radiusTop: 0.1,
        radiusBottom: 0.05
    },
    FANG: {
        height: 0.17,
        radiusTop: 0.02,
        radiusBottom: 0.04
    }
}

const bird_dimen = {
    BODY: {
        width: 0.1,
        height: 0.6,
        depth: 0.2,
        radiusTop: 0.2,
        radiusBottom: 0.1
    },
    HEAD: {
        width: 0.55,
        height: 0.5,
        depth: 0.2,
        radiusTop: 0.05,
        radiusBottom: 0.15
    },
    WINGS: {
        UPPER: {
            width: 0.3,
            height: 0.025,
            depth: 0.7 / 2,
        },
        LOWER: {
            width: 0.3,
            height: 0.025,
            depth: 0.7 / 2,
        },
        width: 0.3,
        height: 0.025,
        depth: 0.7,
    },
    NOSE: {
        height: 0.1,
        radiusTop: 0.01,
        radiusBottom: 0.02
    },
    TAIL: {
        height: 0.35,
        radiusTop: 0.03,
        radiusBottom: 0.06
    }
}

const colors = {
    white: "rgb(255, 255, 255)",
    darkGray: "rgb(20, 20, 20)",
    Gray: "rgb(128,128,128)",
    brown: "rgb(133,94,66)",
    brown2: "rgb(101,67,33)",
    brown3: "rgb(43, 29, 14)",
    pink: "rgb(255,192,203)",
    green: "rgb(0,255,0)",
    blue: "rgb(0,0,255)",
    red: "rgb(255,0,0)",
    lightBlue: "rgb(29,161,255)",
    black: "rgb(0,0,0)",
    yellow: "rgb(255,255,0)",
    gold: "rgb(212,175,55)"
};

const partId = {
    BODY: 0,
    HEAD: 1,
    LEFT_UPPER_ARM: 2,
    LEFT_LOWER_ARM: 3,
    RIGHT_UPPER_ARM: 4,
    RIGHT_LOWER_ARM: 5,
    WAND: 6,
    LEFT_UPPER_LEG: 7,
    LEFT_LOWER_LEG: 8,
    RIGHT_UPPER_LEG: 9,
    RIGHT_LOWER_LEG: 10,
}

const objectsId = {
    CAR_ID: 0,
    TRUCK_ID: 1,
    COIN_ID: 2,
    BIRD_ID: 3,
    BOAR_ID: 4,
    HUMAN_ID: 5
}

const treePositions = [
    {
        x: 10,
        y: 0,
        z: 31,
    },
    {
        x: -30,
        y: 0,
        z: 0,
    },
    {
        x: 50,
        y: 0,
        z: 31,
    },
    {
        x: 40,
        y: 0,
        z: 62,
    },
    {
        x: -50,
        y: 0,
        z: 31,
    },
    {
        x: 50,
        y: 0,
        z: -31,
    },
    {
        x: 0,
        y: 0,
        z: -31,
    }
];

const losePage = '<div id="lose"><div class="row d-flex justify-content-center"><h1 class="display-4"><i class="fas fa-star fa-1x text-info"></i> Score: <a id="score"></a></h1>      </div><div class="row d-flex justify-content-center"><h1 class="display-4"><i class="fas fa-meteor fa-1x text-danger"></i> Best score: <a id="best_score"></a></h1></div><div class="row"><div class="col d-flex justify-content-center">   <button id="retryButton" role="button" class="btn btn-warning btn-lg" style="width: 14rem; height: 6rem;"><i class="fas fa-redo-alt fa-3x"></i><c style="font-size: 3rem;"> Retry</c></button></div></div><br><br></div>';
const retryProgress = '<div id="progress"><br><br><br><div class="row"><div class="col-12 d-flex justify-content-center"><div class="spinner-border text-info" style="width: 4rem; height: 4rem;" role="status"><span class="sr-only">Loading...</span></div></div></div></div>';

const car_sound = '<audio id="audio1" autoplay><source src="/src/assets/sound/car.mp3"></audio>';
const truck_sound = '<audio id="audio2" autoplay><source src="/src/assets/sound/truck.mp3"></audio>';
const boar_sound = '<audio id="audio3" autoplay><source src="/src/assets/sound/boar.mp3"></audio>';
const bird_sound = '<audio id="audio4" autoplay><source src="/src/assets/sound/bird.mp3"></audio>';
const kill_sound = '<audio id="audio5" autoplay><source src="/src/assets/sound/kill.mp3"></audio>';
const coin_sound = '<audio id="audio6" autoplay><source src="/src/assets/sound/coin.mp3"></audio>';
const yeah_sound = '<audio id="audio7" autoplay><source src="/src/assets/sound/yeah.mp3"></audio>';
const gasp_sound = '<audio id="audio8" autoplay><source src="/src/assets/sound/gasp.mp3"></audio>';
const bell_sound = '<audio id="audio8" autoplay><source src="/src/assets/sound/bell.mp3"></audio>';


export {
    colors,
    dimen,
    partId,
    objectsId,
    boar_dimen,
    bird_dimen,
    losePage,
    retryProgress,
    car_sound,
    truck_sound,
    boar_sound,
    bird_sound,
    kill_sound,
    coin_sound,
    yeah_sound,
    gasp_sound,
    bell_sound,
    treePositions

};