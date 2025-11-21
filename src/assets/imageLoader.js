export function loadImage(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(`Erro ao carregar imagem: ${path}`);
        img.src = path;
    });
}

export async function imageLoader(obj) {
    async function loadRecursive(target) {
        if (typeof target === "string") {
            return await loadImage(target);
        }

        if (Array.isArray(target)) {
            for (let i = 0; i < target.length; i++) {
                target[i] = await loadRecursive(target[i]);
            }

            return target;
        }

        if (typeof target === "object" && target !== null) {
            for (const key in target) {
                target[key] = await loadRecursive(target[key]);
            }

            return target;
        }

        return target;
    }

    await loadRecursive(obj);
}