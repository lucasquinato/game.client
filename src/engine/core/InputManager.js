import { $Canvas } from "../Canvas.js";

export class InputManager {
    #canvas = $Canvas().context.canvas;
    #canvasMousePosition = (event) => {
        return $Canvas().getMousePosition(event);
    }

    /**
     * @type { boolean }
     */
    #isPointerDown = false;
    /**
     * @type {{ x: number, y: number }}
     */
    #lastPointerPos = { x: 0, y: 0 };

    constructor(gameScenes) {
        this.gameScenes = gameScenes;
        this.#input_REGISTER();
    }

    #input_REGISTER() {
        this.#canvas.addEventListener("pointerdown", this.#handler_POINTERDOWN);
        this.#canvas.addEventListener("pointermove", this.#handler_POINTERMOVE);
        this.#canvas.addEventListener("pointerup", this.#handler_POINTERUP);
        this.#canvas.addEventListener("click", this.#handler_CLICK);
    }

    input_DESTROY() {
        this.#canvas.removeEventListener("pointerdown", this.#handler_POINTERDOWN);
        this.#canvas.removeEventListener("pointermove", this.#handler_POINTERMOVE);
        this.#canvas.removeEventListener("pointerup", this.#handler_POINTERUP);
        this.#canvas.removeEventListener("click", this.#handler_CLICK);
    }

    /**
     * @param { MouseEvent } inputEvent
     */
    #input_SEND(inputEvent) {
        if (!this.gameScenes || typeof this.gameScenes.event_INPUT !== "function") return;
        this.gameScenes.event_INPUT(inputEvent);
    }
    /**
     * @param { MouseEvent } event
     */
    #on_POINTERDOWN(event) {
        this.#isPointerDown = true;
        const pos = this.#canvasMousePosition(event)
        this.#lastPointerPos = { x: pos.mouseX, y: pos.mouseY };

        this.#input_SEND({
            type: "pointerdown",
            x: pos.mouseX,
            y: pos.mouseY,
            raw: event
        });
    }
    /**
     * @param { MouseEvent } event
     */
    #on_POINTERMOVE(event) {
        const pos = this.#canvasMousePosition(event);
        this.#lastPointerPos = { x: pos.mouseX, y: pos.mouseY };

        this.#input_SEND({
            type: "pointermove",
            x: pos.mouseX,
            y: pos.mouseY,
            raw: event
        });
    }
    /**
     * @param { MouseEvent } event
     */
    #on_POINTERUP(event) {
        const pos = this.#canvasMousePosition(event)
        this.#isPointerDown = false;
        this.#input_SEND({
            type: "pointerup",
            x: pos.mouseX,
            y: pos.mouseY,
            raw: event
        });
    }
    /**
     * @param { MouseEvent } event
     */
    #on_CLICK(event) {
        const pos = this.#canvasMousePosition(event)
        this.#input_SEND({
            type: "click",
            x: pos.mouseX,
            y: pos.mouseY,
            raw: event
        });
    }

    #handler_POINTERDOWN = (event) => this.#on_POINTERDOWN(event);
    #handler_POINTERMOVE = (event) => this.#on_POINTERMOVE(event);
    #handler_POINTERUP = (event) => this.#on_POINTERUP(event);
    #handler_CLICK = (event) => this.#on_CLICK(event);
}
