let gulp = require("gulp")
const { series } = require('gulp');
let sass = require("gulp-sass")
let cleanCss = require("gulp-clean-css")
let sourceMaps = require("gulp-sourcemaps")
let browserSync = require("browser-sync").create()
let imageMin = require("gulp-imagemin")


  function style() {
    return gulp.src('src/css/app.scss')
      .pipe(sourceMaps.init())
      .pipe(sass())
      .pipe(
        cleanCss({compatibility: "ie8"})
      )
      .pipe(sourceMaps.write())
      .pipe(gulp.dest("dist"))
      .pipe(browserSync.stream())
  }

  function html() {
    return gulp.src("src/*.html")
      .pipe(gulp.dest("dist"))
  }

  function fonts() {
    return gulp.src("src/fonts/*")
      .pipe(gulp.dest("dist/fonts"))
  }

  function img() {
    return gulp.src("src/img/*")
      .pipe(imageMin())
      .pipe(gulp.dest("dist/img"))
  }

  function watch() {
    browserSync.init({
      server:{
        baseDir: "dist"
      }
    })
    gulp.watch("src/*.html", html).on('change', browserSync.reload)
    gulp.watch("src/css/fonts", fonts)
    gulp.watch("src/img/*", img)
    return gulp.watch("src/css/app.scss", style)
  }
  

  exports.style = style
  exports.watch = watch
  exports.html = html
  exports.default = series(style, html, fonts, img, watch)
  