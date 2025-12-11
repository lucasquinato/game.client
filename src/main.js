import { GameScenes } from "./engine/core/GameScenes.js";
import { SCENES } from "./mainConfigs.js";

window.addEventListener("DOMContentLoaded",
    async function(e) {
        try {
            const TESTECHANGE = new GameScenes({ ready: true });

            TESTECHANGE.scene_CHANGE(SCENES.NAME.BATTLE);
        } catch (error) {
            console.error("Erros em tempo de execução:");
            console.error(error);
        }
    }
);