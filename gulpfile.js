var _ = require('underscore');
var fs = require('fs');
var gulp = require('gulp');
var consolidate = require('gulp-consolidate');
var rename = require('gulp-rename');
var svgmin = require('gulp-svgmin');
var urlencode = require('gulp-css-urlencode-inline-svgs');

function writeScss(stream, file) {

}

gulp.task('minify-icons', function() {
  return gulp.src('./fec-icons/icons/*.svg')
    .pipe(svgmin({
      plugins: [
        {
          removeDimensions: true
        },
        {
          removeAttrs: {attrs: '(fill|fill-rule)'}
        }
      ]
    }))
    .pipe(gulp.dest('./img/icons', {overwrite: true}));
});

gulp.task('consolidate-icons', function() {
  function getSVGs() {
    var svgs = [],
        files = fs.readdirSync('./img/icons/');
    files = _.filter(files, function(file) {
      return file.substr(-4) === '.svg'
    });
    _.map(files, function(file) {
      var data = fs.readFileSync('./img/icons/' + file, 'utf8');
      svgs.push({
        name: file.split('.')[0],
        content: data,
      });
    });
    return svgs;
  };

  var svgs = getSVGs();
  var data = {
    icons: svgs
  }
  return gulp.src('./fec-icons/icon-template.scss')
    .pipe(consolidate('underscore', data))
    .pipe(rename({basename: '_icon-variables'}))
    .pipe(urlencode())
    .pipe(gulp.dest('./scss/'))
    .pipe(gulp.dest('./'))
});

