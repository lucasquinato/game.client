import { imageLoader } from "./assets/imageLoader.js";
import { $$Images } from "./assets/images.js";

import { $GameLoop } from "./engine/GameLoopSingleton.js";

window.addEventListener("DOMContentLoaded", async e => {
    try {
        // Carregar assets:
        await imageLoader($$Images);
        $GameLoop().startGame();
    // Erros em tempo de execução:
    } catch (e) { console.error(e); }
});