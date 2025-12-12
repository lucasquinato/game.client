import { AnimatedEntity } from "../AnimatedEntity.js";

export class Critter extends AnimatedEntity {
    constructor(x = 4, y = 4, map = null) {
        super(x, y, map);

        this.animations = {
            idle_ld: 2001,
            idle_lu: 2002,
            idle_rd: 2003,
            idle_ru: 2004,
            walk_ld: 2005,
            walk_lu: 2006,
            walk_rd: 2007,
            walk_ru: 2008,
        };

        this.speed = 35;
        this.setAnimation("idle_ld");
    }
}
