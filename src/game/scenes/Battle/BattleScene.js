import { SCENES } from "../../../mainConfigs.js";
import { Scene } from "../SceneModel.js";

export class Battle extends Scene {
    constructor(sceneChanger) {
        super(SCENES.NAME.BATTLE);

        this.sceneChanger = (name) => {
            sceneChanger.scene_CHANGE(name);
        }
    }

    /**
     * @param { CanvasRenderingContext2D } context
     */
    render(context) {
        context.fillStyle = "blue";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
}