let gulp = require("gulp")
const { series } = require('gulp');
let cleanCss = require("gulp-clean-css")
let postcss = require("gulp-postcss")
let concat = require("gulp-concat")
let sourceMaps = require("gulp-sourcemaps")
let browserSync = require("browser-sync").create()
let imageMin = require("gulp-imagemin")
let ghpages = require("gh-pages")


  function style() {
    return gulp.src([
      "src/css/reset.css",
      "src/css/typography.css",
      "src/css/app.css"
    ])
      .pipe(sourceMaps.init())
      .pipe(
        postcss([
          require("autoprefixer"),
          require("postcss-preset-env") ({
            stage: 1,
            browsers: ["IE 11", "last 2 versions"]
          })
        ])
        )
      .pipe(concat("app.css"))
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
    gulp.watch("src/css/fonts/*", fonts)
    gulp.watch("src/img/*", img)
    return gulp.watch("src/css/*", style)
  }

  function deploy() {
    ghpages.publish("dist")
  }
  
  exports.deploy = deploy
  exports.style = style
  exports.watch = watch
  exports.html = html
  exports.default = series(style, html, fonts, img, watch)
  