import { imageLoader } from "./assets/imageLoader.js";
import { $$Images } from "./assets/images.js";

window.addEventListener("DOMContentLoaded", async e => {
    try {
        // Carregar assets:
        await imageLoader($$Images);
    // Erros em tempo de execução:
    } catch (e) { console.error(e); }
});