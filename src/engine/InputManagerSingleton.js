import { $SceneManager } from "./SceneManagerSingleton.js";
import { $Canvas } from "./CanvasSingleton.js";

class InputManagerSingleton {
    /**
     * @type { InputManagerSingleton | null }
     */
    static instance = null;
    /**
     * @returns InputManagerSingleton
     */
    static getUniqueInstance() {
        if (InputManagerSingleton.instance) return InputManagerSingleton.instance;
        return InputManagerSingleton.instance = new InputManagerSingleton();
    }

    /**
     * @type { Set<string> }
     */
    #pressedKeys = new Set();
    /**
     * @type {{ x: number, y: number, isDown: boolean }}
     */
    #mouse = { x: 0, y: 0, isDown: false };

    constructor() { this.#registerDOMEvents(); }

    #registerDOMEvents() {
        const canvas = $Canvas().getCanvasData().canvas;
        const rect = canvas.getBoundingClientRect();

        canvas.addEventListener("mousemove", e => {
            this.#mouse.x = e.clientX - rect.left;
            this.#mouse.y = e.clientY - rect.top;

            const scene = $SceneManager().getCurrentScene();
            if (scene?.onHover) scene.onHover(this.#mouse);
        });

        canvas.addEventListener("mousedown", e => {
            this.#mouse.isDown = true;

            const scene = $SceneManager().getCurrentScene();
            if (scene?.onClick) {
                scene.onClick({
                    ...this.#mouse,
                    button: e.button
                });
            }
        });

        canvas.addEventListener("mouseup", e => { this.#mouse.isDown = false; });
    }

    getMouse() { return this.#mouse; }
}

export function $InputManager() {
    return InputManagerSingleton.getUniqueInstance();
}