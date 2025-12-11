import { GameScenes } from "./engine/core/GameScenes.js";

window.addEventListener("DOMContentLoaded",
    async function(e) {
        try {
            new GameScenes({ ready: true });
        } catch (error) {
            console.error("Erros em tempo de execução:");
            console.error(error);
        }
    }
);