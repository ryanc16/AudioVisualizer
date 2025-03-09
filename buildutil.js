const fs = require('node:fs').promises;
const path = require('node:path');

const bundle = {
    src: [
        { source: "src/index.html", dest: "public/index.html" },
        { source: "src/basic.html", dest: "public/basic.html" },
        "audio/dothemath.mp3"
    ],
    libs: {
        js: [
            "node_modules/jquery/dist/jquery.min.js",
            "node_modules/three/three.min.js",
            "node_modules/bootstrap/dist/js/bootstrap.min.js"
        ],
        css: [
            "node_modules/bootstrap/dist/css/bootstrap.min.css"
        ],
    }
};

bundle.src.forEach(async file => {
    if (typeof file === 'string') {
        const dir = path.join("public", path.dirname(file));
        await fs.mkdir(dir, { recursive: true })
            .then(() => fs.copyFile(file, path.join(dir, path.basename(file))));
    } else if (file.source && file.dest) {
        const dir = path.dirname(file.dest);
        await fs.mkdir(dir, { recursive: true })
            .then(() => fs.copyFile(file.source, file.dest));
    }
});

Object.keys(bundle.libs).forEach(type => {
    bundle.libs[type].forEach(async file => {
        const dir = path.join("public", "lib", type);
        await fs.mkdir(dir, { recursive: true })
            .then(() => fs.copyFile(file, path.join(dir, path.basename(file))));
        ;
    });
});
