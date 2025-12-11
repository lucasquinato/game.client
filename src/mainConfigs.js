export const CANVAS_RESOLUTION = {
    WIDTH: 320,
    HEIGHT: 180,
};

export const SCENES = {
    NAME: {
        DEFAULT: "Lobby",
        LOBBY: "Lobby",
        BATTLE: "Battle",
    },
};

export const TILE_SIZES = (() => {
    const WIDTH = 32;
    const HEIGHT = 32;

    const ISO = {
        WIDTH: WIDTH / 2,
        HEIGHT: HEIGHT / 4,
    };

    return { WIDTH, HEIGHT, ISO };
})();