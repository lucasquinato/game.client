export class SceneModel {
    constructor(name) { this.name = name; }

    init() { console.log("Iniciou a cena:", this.name); }

    exit() { /** */ }

    /**
     * @param { number } deltaTime
     */
    update(deltaTime) { /** */ }

    /**
     * @param { CanvasRenderingContext2D } context
     */
    render(context) { /** */ }

    onClick({ x, y, isDown }) { /** */ }

    onHover({ x, y }) { console.log({ x, y }); }
}