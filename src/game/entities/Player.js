import { gridToIso } from "../../utils/isoMath.js";
import { $Assets } from "../../engine/AssetManager.js";
import { Entity } from "./Entity.js";

export class Player extends Entity {
    constructor(x = 2, y = 2, map = null) {
        super(x, y, map);

        this.animations = {
            idle_ld: 1001,
            idle_lu: 1002,
            idle_rd: 1003,
            idle_ru: 1004,
            walk_ld: 1005,
            walk_lu: 1006,
            walk_rd: 1007,
            walk_ru: 1008,
        };

        this.currentAnimation = "idle_ld";
        this._setAnimation(this.currentAnimation);

        this.currentFrame = 0;
        this.accumulator = 0;
        this.frameSpeed = 0.20;
        this.path = [];
        this.speed = 40;
    }

    setAnimation(name) {
        if (this.currentAnimation === name) return;
        this.currentAnimation = name;
        this._setAnimation(name);
    }

    _setAnimation(name) {
        const spriteId = this.animations[name];
        this.image = $Assets.get(spriteId);

        const meta = $Assets.getMeta(spriteId);
        this.frames = meta.frames;
        this.frameWidth = meta.frameWidth;
        this.frameHeight = meta.frameHeight;
        this.anchor = meta.anchor;

        this.currentFrame = 0;
        this.accumulator = 0;
    }

    moveToPath(path) {
        if (!path || path.length === 0) return;
        super.moveToPath(path);
        this._updateWalkAnimation();
    }

    _updateWalkAnimation() {
        if (this.path.length === 0) return;

        const next = this.path[0];

        if (next.x > this.x) this.setAnimation("walk_rd");
        else if (next.x < this.x) this.setAnimation("walk_lu");
        else if (next.y > this.y) this.setAnimation("walk_ld");
        else if (next.y < this.y) this.setAnimation("walk_ru");
    }

    update(deltaTime) {
        this.accumulator += deltaTime;
        if (this.accumulator >= this.frameSpeed) {
            this.accumulator -= this.frameSpeed;
            this.currentFrame = (this.currentFrame + 1) % this.frames;
        }

        if (this.path.length > 0) {
            const nextTile = this.path[0];
            const isoTarget = gridToIso(nextTile.x, nextTile.y);

            const dx = isoTarget.isoX - this.posX;
            const dy = isoTarget.isoY - this.posY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 1) {
                this.posX = isoTarget.isoX;
                this.posY = isoTarget.isoY;
                this.x = nextTile.x;
                this.y = nextTile.y;
                this.path.shift();

                if (this.path.length === 0) {
                    switch (this.currentAnimation) {
                        case "walk_ld": this.setAnimation("idle_ld"); break;
                        case "walk_lu": this.setAnimation("idle_lu"); break;
                        case "walk_rd": this.setAnimation("idle_rd"); break;
                        case "walk_ru": this.setAnimation("idle_ru"); break;
                    }

                    if (this.map?.mapInterations) {
                        this.map.mapInterations.selectedTile = null;
                    }
                } else {
                    this._updateWalkAnimation();
                }
            } else {
                const moveX = (dx / dist) * this.speed * deltaTime;
                const moveY = (dy / dist) * this.speed * deltaTime;
                this.posX += moveX;
                this.posY += moveY;
            }
        }
    }

    render(context) {
        const offset = this.map.getOffsets(context);

        const drawX = this.posX + offset.x;
        const drawY = this.posY + offset.y;

        context.drawImage(
            this.image,
            this.currentFrame * this.frameWidth, 0,
            this.frameWidth, this.frameHeight,
            drawX - this.anchor.x, drawY - this.anchor.y,
            this.frameWidth, this.frameHeight
        );
    }
}
