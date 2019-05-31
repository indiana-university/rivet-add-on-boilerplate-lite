const { series, src, dest, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const eslint = require("gulp-eslint");
const sass = require("gulp-sass");

/**
 * Starts the local development server, using /docs as the base directory.
 *
 * Running `npm run start` starts the local development server.
 */

function startDevServer(callback) {
  browserSync.init(["docs/css/**/*.css", "docs/js/**/*.js", "docs/**/*.html"], {
    server: {
      baseDir: "./docs"
    }
  });

  watch("src/sass/**/*.scss", { ignoreInitial: false }, compileSass);
  watch("src/js/**/*.js", { ignoreInitial: false }, series(lintJSWatch, compileJS));
  watch("src/index.html", { ignoreInitial: false }, compileHTML);
  
  callback();
}

/**
 * Compiles Sass files to /docs/css for use by the local development server.
 */

function compileSass() {
  return src("src/sass/**/*.scss")
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(dest("docs/css/"))
    .pipe(browserSync.stream());
}

/**
 * Lints and compiles JavaScript files to /docs/js for use by the local 
 * development server.
 */
function lintJSWatch() {
  return src(["src/js/**/*.js", "!node_modules/**"])
    .pipe(eslint())
    .pipe(eslint.format());
}

function compileJS() {
  return src("src/js/**/*.js")
    .pipe(dest("docs/js/"))
    .pipe(browserSync.stream());
}

/**
 * Compiles documentation HTML files to /docs for use by the local 
 * development server.
 */

function compileHTML() {
  return src("src/index.html")
    .pipe(dest("docs/"))
    .pipe(browserSync.stream());
}

/**
 * Builds Sass files to /dist/css for distribution.
 */

function buildSass() {
  return src(["src/sass/**/*.scss", "!src/sass/code-snippet-styling.scss"])
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(dest("dist/css/"));
}

/**
 * Builds JavaScript files to /dist/js for distribution.
 */
function lintJSBuild() {
  return src(["src/js/**/*.js", "!node_modules/**"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

function buildJS() {
  return src("src/js/**/*.js")
    .pipe(dest("dist/js/"));
}

exports.default = startDevServer;
exports.build = series(buildSass, lintJSBuild, buildJS);
