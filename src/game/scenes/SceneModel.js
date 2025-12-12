export class Scene {
    constructor(name) { this.name = name; }

    init() { console.log(`Cena: ${this.name} iniciada em Scene.init();`); }
    exit() { console.log(`Cena: ${this.name} encerrada em Scene.exit();`); }

    update(deltaTime) {}
    render(context) {}

    handle_INPUT(inputEvent) { console.log(inputEvent); }
}