import { $Canvas } from "./CanvasSingleton.js";
import { $SceneManager } from "./SceneManagerSingleton.js";

class GameLoopSingleton {
    /**
     * @type { GameLoopSingleton | null }
     */
    static instance = null;
    /**
     * @returns GameLoopSingleton
     */    
    static getUniqueInstance() {
        if (GameLoopSingleton.instance) return GameLoopSingleton.instance;
        return GameLoopSingleton.instance = new GameLoopSingleton();
    }

    /**
     * @type { boolean }
     */
    #running = false;
    /**
     * @type { CanvasRenderingContext2D | null }
     */
    #context = null;
    /**
     * @type { number }
     */
    #deltaTime = 0;
    /**
     * @type { number }
     */
    #lastTimestamp = 0;
    #sceneManager;
    /**
     * @param { $Canvas().getCanvasData() } getCanvasData
     */
    constructor(getCanvasData = $Canvas().getCanvasData()) {
        this.#context = getCanvasData.context;
        this.#sceneManager = $SceneManager();
    }

    /**
     * @param { number } timestamp
     */
    #loop(timestamp) {
        if (!this.#running) return;

        this.#deltaTime = (timestamp - this.#lastTimestamp) / 1000;
        this.#lastTimestamp = timestamp;

        this.#processUpdate(this.#deltaTime);
        this.#processRender(this.#context);

        requestAnimationFrame(this.#loop.bind(this));
    }

    /**
     * @param { number } deltaTime
     */
    #processUpdate(deltaTime) {
        // console.log(deltaTime);
        this.#sceneManager.sceneUpdate(deltaTime);
    }

    /**
     * @param { CanvasRenderingContext2D } context
     */
    #processRender(context) {
        this.#sceneManager.sceneRender(context);
    }

    startGame() {
        if (this.#running) return;

        this.#running = true;
        this.#lastTimestamp = performance.now();

        requestAnimationFrame(this.#loop.bind(this));
    }

    stopGame() {
        this.#running = false;

        /** */
    }
}

export function $GameLoop() {
    return GameLoopSingleton.getUniqueInstance();
}