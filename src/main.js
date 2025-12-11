import { GameScenes } from "./engine/core/GameScenes.js";
import { $Images } from "../assets/imagesManifest.js";
import { $Assets } from "./engine/AssetManager.js";

window.addEventListener("DOMContentLoaded",
    async function(e) {
        try {
            await $Assets.loadAll($Images);

            new GameScenes({ ready: true });

        } catch (error) {
            console.error("Erros em tempo de execução:");
            console.error(error);
        }
    }
);