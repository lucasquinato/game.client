import { $Assets } from "../../engine/AssetManager.js";
import { $Canvas } from "../../engine/Canvas.js";
import { isoToGrid } from "../../utils/isoMath.js";
import { TILE_SIZES } from "../../mainConfigs.js";

export class IsoMapInput {
    constructor(isoMap) {
        this.map = isoMap;
        this.hoverTile = null;
        this.selectedTile = null;
        this.pathToHover = [];

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
    #onClick(event) {
        const { mouseX, mouseY } = $Canvas().getMousePosition(event);
        const tile = this.#screenToGrid(mouseX, mouseY, $Canvas().context);
        if (!tile || this.map.player.path.length > 0) return;

        this.selectedTile = tile;
        console.log("Tile selecionado:", tile);

        const dx = Math.abs(tile.x - this.map.player.x);
        const dy = Math.abs(tile.y - this.map.player.y);
        if ((dx <= 2 && dy <= 2) && this.#isTileWalkable(tile.x, tile.y)) {
            this.map.player.moveToPath(this.#calculatePath(tile.x, tile.y));
        }
    }
    /**
     * @param { MouseEvent } event
     */
    #onMouseMove(event) {
        const { mouseX, mouseY } = $Canvas().getMousePosition(event);
        const hovered = this.#screenToGrid(mouseX, mouseY, $Canvas().context);

        if (!hovered) {
            this.hoverTile = null;
            this.pathToHover = [];
            return;
        }

        this.hoverTile = hovered;

        if (this.map.player) {
            const player = this.map.player;
            const dx = Math.abs(hovered.x - player.x);
            const dy = Math.abs(hovered.y - player.y);

            if (dx > 2 || dy > 2 || !this.#isTileWalkable(hovered.x, hovered.y)) {
                this.pathToHover = [];
            } else {
                this.pathToHover = this.#calculatePath(hovered.x, hovered.y);
            }
        } else {
            this.pathToHover = [];
        }
    }
    /**
     * Calcula o path até o destino limitado ao quadrado 5x5
     */
    #calculatePath(destX, destY) {
        const player = this.map.player;
        if (!player) return [];

        const start = { x: player.x, y: player.y };
        const maxDistance = 2;

        if (Math.abs(destX - start.x) > maxDistance || Math.abs(destY - start.y) > maxDistance) {
            return [];
        }

        const queue = [{ x: start.x, y: start.y, path: [{ x: start.x, y: start.y }] }];
        const visited = new Set([`${start.x},${start.y}`]);
        let bestPath = [];

        while (queue.length > 0) {
            const current = queue.shift();
            const { x, y, path } = current;

            if (Math.abs(x - start.x) > maxDistance || Math.abs(y - start.y) > maxDistance) continue;
            if (x === destX && y === destY) return path;
            if (path.length > bestPath.length) bestPath = path;

            const neighbors = [
                { x: x+1, y },
                { x: x-1, y },
                { x, y: y+1 },
                { x, y: y-1 }
            ];

            for (const n of neighbors) {
                if (n.x < 0 || n.y < 0 || n.x >= this.map.width || n.y >= this.map.height) continue;
                if (!this.#isTileWalkable(n.x, n.y)) continue;
                const key = `${n.x},${n.y}`;
                if (visited.has(key)) continue;

                visited.add(key);
                queue.push({ x: n.x, y: n.y, path: [...path, { x: n.x, y: n.y }] });
            }
        }

        return bestPath;
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
    /**
     * Desenha path e hover
     */
    drawHover(context) {
        if (!this.hoverTile) return;

        // Desenha path
        for (const tile of this.pathToHover ?? []) {
            const pos = this.map.getTilePosition(tile.x, tile.y, context);
            context.fillStyle = "rgba(85, 14, 236, 0.64)";
            context.beginPath();
            context.moveTo(pos.x + TILE_SIZES.ISO.WIDTH, pos.y);
            context.lineTo(pos.x + TILE_SIZES.ISO.WIDTH * 2, pos.y + TILE_SIZES.ISO.HEIGHT);
            context.lineTo(pos.x + TILE_SIZES.ISO.WIDTH, pos.y + TILE_SIZES.ISO.HEIGHT * 2);
            context.lineTo(pos.x, pos.y + TILE_SIZES.ISO.HEIGHT);
            context.closePath();
            context.fill();
        }

        // Hover visual
        const { x, y } = this.hoverTile;
        const pos = this.map.getTilePosition(x, y, context);

        // Tile fora do alcance
        const player = this.map.player;
        const outOfRange = Math.abs(x - player.x) > 2 || Math.abs(y - player.y) > 2;

        const color = outOfRange
            ? "rgba(239, 24, 24, 0.74)" // vermelho se fora do alcance
            : this.#isTileWalkable(x, y)
                ? "rgba(85, 14, 236, 0.64)" // azul normal
                : "rgba(239, 24, 24, 0.74)"; // vermelho se não walkable

        context.fillStyle = color;
        context.beginPath();
        context.moveTo(pos.x + TILE_SIZES.ISO.WIDTH, pos.y);
        context.lineTo(pos.x + TILE_SIZES.ISO.WIDTH * 2, pos.y + TILE_SIZES.ISO.HEIGHT);
        context.lineTo(pos.x + TILE_SIZES.ISO.WIDTH, pos.y + TILE_SIZES.ISO.HEIGHT * 2);
        context.lineTo(pos.x, pos.y + TILE_SIZES.ISO.HEIGHT);
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

        context.strokeStyle = "rgba(228, 232, 16, 0.87)";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(drawX + TILE_SIZES.ISO.WIDTH, drawY);
        context.lineTo(drawX + TILE_SIZES.ISO.WIDTH * 2, drawY + TILE_SIZES.ISO.HEIGHT);
        context.lineTo(drawX + TILE_SIZES.ISO.WIDTH, drawY + TILE_SIZES.ISO.HEIGHT * 2);
        context.lineTo(drawX, drawY + TILE_SIZES.ISO.HEIGHT);
        context.closePath();
        context.stroke();
    }
}
