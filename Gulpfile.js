// Minimal, working Gulp v4 setup to integrate with CI and local dev
const { src, dest, series, parallel, watch } = require("gulp");
const { spawn } = require("child_process");
const browserSync = require("browser-sync").create("jekyll");
const cleanCSS = require("gulp-clean-css");
const terser = require("gulp-terser");
const del = require("del");
const fs = require("fs");
const path = require("path");
// Example passthrough task (kept simple; extend as needed)
// Development asset tasks (no minification)
function stylesDev() {
    return src(["assets/css/**/*.css"], { allowEmpty: true })
        .pipe(dest("_site/assets/css"))
        .pipe(browserSync.stream());
}

function scriptsDev() {
    return src(["assets/**/*.js"], { allowEmpty: true })
        .pipe(dest("_site/assets"))
        .pipe(browserSync.stream());
}

// Copy all other assets (images/fonts/etc.) preserving structure
function staticDev() {
    return src(["assets/**/*", "!assets/css{,/**}", "!assets/**/*.js"], {
        allowEmpty: true,
    })
        .pipe(dest("_site/assets"))
        .pipe(browserSync.stream());
}

// Production asset tasks (minified)
function stylesProd() {
    return src(["assets/css/**/*.css"], { allowEmpty: true })
        .pipe(cleanCSS({ level: 2 }))
        .pipe(dest("_site/assets/css"));
}

function scriptsProd() {
    return src(["assets/**/*.js"], { allowEmpty: true })
        .pipe(terser())
        .pipe(dest("_site/assets"));
}

function staticProd() {
    return src(["assets/**/*", "!assets/css{,/**}", "!assets/**/*.js"], {
        allowEmpty: true,
    }).pipe(dest("_site/assets"));
}

function assetsDev(done) {
    return parallel(stylesDev, scriptsDev, staticDev)(done);
}
function assetsProd(done) {
    return parallel(stylesProd, scriptsProd, staticProd)(done);
}

// Placeholder hook for future tasks (e.g., sass, minify, etc.)
function build(cb) {
    cb
        // Add real build steps here; for now just signal success
        .cb();
}

exports.assets = assetsDev;
exports.build = series(jekyllBuild, assetsProd);

function watchAssets() {
    // Rebuild on CSS/JS changes; extend globs as needed
    watch(["assets/css/**/*.css"], stylesDev);
    watch(["assets/**/*.js"], scriptsDev);
    watch(["assets/**/*", "!assets/css{,/**}", "!assets/**/*.js"], staticDev);
}

// Jekyll helpers
function jekyllWatch(done) {
    const args = ["exec", "jekyll", "build", "--watch", "--incremental"];
    const child = spawn("bundle", args, {
        stdio: "inherit",
        shell: process.platform === "win32",
    });
    // keep process alive; call done immediately
    child.on("close", (code) => process.exit(code));
    done();
}

function jekyllBuild(done) {
    const args = ["exec", "jekyll", "build", "--trace"];
    const child = spawn("bundle", args, {
        stdio: "inherit",
        shell: process.platform === "win32",
    });
    child.on("close", (code) =>
        done(code ? new Error(`jekyll build exited with ${code}`) : undefined)
    );
}
function bsServe(done) {
    // When the file generates, it should be available immediately

    const content_404 = fs.readFileSync(path.join("_site", "404.html"));
    browserSync.init(
        {
            server: { baseDir: "_site" },
            open: false,
            notify: false,
            ghostMode: false,
            port: 80,
        },
        (err, bs) => {
            bs.addMiddleware("*", (req, res) => {
                // Provides the 404 content without redirect.
                res.write(content_404);
                res.end();
            });
        }
    );
    // Reload when Jekyll writes files
    watch(["_site/**/*", "!_site/assets/**/*"]).on(
        "change",
        browserSync.reload
    );
    done();
}

exports.watch = series(assetsDev, watchAssets);
exports.serve = parallel(jekyllWatch, bsServe, series(assetsDev, watchAssets));
exports.clean = () => del(["_site"]);
exports.default = exports.build;
