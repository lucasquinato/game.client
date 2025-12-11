export class Scene {
    constructor(name) { this.name = name; }

    init() { console.log(`Cena: ${name} iniciada em Scene.init();`); }
    exit() { console.log(`Cena: ${name} encerrada em Scene.exit();`); }

    update(deltaTime) {}
    render(context) {}
}