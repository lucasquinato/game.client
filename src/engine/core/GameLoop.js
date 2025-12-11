import { $Canvas } from "../Canvas.js";

export class GameLoop {
    #context = $Canvas().context;
    /**
     * @type { number | null }
     */
    #lastTimestamp = null;
    /**
     * @type { number }
     */
    #deltaTime = 0;
    /**
     * @type { boolean }
     */
    #running = false;

    constructor(gameScene) { this.gameScene = gameScene; }

    /**
     * @param { number } timestamp
     */
    #loop(timestamp) {
        if (!this.#running) return;
        if (!this.#lastTimestamp) this.#lastTimestamp = performance.now();
        this.#deltaTime = (timestamp - this.#lastTimestamp) / 1000;
        this.#lastTimestamp = timestamp;

        this.#processSceneUpdate(this.#deltaTime);
        this.#processSceneRenderer(this.#context);

        requestAnimationFrame(this.#loop.bind(this));
    }
    /**
     * @param { number } deltaTime
     */
    #processSceneUpdate(deltaTime) {
        // console.log(deltaTime);

        this.gameScene.scene_UPDATE(deltaTime);
    }
    /**
     * @param { CanvasRenderingContext2D } context
     */
    #processSceneRenderer(context) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        this.gameScene.scene_RENDER(context);
    }

    loop_START() {
        if (!this.#running) {
            this.#running = true;
            this.#lastTimestamp = null;

            requestAnimationFrame(this.#loop.bind(this));
        }
    }

    loop_PAUSE() { this.#running = false; }
}