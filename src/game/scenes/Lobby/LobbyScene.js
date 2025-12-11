import { SCENES } from "../../../mainConfigs.js";
import { Scene } from "../SceneModel.js";

export class Lobby extends Scene {
    constructor(sceneChanger) {
        super(SCENES.NAME.LOBBY);

        this.sceneChanger = (name) => {
            sceneChanger.scene_CHANGE(name);
        };
    }
}