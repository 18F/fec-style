var _ = require('underscore');
var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');
var rename = require('gulp-rename');
var cssBase64 = require('gulp-css-base64');

var FONTNAME = 'fec-icons';
var CLASSNAME = 'i';
var TIMESTAMP = Math.round(Date.now() / 1000);

gulp.task('build-icons', function () {
 return gulp.src('fec-icons/*.svg')
  .pipe(iconfont({
    fontName: FONTNAME,
    prependUnicode: false,
    formats: ['ttf', 'eot', 'woff', 'woff2'],
    timestamp: TIMESTAMP
  }))
  .on('glyphs', function(glyphs) {
    var options = {
      fontName: FONTNAME,
      fontPath: '../fonts/',
      className: CLASSNAME,
      glyphs: _.map(glyphs, function(glyph) {
        return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
      })
    };
    // Generate the .scss file
    gulp.src('fec-icons/icon-template.scss')
      .pipe(consolidate('underscore', options))
      .pipe(rename({basename: '_icons'}))
      .pipe(gulp.dest('./scss/'));
  })
  .pipe(gulp.dest('./fonts/'))
});

gulp.task('encode', function() {
  return gulp.src('fec-icons/_fec-icon-font.scss')
    .pipe(cssBase64({
      extensionsAllowed: ['.woff', '.woff2']
    }))
    .pipe(gulp.dest('scss'));
});
