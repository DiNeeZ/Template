const gulp = require("gulp");
const cache = require("gulp-cache");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const sourceMaps = require("gulp-sourcemaps");
const imagemin = require("gulp-imagemin");
const imageminPngquant = require("imagemin-pngquant");
const imageminZopfli = require("imagemin-zopfli");
const imageminMozjpeg = require("imagemin-mozjpeg"); //need to run 'brew install libpng'
const imageminGiflossy = require("imagemin-giflossy");
const del = require("del");
const svgSprite = require("gulp-svg-sprite");
const svgmin = require("gulp-svgmin");
const cheerio = require("gulp-cheerio");
const replace = require("gulp-replace");

gulp.task("sass", function () {
  return gulp
    .src("scss/styles.scss")
    .pipe(plumber())
    .pipe(sourceMaps.init())
    .pipe(sass())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(sourceMaps.write())
    .pipe(gulp.dest("build/css"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

gulp.task("html", function () {
  return gulp
    .src("./*.html")
    .pipe(gulp.dest("build"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

gulp.task("js", function () {
  return gulp
    .src("js/**/*.js")
    .pipe(gulp.dest("build/js"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

gulp.task("css", function () {
  return gulp
    .src("css/**/*.css")
    .pipe(gulp.dest("build/css"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

gulp.task("fonts", function () {
  return gulp
    .src("fonts/**/*.+(eot|ttf|woff|woff2)")
    .pipe(gulp.dest("build/fonts"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

gulp.task("allimg", function () {
  return gulp
    .src("img/**/*.+(png|jpg|jpeg)")
    .pipe(gulp.dest("build/img"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

gulp.task("libs", function () {
  return gulp
    .src("libs/**")
    .pipe(gulp.dest("build/libs"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

gulp.task("images", function () {
  return gulp
    .src("img/**/*.+(jpg|jpeg|gif|png)")
    .pipe(
      cache(
        imagemin([
          //png
          imageminPngquant({
            speed: 1,
            quality: [0.95, 1], //lossy settings
          }),
          // imageminZopfli({
          //     more: true,
          //     iterations: 50 // very slow but more effective
          // }),
          imageminGiflossy({
            optimizationLevel: 3,
            optimize: 3, //keep-empty: Preserve empty transparent frames
            lossy: 2,
          }),
          //jpg
          imageminMozjpeg({
            quality: 80,
          }),
        ])
      )
    )
    .pipe(gulp.dest("build/img"));
});

gulp.task("svg", function () {
  return (
    gulp
      .src("img/**/*.svg")
      .pipe(
        svgmin({
          js2svg: {
            pretty: true,
          },
        })
      )
      .pipe(
        cheerio({
          run: function ($) {
            $("[fill]").removeAttr("fill");
            $("[stroke]").removeAttr("stroke");
            $("[style]").removeAttr("style");
          },
          parserOptions: { xmlMode: true },
        })
      )
      .pipe(replace("&gt;", ">"))
      // build svg sprite
      .pipe(
        svgSprite({
          mode: {
            symbol: {
              sprite: "../sprite.svg",
            },
          },
        })
      )
      .pipe(gulp.dest("build/img"))
  );
});

gulp.task("serve", function () {
  browserSync.init({
    server: {
      baseDir: "build",
    },
    notify: false,
  });

  gulp.watch("scss/**/*.scss", gulp.series("sass"));
  gulp.watch("./*.html", gulp.series("html"));
  gulp.watch("js/**/*.js", gulp.series("js"));
  gulp.watch("fonts/**/*.+(eot|ttf|woff|woff2)", gulp.series("fonts"));
  gulp.watch("libs/**", gulp.series("libs"));
  gulp.watch("css/**/*.css", gulp.series("css"));
  gulp.watch("img/**/*.+(png|jpg)", gulp.series("allimg"));
  gulp.watch("img/**/*.svg", gulp.series("svg"));
});

gulp.task("copy", function () {
  return gulp
    .src(
      [
        // 'img/**',
        "./*.html",
        "js/**",
        "css/**",
        "fonts/**",
        "libs/**",
      ],
      {
        base: ".",
      }
    )
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task(
  "default",
  gulp.series("clean", "copy", "sass", "images", "svg", "serve")
);
