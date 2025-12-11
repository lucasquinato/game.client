class AssetManager {
    constructor() {
        this.assets = new Map();
        this.metadata = new Map();
    }

    loadImage(key, data) {
        return new Promise((resolve, reject) => {
            const image = new Image();

            image.src = data.imageSrc;

            image.onload = () => {
                console.log(`Carregando imagem: ${data.name}...`);
                this.assets.set(key, image);
                resolve(image);
            };

            image.onerror = () => {
                console.error(`Erro ao carregar imagem: ${data.name}...`);
                reject(image);
            };
        });
    }

    async loadAll(manifest) {
        const promises = [];

        for (const [key, data] of Object.entries(manifest)) {
            const numKey = Number(key);
            promises.push(this.loadImage(numKey, data));
            this.metadata.set(numKey, data.metadata);
        }

        return Promise.all(promises);
    }

    get(key) { return this.assets.get(Number(key)); }

    getMeta(key) { return this.metadata.get(Number(key)); }
}

export const $Assets = new AssetManager();