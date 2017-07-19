import gulp from 'gulp';
import cached from 'gulp-cached';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import pug from 'gulp-pug';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import named from 'vinyl-named';
import webpack from 'webpack-stream';
import remember from 'gulp-remember';

const path = {
    pages: {
        target: 'pages/**/*.pug',
        output: 'gh-pages',
        sourcemaps: false,
        pipelining: [ pug() ]
    },
    styles: {
        target: 'pages/styles/**/*.scss',
        output: 'gh-pages/assets',
        sourcemaps: '/pages/styles',
        pipelining: [
            sass().on('error', sass.logError),
            postcss([ autoprefixer({ browsers: [ 'last 5 versions' ], cascade: false }), cssnano ])
        ]
    },
    scripts: {
        target: 'pages/scripts/**/*.js',
        output: 'gh-pages/assets',
        sourcemaps: false,
        pipelining: [
            named(),
            webpack({
                devtool: 'source-map',
                module: { loaders: [ { test: /\.js$/, loader: 'babel-loader', query: { presets: [ 'es2015' ], plugins: [ 'transform-runtime' ] } } ] },
                output: { filename: '[name].js' }
            })
        ]
    },
    libraries: {
        target: 'sources/**/*.js',
        output: 'libraries',
        sourcemaps: '/sources',
        pipelining: [ babel({ plugins: [ 'transform-es2015-modules-commonjs', 'transform-runtime' ] }) ]
    }
};

for(const [ task, option ] of Object.keys(path).map(name => [ `build:${name}`, path[name] ])) {
    gulp.task(task, () => {
        let pipeline = gulp.src(option.target);

        if(option.sourcemaps) {
            pipeline = pipeline.pipe(sourcemaps.init());
        }

        for(const item of option.pipelining) {
            pipeline = pipeline.pipe(item);
        }

        if(option.sourcemaps) {
            pipeline = pipeline.pipe(sourcemaps.write({ includeContent: false, sourceRoot: option.sourcemaps }));
        }

        return pipeline.pipe(remember(task)).pipe(gulp.dest(option.output));
    });
}

gulp.task('build', [ 'build:libraries' ]);
gulp.task('pages', [ 'build:pages', 'build:styles', 'build:scripts' ]);

gulp.task('watch', () => {
    for(const [ task, target ] of Object.keys(path).map(name => [ `build:${name}`, path[name].target ])) {
        gulp.watch(target, [ task ]).on('change', event => {
            if(event.type !== 'deleted') {
                return;
            }

            Reflect.deleteProperty(cached.caches[task], event.path);
            remember.forget(task, event.path);
        });
    }
});

gulp.task('default', [ 'build' ]);
