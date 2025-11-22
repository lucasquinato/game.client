import { $InputManager } from "./InputManagerSingleton.js";
import { SceneModel } from "../scenes/SceneModel.js";
import { LobbyScene } from "../scenes/LobbyScene.js";

class SceneManagerSingleton {
    /**
     * @type { SceneManagerSingleton | null }
     */
    static instance = null;
    /**
     * @returns SceneManagerSingleton
     */
    static getUniqueInstance() {
        if (SceneManagerSingleton.instance) return SceneManagerSingleton.instance;
        return SceneManagerSingleton.instance = new SceneManagerSingleton();
    }

    /**
     * @type { Map<string, SceneModel> }
     */
    #scenes = new Map();
    /**
     * @type { SceneModel }
     */
    #sceneActual;

    constructor() {
        $InputManager();

        this.#sceneRegister(new LobbyScene());
        this.#sceneActual = this.#scenes.get();
        this.#sceneActual.init();
    }

    /**
     * @param { SceneModel } newScene
     */
    #sceneRegister(newScene) {
        this.#scenes.set(newScene.name, newScene);
    }

    /**
     * @param { number } deltaTime
     */
    sceneUpdate(deltaTime) {
        if (!this.#sceneActual) return;
        this.#sceneActual.update(deltaTime);
    }

    /**
     * @param { CanvasRenderingContext2D } context
     */
    sceneRender(context) {
        if (!this.#sceneActual) return;
        this.#sceneActual.render(context);
    }

    /**
     * @param { string } nextSceneName
     */
    sceneChanger(nextSceneName) {
        const next = this.#scenes.get(nextSceneName);
        if (!next) throw new Error("Próxima cena não encontrada.");
        if (this.#sceneActual) this.#sceneActual.exit();

        this.#sceneActual = next;
        this.#sceneActual.init();
    }

    getCurrentScene() { return this.#sceneActual; }
}

export function $SceneManager() {
    return SceneManagerSingleton.getUniqueInstance();
}