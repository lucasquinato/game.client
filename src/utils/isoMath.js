import { TILE_SIZES } from "../mainConfigs.js";

export function gridToIso(gridX, gridY) {
    return {
        isoX: (gridX - gridY) * TILE_SIZES.ISO.WIDTH,
        isoY: (gridX + gridY) * TILE_SIZES.ISO.HEIGHT,
    };
}

export function isoToGrid(isoX, isoY) {
    return {
        gridX: Math.floor(
            (isoY / TILE_SIZES.ISO.HEIGHT + isoX / TILE_SIZES.ISO.WIDTH) / 2),
        gridY: Math.floor(
            (isoY / TILE_SIZES.ISO.HEIGHT - isoX / TILE_SIZES.ISO.WIDTH) / 2),
    };
}