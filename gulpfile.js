const {task, series, parallel, src, dest, watch} = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    notify = require('gulp-notify'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    cssnano = require('cssnano'),
    postcss = require('gulp-postcss'),
    csscomb = require('gulp-csscomb'),
    autoprefixer = require('autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    mqpacker = require('css-mqpacker'),
    sortCSSmq = require('sort-css-media-queries'),
    uglify = require('gulp-uglify'),
    terser = require('gulp-terser'),
    concat = require('gulp-concat');
    del = require('del');
    

    
const PATH = {
    scssFile: './assets/scss/style.scss',
    scssFiles: './assets/scss/**/*.scss',
    scssFolder: './assets/scss',
    cssFolder: './assets/css',
    htmlFiles: '*.html',
    jsFiles: [
        './assets/js/**/*.js',
        '!./assets/js/**/all.js',
        '!./assets/js/**/*.min.js',
    ],
    jsBundleName: 'all.js',
    jsFolder: 'assets/js',
    buildFolder: 'dest'

};

const plugins = [
    autoprefixer({overrideBrowserslist: ['last 5 versions', '> 1%'], cascade: true}),
    mqpacker({sort: sortCSSmq})
]

function scss() {
  return src(PATH.scssFile)
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(notify({
        message: 'Compiled!',
        sound: false
       }))
    .pipe(dest(PATH.cssFolder))
    .pipe(browserSync.stream())
};

function scssMin() {
  const pluginsExtended = plugins.concat([cssnano({preset: 'default'})]);
  return src(PATH.scssFile)
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(postcss(pluginsExtended))
    .pipe(rename({suffix: '.min'}))
    .pipe(dest(PATH.cssFolder))
    .pipe(browserSync.stream())
};

function scssDev() {
    return src(PATH.scssFile, {sourcemaps: true})
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
      .pipe(dest(PATH.cssFolder, {sourcemaps: true}))
      .pipe(browserSync.stream());
  };

function comb() {
    return src(PATH.scssFiles)
      .pipe(csscomb('./.csscomb.json'))
      .on('error', notify.onError(error => 'File: ' + error.message))
      .pipe(dest(PATH.scssFolder))
};

function concatJS() {
    return src(PATH.jsFiles)
      .pipe(concat(PATH.jsBundleName))
      .pipe(dest(PATH.jsFolder))
};

function uglifyJS() {
    return src(PATH.jsFiles)
      .pipe(uglify({
        toplevel: true,
        output: {quote_style: 3 }
    }))
      .pipe(rename({suffix: '.min'}))
      .pipe(dest(PATH.jsFolder))
};

function uglifyES6() {
    return src(PATH.jsFiles)
      .pipe(terser({
        toplevel: true,
        output: {quote_style: 3 }
    }))
      .pipe(rename({suffix: '.min'}))
      .pipe(dest(PATH.jsFolder))
};

function buildJS () {
    return src(PATH.jsFolder + '/**/*.min.js')
        .pipe(dest(PATH.buildFolder + '/js'))
};

function buildHTML () {
    return src(PATH.htmlFiles)
        .pipe(dest(PATH.buildFolder + '/templates'))
};

function buildCSS () {
    return src(PATH.cssFolder + '/**/*.min.css')
    .pipe(dest(PATH.buildFolder + '/css'))
  };

  async function clearFolder () {
    await del(PATH.buildFolder, {force:true})
    return true
  }



function init () {
    browserSync({
        server: {
            baseDir: "./"
        },
        browser: 'Chrome'
  });
};

async function sync() {
    browserSync.reload();
};
   
function watchFiles () {
    init();
    watch(PATH.scssFiles, scss); 
    watch(PATH.htmlFiles, sync);
    watch(PATH.jsFiles, sync);
};

task('scss', scss); 
task('min', series(scss, scssMin));
task('dev', scssDev);
task('comb', comb);
task('watch', watchFiles);
task('concat', concatJS);
task('minjs', uglifyJS);
task('mines6', uglifyES6);

task('build', series(clearFolder, parallel(buildJS, buildHTML, buildCSS)));



