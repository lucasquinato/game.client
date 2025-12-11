import { SCENES } from "../../mainConfigs.js";
import { GameLoop } from "./GameLoop.js";

import { Scene } from "../../game/scenes/SceneModel.js";
import { Lobby } from "../../game/scenes/Lobby/LobbyScene.js";
import { Battle } from "../../game/scenes/Battle/BattleScene.js";

export class GameScenes {
    /**
     * @type { Map<string, Scene> }
     */
    #scenes = new Map();
    /**
     * @type { Scene | null }
     */
    #sceneCurrent = null;

    constructor({ ready }) {
        this.scene_ADD();
        this.ready = ready;
        this.loop = new GameLoop(this);

        if (this.ready && this.#sceneCurrent) {
            this.loop.loop_START();
        }
    }

    scene_ADD() {
        this.scene_REGISTER(new Lobby(this));
        this.scene_REGISTER(new Battle(this));

        console.log("As cenas registradas foram adicionadas ao Game.");
        if (!this.#sceneCurrent) {
            const getDefaultScene = this.#scenes.get(SCENES.NAME.DEFAULT);
            if (!getDefaultScene) throw new Error("Cena padrão não registrada.");
            this.#sceneCurrent = getDefaultScene;
            this.#sceneCurrent.init();
        }
    }
    /**
     * @param { Scene } scene
     */
    scene_REGISTER(scene) {
        const getScene = this.#scenes.get(scene.name);
        if (getScene) throw new Error(`Cena: ${scene.name} já registrada.`);

        this.#scenes.set(scene.name, scene);
        console.log(`Cena: ${scene.name} foi registrada.`);
    }
    /**
     * @param { string } name
     */
    scene_CHANGE(name) {
        const getScene = this.#scenes.get(name);
        if (!getScene) throw new Error(`Cena: ${name} não encontrada`);

        this.#sceneCurrent.exit();

        this.#sceneCurrent = getScene;
        this.#sceneCurrent.init();
    }
    /**
     * @param { number } deltaTime
     */
    scene_UPDATE(deltaTime) {
        if (!this.#sceneCurrent) return;
        this.#sceneCurrent.update(deltaTime);
    }
    /**
     * @param { CanvasRenderingContext2D } context
     */
    scene_RENDER(context) {
        if (!this.#sceneCurrent) return;
        this.#sceneCurrent.render(context);
    }
}