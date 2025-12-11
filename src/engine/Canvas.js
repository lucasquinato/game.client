import { CANVAS_RESOLUTION } from "../mainConfigs.js";

class CanvasSingleton {
    /**
     * @type { CanvasSingleton | null }
     */
    static #instance = null;
    /**
     * @type { symbol }
     */
    static #enforcer = Symbol("CanvasEnforcer");
    /**
     * @returns CanvasSingleton
     */
    static getInstance() {
        if (CanvasSingleton.#instance) return CanvasSingleton.#instance;
        return CanvasSingleton.#instance = new CanvasSingleton(this.#enforcer);
    }

    /**
     * @type { HTMLCanvasElement | null }
     */
    #canvas = null;
    /**
     * @type { CanvasRenderingContext2D | null }
     */
    #context = null;
    /**
     * @type { number }
     */
    #canvasWidth = CANVAS_RESOLUTION.WIDTH;
    /**
     * @type { number }
     */
    #canvasHeight = CANVAS_RESOLUTION.HEIGHT;
    /**
     * @type { number }
     */
    #canvasScale = 1;
    /**
     * @param { symbol } enforcer
     */
    constructor(enforcer) {
        if (!enforcer || typeof enforcer !== "symbol") {
            throw new Error("Obtenha a instância em: getInstance();");
        }

        this.#canvas = document.createElement("canvas");
        this.#canvas.width = this.#canvasWidth;
        this.#canvas.height = this.#canvasHeight;
        document.body.appendChild(this.#canvas);

        this.#context = this.#canvas.getContext("2d");

        this.#resizeHandler();
        this.#resize();
    }

    #resizeHandler() {
        window.addEventListener("resize",
            e => {
                this.#resize();
            }
        );
    }

    #resize() {
        const scaleX = window.innerWidth / this.#canvasWidth;
        const scaleY = window.innerHeight / this.#canvasHeight;

        this.#canvasScale = Math.min(scaleX, scaleY);

        this.#canvas.style.width = `${this.#canvasWidth * this.#canvasScale}px`;
        this.#canvas.style.height = `${this.#canvasHeight * this.#canvasScale}px`;
    }

    /**
     * @param { MouseEvent } event
     */
    getMousePosition(event) {
        const canvasBoundingClientRect = this.#canvas.getBoundingClientRect();

        const positionX = event.clientX - canvasBoundingClientRect.left;
        const positionY = event.clientY - canvasBoundingClientRect.top;

        return {
            mouseX: positionX / this.#canvasScale,
            mouseY: positionY / this.#canvasScale,
        };
    }

    get context() { return this.#context; }

    get scale() { return this.#canvasScale; }
}

export function $Canvas() {
    return CanvasSingleton.getInstance();
}