import { gridToIso } from "../../utils/isoMath.js";

export class Entity {
    constructor(x, y, map) {
        this.x = x, this.y = y;
        this.map = map;

        const iso = gridToIso(x, y);
        this.posX = iso.isoX;
        this.posY = iso.isoY;
        this.path = [];
        this.speed = 40;
    }

    moveToPath(path) {
        if (!path || path.length === 0) return;
        this.path = [...path];
    }

    update(deltaTime) { }

    render(context) { }
}
