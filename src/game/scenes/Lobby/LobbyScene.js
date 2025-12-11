import { IsoMap } from "../../renderer/IsoMap.js";
import { SCENES } from "../../../mainConfigs.js";
import { LOBBY_MAP } from "./data/LobbyMap.js";
import { Scene } from "../SceneModel.js";

export class Lobby extends Scene {
    constructor(sceneChanger) {
        super(SCENES.NAME.LOBBY);

        this.sceneChanger = (name) => {
            sceneChanger.scene_CHANGE(name);
        };

        this.mapRender = new IsoMap(LOBBY_MAP);
    }

    /**
     * @param { CanvasRenderingContext2D } context
     */
    render(context) {
        this.mapRender.draw(context);
    }
}