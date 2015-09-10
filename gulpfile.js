var concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    data = require('gulp-data'),
    debug = require('gulp-debug'),
    fs = require('fs'),
    gulp = require('gulp'),
    jade = require('gulp-jade'),
    prettify = require('gulp-prettify'),
    stylus = require('gulp-stylus'),
    typogr = require('gulp-typogr'),
    useref = require('gulp-useref'),

    yaml = require('js-yaml');
    // imageDataUri = require('gulp-image-data-uri');

var commons = require('./common_vars');
console.log(commons);
var devserverPort = commons.devserverPort;

// Below somewhat adapted from http://stackoverflow.com/a/14732537
function getRows(items, items_per_row) {
    if (12 % items_per_row) {
        throw new Error('Items per row must be divisors of 12');
    }

    return items.reduce(function (prev, item, i) {
        if(i % items_per_row === 0)
            prev.push([item]);
        else
            prev[prev.length - 1].push(item);

        return prev;
    }, []);
}

gulp.task("image_uris", function() {
    gulp.src('dist/imgs/*')
        .pipe(imageDataUri())
        .pipe(gulp.dest('dist'));
});

gulp.task("templates", ['styles'], function() {
    var my_locals = {
        pretty: true
    };
    var assets = useref.assets();

    return gulp.src('src/*.jade')
        .pipe(data(function(f) {
            var vars_for_jade = yaml.safeLoad(fs.readFileSync('src/data/data.yml', 'utf-8'));

            vars_for_jade.testimonials = getRows(vars_for_jade.testimonials, 4);
            vars_for_jade.md = require('marked');
            vars_for_jade.history_years = [];
            
            for (var year in vars_for_jade.history) {
                vars_for_jade.history_years.push(year);
            }
            vars_for_jade.history_years.sort(function(x, y) {
                var x_start_year = x.substr(0, 4);
                var y_start_year = y.substr(0, 4);
                if (x_start_year < y_start_year) { return 1; }
                if (x_start_year > y_start_year) { return -1; }
                if (x.length < y.length) { return 1; }
                if (x.length > y.length) { return -1; }
                return 0;
            });

            return vars_for_jade;
        }))
        .pipe(jade())
        .pipe(typogr())
        .pipe(prettify({indent_size: 2})) // Necessary. Otherwise useref flips its shit.
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

gulp.task("styles", function() {
    return gulp.src('src/styles/*.styl')
        .pipe(stylus({'include css': true}))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('dist/styles/'))
        .pipe(connect.reload());
});

gulp.task('connect', function() {
    connect.server({
        root: 'dist',
        port: devserverPort,
        livereload: true
    });
});

gulp.task("watch", function() {
    gulp.watch("src/*.jade", ['templates']);
    gulp.watch("src/data/*.yml", ['templates']);
    gulp.watch("src/js/*.js", ['templates']);
    gulp.watch("src/styles/*.styl", ['styles']);
    gulp.watch("dist/imgs/*", ['image_uris']);
});

gulp.task("default", [
    'templates',
    'connect',
    'watch']);