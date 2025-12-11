import { IsoMap } from "../../renderer/IsoMap.js";
import { SCENES } from "../../../mainConfigs.js";
import { LOBBY_MAP } from "./data/LobbyMap.js";
import { Scene } from "../SceneModel.js";

import { Player } from "../../entities/Player.js";
import { Critter } from "../../entities/Critter.js";

export class Lobby extends Scene {
    constructor(sceneChanger) {
        super(SCENES.NAME.LOBBY);

        this.player = new Player(2, 2);
        this.mapRender = new IsoMap(LOBBY_MAP, this.player);

        this.critter = new Critter(4, 4, this.mapRender);

        this.sceneChanger = (name) => sceneChanger.scene_CHANGE(name);
    }

    /**
     * @param { number } deltaTime
     */
    update(deltaTime) {
        this.player.update(deltaTime);
        this.critter.update(deltaTime);
    }
    /**
     * @param { CanvasRenderingContext2D } context
     */
    render(context) {
        this.mapRender.drawMap(context);

        this.player.render(context);
        this.critter.render(context);
    }
}