import { $Assets } from "../../engine/AssetManager.js";
import { TILE_SIZES } from "../../mainConfigs.js";
import { gridToIso } from "../../utils/isoMath.js";

import { IsoMapInput } from "./IsoMapInput.js";

export class IsoMap {
    /**
     * @param {{ width: number, height: number, layers: {} }} mapData 
     */
    constructor(mapData, player = null) {
        this.width = mapData.width;
        this.height = mapData.height;
        this.layers = mapData.layers;

        this.player = player;
        this.player.map = this;
        this.mapInterations = new IsoMapInput(this);
    }
    /**
     * @param { CanvasRenderingContext2D } context
     */
    getOffsets(context) {
        const minIsoX = (0 - (this.height - 1)) * TILE_SIZES.ISO.WIDTH;
        const maxIsoX = ((this.width - 1) - 0) * TILE_SIZES.ISO.WIDTH;
        const offsetX = (context.canvas.width / 2) - (minIsoX + maxIsoX) / 2;

        const minIsoY = 0;
        const maxIsoY = ((this.width - 1) + (this.height - 1)) * TILE_SIZES.ISO.HEIGHT;
        const offsetY = (context.canvas.height / 2) - (minIsoY + maxIsoY) / 2;

        return { x: offsetX, y: offsetY };
    }
    /**
     * @param { number } gridX
     * @param { number } gridY
     * @param { CanvasRenderingContext2D } context
     */
    getTilePosition(gridX, gridY, context) {
        const offset = this.getOffsets(context);
        const { isoX, isoY } = gridToIso(gridX, gridY);
        return {
            x: isoX + offset.x - TILE_SIZES.ISO.WIDTH,
            y: isoY + offset.y
        };
    }
    /**
     * @param { CanvasRenderingContext2D } context
     */
    drawMap(context) {
        const offset = this.getOffsets(context);

        for (const layerName in this.layers) {
            const layer = this.layers[layerName];
            for (let y = 0; y < this.height; y++) {
                const row = layer[y];
                if (!row) continue;

                for (let x = 0; x < this.width; x++) {
                    const tileID = row[x];
                    if (!tileID) continue;

                    const tile = $Assets.get(tileID);
                    if (!tile) continue;

                    const { isoX, isoY } = gridToIso(x, y);
                    const drawX = isoX + offset.x - TILE_SIZES.ISO.WIDTH;
                    const drawY = isoY + offset.y - TILE_SIZES.ISO.WIDTH;

                    const drawCorrection = layerName === "ground" ? 8 : 0;
                    context.drawImage(tile, drawX, drawY + drawCorrection);
                }
            }
        }

        this.mapInterations.drawHover(context);
        this.mapInterations.drawSelection(context);

        // context.fillStyle = "red";
        // context.fillRect(context.canvas.width / 2 -2, context.canvas.height / 2 -2, 4, 4);
    }
}
