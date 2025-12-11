import { $Assets } from "../../engine/AssetManager.js";
import { gridToIso } from "../../utils/isoMath.js";
import { TILE_SIZES } from "../../mainConfigs.js";

export class IsoMap {
    constructor(MapData) {
        this.width = MapData.width;
        this.height = MapData.height;
        this.layers = MapData.layers;
    }

    /**
     * @param { CanvasRenderingContext2D } context
     */
    draw(context) {
        const minIsoX = (0 - (this.height - 1)) * TILE_SIZES.ISO.WIDTH;
        const maxIsoX = ((this.width - 1) - 0) * TILE_SIZES.ISO.WIDTH;
        const centerOffsetX = (context.canvas.width / 2) - (minIsoX + maxIsoX) / 2;

        const minIsoY = (0 + 0) * TILE_SIZES.ISO.HEIGHT;
        const maxIsoY = ((this.width - 1) + (this.height - 1)) * TILE_SIZES.ISO.HEIGHT;
        const centerOffsetY = (context.canvas.height / 2) - (minIsoY + maxIsoY) / 2;

        for (const layerName in this.layers) {
            const layerCurrent = this.layers[layerName];

            for (let y = 0; y < this.height; y++) {
                const row = layerCurrent[y];
                if (!row) continue;

                for (let x = 0; x < this.width; x++) {
                    const tileID = row[x];
                    if (tileID === 0 || tileID === undefined) continue;

                    const tile = $Assets.get(tileID);
                    if (!tile) continue;

                    const { isoX, isoY } = gridToIso(x, y);

                    const drawX = isoX + centerOffsetX - TILE_SIZES.ISO.WIDTH;
                    const drawY = isoY + centerOffsetY - TILE_SIZES.HEIGHT / 2;

                    const drawCorrection = (layerName === "ground") ? 8 : 0;
                    context.drawImage(tile, drawX, drawY + drawCorrection);
                }
            }
        }

        context.fillStyle = "red";
        context.fillRect(context.canvas.width / 2 - 4, context.canvas.height / 2 - 4, 8, 8);
    }
}
