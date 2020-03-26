import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
import image from "gulp-image";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import miniCss from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";



const route = {
    pug: {
        watch: "src/**/*.pug",
        src: "src/*.pug",
        dest: "build"
    },
    img: {
        src: "src/img/*",
        dest: "build/img"
    },
    scss: {
        watch: "src/scss/**/*.scss",
        src: "src/scss/style.scss",
        dest: "build/css"
    },
    js: {
        watch: "src/js/**/*.js",
        src: "src/js/main.js",
        dest: "build/js"
    }
}


const pug = () => 
    gulp
    .src(route.pug.src)
    .pipe(gpug())
    .pipe(gulp.dest(route.pug.dest));


const clean = () => del(["build"]);

const webServer = () => 
    gulp
    .src("build")
    .pipe(ws({ livereload: true, open: true}));

const watch = () => {
    gulp.watch(route.scss.watch,style);
    gulp.watch(route.pug.watch, pug);
    gulp.watch(route.img.src, img);
    gulp.watch(route.js.watch, js);
};

const img = () => gulp.src(route.img.src)
    .pipe(image())
    .pipe(gulp.dest(route.img.dest));

const style = () => gulp.src(route.scss.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ["last 2 version"]
    }))
    .pipe(miniCss())
    .pipe(gulp.dest(route.scss.dest));

const js = () => gulp.src(route.js.src)
    .pipe(
        bro({
            transform: [
                babelify.configure({ presets: ['@babel/preset-env'] }),
                [ 'uglifyify', { global: true } ]
              ]
        })
    )
    .pipe(gulp.dest(route.js.dest));

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, style, js]);

const postDev = gulp.parallel([webServer, watch]);

exports.dev = gulp.series([prepare, assets, postDev]);
