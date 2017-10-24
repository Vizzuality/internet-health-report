// This whole configuration is based on
// https://www.sitepoint.com/fast-gulp-wordpress-theme-development-workflow/

'use strict';

require('dotenv').load({ path: '../.env' });

const

  // Source and build folders
  dir = {
    src         : 'src/',
    build       : 'www/wp-content/themes/ihr-2018/'
  },

  // Gulp and plugins
  gulp          = require('gulp'),
  gutil         = require('gulp-util'),
  runSequence   = require('run-sequence'),
  del           = require('del'),
  newer         = require('gulp-newer'),
  imagemin      = require('gulp-imagemin'),
  webpack       = require('webpack-stream'),
  sass          = require('gulp-sass'),
  bulkSass      = require('gulp-sass-bulk-import'),
  postcss       = require('gulp-postcss'),

  // Global variables
  isProduction  = process.env.NODE_ENV === 'production',
  webpackConfig = require('./webpack.config');
;

// Browser-sync
let browsersync = false;

// Clean the dist folder
gulp.task('clean', () => {
  return del(dir.build + '**/*');
});

// PHP settings
const php = {
  src           : dir.src + 'template/**/*.php',
  build         : dir.build
};

// Copy PHP files
gulp.task('php', () => {
  return gulp.src(php.src)
    .pipe(newer(php.build))
    .pipe(gulp.dest(php.build));
});

// Image settings
const images = {
  src         : dir.src + 'images/**/*',
  build       : dir.build + 'images/'
};

// Image processing
gulp.task('images', () => {
  return gulp.src(images.src)
    .pipe(newer(images.build))
    .pipe(imagemin())
    .pipe(gulp.dest(images.build));
});


// CSS settings
const css = {
  src         : dir.src + 'scss/style.scss',
  watch       : dir.src + 'scss/**/*',
  build       : dir.build,
  sassOpts: {
    outputStyle     : 'nested',
    imagePath       : images.build,
    precision       : 3,
    errLogToConsole : true
  },
  processors: [
    require('postcss-assets')({
      loadPaths: ['images/'],
      basePath: dir.build,
      baseUrl: '/wp-content/themes/wptheme/'
    }),
    require('autoprefixer')({
      browsers: ['last 2 versions', '> 2%']
    }),
    require('css-mqpacker'),
    require('cssnano')
  ]
};

// CSS processing
gulp.task('css', ['images'], () => {
  return gulp.src(css.src)
    .pipe(bulkSass())
    .pipe(sass(css.sassOpts))
    .pipe(postcss(css.processors))
    .pipe(gulp.dest(css.build))
    .pipe(browsersync ? browsersync.reload({ stream: true }) : gutil.noop());
});

// JavaScript settings
const js = {
  src         : dir.src + 'js/index.js',
  build       : dir.build + 'js/',
  filename    : 'scripts.js',
  webpack     : webpackConfig
};

// JavaScript processing
gulp.task('js', () => {
  return gulp.src(js.src)
    .pipe(webpack(js.webpack))
    .pipe(gulp.dest(js.build))
    .pipe(browsersync ? browsersync.reload({ stream: true }) : gutil.noop());
});

// Browsersync options
const syncOpts = {
  proxy       : 'localhost:8000',
  files       : dir.build + '**/*',
  open        : false,
  notify      : false,
  ghostMode   : false,
  ui: {
    port: 8001
  }
};


// browser-sync
gulp.task('browsersync', () => {
  if (browsersync === false) {
    browsersync = require('browser-sync').create();
    browsersync.init(syncOpts);
  }
});

// Watch for file changes
gulp.task('watch', ['browsersync'], () => {
  // Page changes
  gulp.watch(php.src, ['php'], browsersync ? browsersync.reload : {});

  // Image changes
  gulp.watch(images.src, ['images']);

  // CSS changes
  gulp.watch(css.watch, ['css']);

  // JavaScript main changes
  gulp.watch(js.src, ['js']);
});

// Run all tasks
gulp.task('build', cb => runSequence('clean', ['php', 'css', 'js'], cb));

// Default task
gulp.task('default', cb => runSequence('clean', ['build', 'watch'], cb));
