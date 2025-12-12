import { AnimatedEntity } from "../AnimatedEntity.js";

export class Hana extends AnimatedEntity {
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

        this.speed = 40;
        this.setAnimation("idle_ld");
    }
}
