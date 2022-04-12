//General

const gulp = require("gulp");
const { series, parallel, dest } = require("gulp");
const browserSync = require("browser-sync").create();
const rename = require("gulp-rename");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const del = require("del");
const zip = require("gulp-zip");

// SASS
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const cssnano = require("gulp-cssnano");
const autoprefixer = require("gulp-autoprefixer");

// JavaScript
const uglyfy = require("gulp-uglify");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
// const browserify = require("gulp-browserify");
const babelify = require("babelify");
const buffer = require("vinyl-buffer");
const source = require("vinyl-source-stream");
const connect = require("gulp-connect");
const browserify = require("browserify");
// HTML
const kit = require("gulp-kit");
const htmlmin = require("gulp-htmlmin");

// Image optimization + clear cache
const imagemin = require("gulp-imagemin");
const cache = require("gulp-cache");

// Files
filesPath = {
  sass: "./src/sass/**/*.scss",
  js: "./src/js/controller.js",
  images: "./src/assets/**/*.+(png|jpg|gif|svg)",
  html: "./src/html/**/*.kit",
  fonts: "./src/assets/fonts/*",
};

// Error message

const plumberErrorHandler = {
  errorHandler: notify.onError({
    title: "Miloše",
    message: "Pogrešio si: <%= error.message %>",
  }),
};

// SASS to CSS

function sassTask(done) {
  gulp
    .src([filesPath.sass])
    .pipe(plumber(plumberErrorHandler))
    .pipe(sourcemaps.init())
    // .pipe(autoprefixer())
    .pipe(sass())
    .pipe(cssnano())
    .pipe(
      rename(function (path) {
        path.basename += ".min";
      })
    )
    .pipe(sourcemaps.write(""))
    .pipe(dest("./dist/css"));
  done();
}

// JavaScript minify and optimization for ES5

// function jsTask(done) {
//   gulp
//     .src("./src/js/**/*.js")
//     .pipe(plumber())
//     .pipe(sourcemaps.init())
//     .pipe(
//       babel({
//         presets: [["@babel/env"]],
//       })
//     )
//     .pipe(concat("script.js"))
//     .pipe(uglyfy())
//     .pipe(
//       rename(function (path) {
//         path.basename += ".min";
//       })
//     )
//     .pipe(sourcemaps.write("."))
//     .pipe(dest("./dist/js"));
//   done();
// }

function jsTask(done) {
  return browserify({
    entries: [filesPath.js],
  })
    .transform(
      babelify.configure({
        presets: ["@babel/preset-env"],
      })
    )
    .bundle()
    .pipe(source("controller.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglyfy())
    .pipe(
      rename(function (path) {
        path.basename += ".min";
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(dest("./dist/js"));
  done();
}

// HTML minify

function kitTask(done) {
  gulp
    .src(filesPath.html)
    .pipe(plumber(plumberErrorHandler))
    .pipe(kit())
    .pipe(htmlmin()) //{ collapseWhitespace: true }
    .pipe(dest("./dist"));
  done();
}

// Image optimization + gulp cache

function imagesTask(done) {
  gulp
    .src(filesPath.images)
    .pipe(cache(imagemin()))
    .pipe(dest("./dist/assets/"));
  done();
}

// Copy fonts

function fontTask(done) {
  gulp.src(filesPath.fonts).pipe(dest("./dist/assets/fonts"));
  done();
}

// Watch task

function watch() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    browser: "chrome",
  });
  gulp.watch(filesPath.sass, sassTask).on("change", browserSync.reload);
  gulp.watch("./src/js/**/*.js", jsTask).on("change", browserSync.reload);
  gulp.watch(filesPath.html, kitTask).on("change", browserSync.reload);
  gulp.watch(filesPath.images, imagesTask).on("change", browserSync.reload);
}

// Clearing cache

function clearCache(done) {
  return cache.clearAll(done);
}

// Zip File

function zipTask(done) {
  gulp
    .src(["./**/*", "!./node_modules/**/*"])
    .pipe(zip("archive.zip"))
    .pipe(dest("./"));
  done();
}

// Clean 'dist'

function clean(done) {
  return del(["./dist/**/*"]);
  done();
}

// Gulp individual tasks

exports.sassTask = sassTask;
exports.jsTask = jsTask;
exports.imagesTask = imagesTask;
exports.kitTask = kitTask;
exports.watch = watch;
exports.clearCache = clearCache;
exports.zipTask = zipTask;
exports.clean = clean;
exports.fontTask = fontTask;

// Gulp serve // Executing all tasks in same moment

exports.build = parallel(sassTask, jsTask, imagesTask, kitTask);

// Gulp default command

exports.default = series(exports.build, watch);
