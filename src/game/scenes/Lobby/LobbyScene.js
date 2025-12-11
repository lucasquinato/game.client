import { SCENES } from "../../../mainConfigs.js";
import { Scene } from "../SceneModel.js";

export class Lobby extends Scene {
    constructor() { super(SCENES.NAME.LOBBY); }
}