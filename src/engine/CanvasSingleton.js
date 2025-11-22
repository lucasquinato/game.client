class CanvasSingleton {
    /**
     * @type { CanvasSingleton | null }
     */
    static instance = null;
    /**
     * @param { string } canvasID
     * @returns CanvasSingleton
     */
    static getUniqueInstance(canvasID) {
        if (CanvasSingleton.instance) return CanvasSingleton.instance;
        return CanvasSingleton.instance = new CanvasSingleton(canvasID);
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
     * @type { number | null }
     */
    #width = null;
    /**
     * @type { number | null }
     */
    #height = null;
    /**
     * @param { string } canvasID
     */
    constructor(canvasID) {
        if (!canvasID || typeof canvasID != "string") {
            throw new Error("Declare o canvas ID correto.");
        }

        this.#canvas = document.getElementById(canvasID);
        if (!(this.#canvas instanceof HTMLCanvasElement)) {
            throw new Error("Elemento canvas não obtido corretamente.");
        }
        
        this.#context = this.#canvas.getContext("2d");
        if (!(this.#context instanceof CanvasRenderingContext2D)) {
            throw new Error("Não foi possível definir o contexto como 2D.");
        }

        this.#width = 700;
        this.#height = 400;
        this.#canvas.width = this.#width;
        this.#canvas.height = this.#height;
    }

    getCanvasData() {
        const self = this;

        return Object.freeze({
            canvas: self.#canvas,
            context: self.#context,
            get sizes() {

                return Object.freeze({
                    height: self.#height,
                    width: self.#width,
                });
            },
        });
    }
}

export function $Canvas(canvasID = "game-client") {
    return CanvasSingleton.getUniqueInstance(canvasID);
}