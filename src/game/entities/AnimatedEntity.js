import { Entity } from "./Entity.js";
import { gridToIso } from "../../utils/isoMath.js";
import { resolveDirection } from "../../utils/animationHelpers.js";
import { $Assets } from "../../engine/AssetManager.js";

export class AnimatedEntity extends Entity {
    constructor(x, y, map) {
        super(x, y, map);

        this.animations = {};          // Player e Critter irão preencher
        this.currentAnimation = null;
        
        this.image = null;
        this.frames = 1;
        this.frameWidth = 0;
        this.frameHeight = 0;
        this.anchor = { x: 0, y: 0 };   

        this.currentFrame = 0;
        this.accumulator = 0;
        this.frameSpeed = 0.20;

        this.path = [];
        this.speed = 40;
    }

    setAnimation(name) {
        if (this.currentAnimation === name) return;
        this.currentAnimation = name;

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
        this.path = [...path];
        this._updateWalkAnimation();
    }

    _updateWalkAnimation() {
        if (this.path.length === 0) return;

        const next = this.path[0];
        const dir = resolveDirection({ x: this.x, y: this.y }, next);

        this.setAnimation("walk_" + dir);
    }

    _updateAnimation(deltaTime) {
        this.accumulator += deltaTime;
        if (this.accumulator >= this.frameSpeed) {
            this.accumulator -= this.frameSpeed;
            this.currentFrame = (this.currentFrame + 1) % this.frames;
        }
    }

    _updateMovement(deltaTime) {
        if (this.path.length === 0) return;

        const nextTile = this.path[0];
        const isoTarget = gridToIso(nextTile.x, nextTile.y);

        const dx = isoTarget.isoX - this.posX;
        const dy = isoTarget.isoY - this.posY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 1) {
            // Chegou no tile
            this.posX = isoTarget.isoX;
            this.posY = isoTarget.isoY;
            this.x = nextTile.x;
            this.y = nextTile.y;

            this.path.shift();

            if (this.path.length === 0) {
                // Voltar ao idle correspondente
                const dir = this.currentAnimation.split("_")[1];
                this.setAnimation("idle_" + dir);
            } else {
                this._updateWalkAnimation();
            }

            return;
        }

        // Movimentação suave
        this.posX += (dx / dist) * this.speed * deltaTime;
        this.posY += (dy / dist) * this.speed * deltaTime;
    }

    update(deltaTime) {
        this._updateAnimation(deltaTime);
        this._updateMovement(deltaTime);
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
