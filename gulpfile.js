const { src, dest, watch, parallel, series } = require("gulp");

// изображения
const newer = require("gulp-newer");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");

function images() {
  return src("src/images/origin/*.*")
    .pipe(newer("src/images/origin.min"))
    .pipe(imagemin())
    .pipe(dest("src/images/origin.min"))

    .pipe(src("src/images/origin.min"))
    .pipe(newer("src/images"))
    .pipe(webp())
    .pipe(dest("src/images"));
}

// шрифты
const fonter = require("gulp-fonter");
const ttf2woff2 = require("gulp-ttf2woff2");

function fonts() {
  return src("src/fonts/origin/*.*")
    .pipe(
      fonter({
        formats: ["woff", "ttf"],
      })
    )
    .pipe(ttf2woff2())
    .pipe(dest("src/fonts"));
}

// include
const include = require("gulp-include");

function pages() {
  return src("src/pages/*.html")
    .pipe(
      include({
        includePaths: "src/components",
      })
    )
    .pipe(dest("src"));
}

// стили и скрипты
const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");

function styles() {
  return src("src/scss/**/*.scss")
    .pipe(concat("main.min.css"))
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(dest("src/css"));
}

const uglify = require("gulp-uglify-es").default;

function scripts() {
  return src("src/scripts/**/*.js")
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("src/js"));
}

// автоматизация
function watching() {
  watch(["src/images/origin/*.*"], images);
  watch(["src/fonts/origin/*.*"], fonts);
  watch(["src/scss/**/*.scss"], styles);
  watch(["src/scripts/**/*.js"], scripts);
  watch(["src/components/*", "src/pages/*"], pages);
}

// сборка нового/обновлённого проекта
const clean = require("gulp-clean");
function cleanPublic() {
  return src("public").pipe(clean());
}
function building() {
  return src(
    [
      "src/js/*.js",
      "src/css/*.css",
      "src/*.html",
      "src/images/*.*",
      "src/fonts/*.woff2",
    ],
    { base: "src" }
  ).pipe(dest("public"));
}

// tasks
exports.images = images;
exports.fonts = fonts;
exports.styles = styles;
exports.scripts = scripts;
exports.pages = pages;
exports.watching = watching;

exports.default = parallel(images, fonts, styles, scripts, pages, watching);

exports.build = series(cleanPublic, building);
