import { TILE_SIZES } from "../mainConfigs.js";

export function gridToIso(gridX, gridY) {
    return {
        isoX: (gridX - gridY) * TILE_SIZES.ISO.WIDTH,
        isoY: (gridX + gridY) * TILE_SIZES.ISO.HEIGHT,
    };
}