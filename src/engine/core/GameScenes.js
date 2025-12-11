import { GameLoop } from "./GameLoop.js";

export class GameScenes {
    #scenes = new Map();
    #sceneCurrent = null;

    constructor({ ready }) {
        this.scene_ADD();
        this.ready = ready;
        this.loop = new GameLoop(this);

        if (this.ready && this.#sceneCurrent) {
            this.loop.loop_START();
        }
    }

    scene_REGISTER(scene) {
        const getScene = this.#scenes.get(scene.name);
        if (getScene) throw new Error(`Cena: ${scene.name} já registrada.`);

        this.#scenes.set(scene.name, scene);
    }

    scene_ADD() {
        // this.scene_REGISTER(new Lobby());
        // this.scene_REGISTER(new Battle());

        // if (!this.#sceneCurrent) {
        //     const getDefaultScene = this.#scenes.get("Lobby");
        //     this.#sceneCurrent = getDefaultScene;
        //     this.#sceneCurrent.init();
        // }
    }

    scene_CHANGE(name) {
        const getScene = this.#scenes.get(name);
        if (!getScene) throw new Error(`Cena: ${name} não encontrada`);

        this.#sceneCurrent.exit();

        this.#sceneCurrent = getScene;
        this.#sceneCurrent.init();
    }

    scene_UPDATE(deltaTime) {
        if (!this.#sceneCurrent) return;
        this.#sceneCurrent.update(deltaTime);
    }

    scene_RENDER(context) {
        if (!this.#sceneCurrent) return;
        this.#sceneCurrent.render(context);
    }
}