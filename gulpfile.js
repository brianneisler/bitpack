'use strict'; //eslint-disable-line strict

//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

const gulp          = require('gulp');
const babel         = require('gulp-babel');
const eslint        = require('gulp-eslint');
const jest          = require('gulp-jest-iojs');
const recipe        = require('gulp-recipe');
const sourcemaps    = require('gulp-sourcemaps');
const util          = require('gulp-util');


//-------------------------------------------------------------------------------
// Gulp Properties
//-------------------------------------------------------------------------------

const sources = {
    babel: [
        'src/**',
        '!**/tests/**'
    ]
};


//-------------------------------------------------------------------------------
// Gulp Tasks
//-------------------------------------------------------------------------------

gulp.task('default', ['prod']);

gulp.task('prod', ['babel']);

gulp.task('dev', ['babel', 'lint', 'babel-watch', 'lint-watch']);

gulp.task('babel', function() {
    return gulp.src(sources.babel)
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(babel({
            presets: ['es2015', 'stage-2']
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'))
        .on('error', function(error) {
            util.log(error);
        });
});

gulp.task('lint', recipe.get('eslint', [
    'src/**/*.js',
    '!node_modules/**'
]));

gulp.task('test', ['lint']);


//-------------------------------------------------------------------------------
// Gulp Watchers
//-------------------------------------------------------------------------------

gulp.task('babel-watch', function() {
    gulp.watch(sources.babel, ['babel']);
});

gulp.task('lint-watch', function() {
    const lintAndPrint = eslint();
    lintAndPrint.pipe(eslint.formatEach());

    return gulp.watch('src/**/*.js', function(event) {
        if (event.type !== 'deleted') {
            gulp.src(event.path)
                .pipe(lintAndPrint, {end: false})
                .on('error', function(error) {
                    util.log(error);
                });
        }
    });
});
