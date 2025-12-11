import { $Assets } from "../../engine/AssetManager.js";
import { $Canvas } from "../../engine/Canvas.js";
import { isoToGrid } from "../../utils/isoMath.js";
import { TILE_SIZES } from "../../mainConfigs.js";

export class IsoMapInput {
    constructor(isoMap) {
        this.map = isoMap;
        this.hoverTile = null;
        this.selectedTile = null;

        const canvas = $Canvas().context.canvas;
        canvas.addEventListener("mousemove", this.#onMouseMove.bind(this));
        canvas.addEventListener("click", this.#onClick.bind(this));
    }
    /**
     * @param { number } mouseX
     * @param { number } mouseY
     * @param { CanvasRenderingContext2D } context
     */
    #screenToGrid(mouseX, mouseY, context) {
        const offset = this.map.getOffsets(context);
        const relX = mouseX - offset.x;
        const relY = mouseY - offset.y;

        const { gridX: x, gridY: y } = isoToGrid(relX, relY);
        if (x < 0 || x >= this.map.width || y < 0 || y >= this.map.height) return null;
        return { x, y };
    }
    /**
     * @param { MouseEvent } event
     */
    #onMouseMove(event) {
        const { mouseX, mouseY } = $Canvas().getMousePosition(event);
        this.hoverTile = this.#screenToGrid(mouseX, mouseY, $Canvas().context);
    }
    /**
     * @param { MouseEvent } event
     */
    #onClick(event) {
        const { mouseX, mouseY } = $Canvas().getMousePosition(event);
        const tile = this.#screenToGrid(mouseX, mouseY, $Canvas().context);
        if (!tile || !this.#isTileWalkable(tile.x, tile.y)) return;

        this.selectedTile = tile;
        console.log("Tile selecionado:", tile);
    }
    /**
     * @param { CanvasRenderingContext2D } context
     */
    drawHover(context) {
        if (!this.hoverTile) return;

        const { x, y } = this.hoverTile;
        const pos = this.map.getTilePosition(x, y, context);
        const color = this.#isTileWalkable(x, y) ? "rgba(80, 25, 198, 0.3)" : "rgba(192, 21, 21, 0.5)";

        const drawX = pos.x;
        const drawY = pos.y;

        context.fillStyle = color;
        context.beginPath();
        context.moveTo(drawX + TILE_SIZES.ISO.WIDTH, drawY);
        context.lineTo(drawX + TILE_SIZES.ISO.WIDTH * 2, drawY + TILE_SIZES.ISO.HEIGHT);
        context.lineTo(drawX + TILE_SIZES.ISO.WIDTH, drawY + TILE_SIZES.ISO.HEIGHT * 2);
        context.lineTo(drawX, drawY + TILE_SIZES.ISO.HEIGHT);
        context.closePath();
        context.fill();
    }
    /**
     * @param { CanvasRenderingContext2D } context
     */
    drawSelection(context) {
        if (!this.selectedTile) return;

        const { x, y } = this.selectedTile;
        const pos = this.map.getTilePosition(x, y, context);

        const drawX = pos.x;
        const drawY = pos.y;

        context.strokeStyle = "yellow";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(drawX + TILE_SIZES.ISO.WIDTH, drawY);
        context.lineTo(drawX + TILE_SIZES.ISO.WIDTH * 2, drawY + TILE_SIZES.ISO.HEIGHT);
        context.lineTo(drawX + TILE_SIZES.ISO.WIDTH, drawY + TILE_SIZES.ISO.HEIGHT * 2);
        context.lineTo(drawX, drawY + TILE_SIZES.ISO.HEIGHT);
        context.closePath();
        context.stroke();
    }
    /**
     * @param { number } x
     * @param { number } y
     */
    #isTileWalkable(x, y) {
        const groundLayer = this.map.layers.ground;
        const decoLayer = this.map.layers.decorations;

        const groundTileID = groundLayer[y]?.[x];
        const decoTileID = decoLayer[y]?.[x];

        const meta = groundTileID ? $Assets.getMeta(groundTileID) : null;

        return meta?.walkable && !decoTileID;
    }
}
