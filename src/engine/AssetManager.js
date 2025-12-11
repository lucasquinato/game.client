class AssetManager {
    constructor() {
        this.assets = new Map();
        this.metadata = new Map();
    }

    loadImage(key, data) {
        return new Promise((resolve, reject) => {
            const image = new Image();

            image.onload = () => {
                console.log(`Carregando imagem: ${data.name}...`);
                this.assets.set(key, image);
                resolve(image);
            };

            image.onerror = () => {
                console.error(`Erro ao carregar imagem: ${data.name}...`);
                reject(image);
            };

            image.src = data.imageSrc;
        });
    }

    async loadAll(manifest) {
        const promises = [];

        for (const [key, data] of Object.entries(manifest)) {
            promises.push(this.loadImage(key, data));
            this.metadata.set(key, data.metadata);
        }

        return Promise.all(promises);
    }

    get(key) { return this.assets.get(key); }

    getMeta(key) { return this.metadata.get(key); }
}

export const $Assets = new AssetManager();