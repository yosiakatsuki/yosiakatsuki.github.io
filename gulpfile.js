var gulp					 = require('gulp');
var plumber				 = require('gulp-plumber');
var watch					 = require('gulp-watch');
var rename				 = require('gulp-rename');
var sass					 = require('gulp-sass');
var cleanCSS 			 = require('gulp-clean-css');
var autoprefixer	 = require('gulp-autoprefixer');
var uglify				 = require('gulp-uglify');
var browserSync		 = require('browser-sync');
var coffee				 = require('gulp-coffee');
//難あり
var cmq						 = require('gulp-combine-media-queries');

/**
 * ルートdir
 * @type {String}
 */
var root = './';

/**
 * browserSyncで監視するファイル
 */
var bS_WatchFiles = [
	root + 'css/*.min.css',
	root + 'js/*.min.js',
	root + '**/*.php'
];

/**
 * browserSyncのオプション
 */
var bS_Options = {
	// proxy: "yosiakatsuki.github.dev",
	open : "external",
	port : "3000"
};

/**
 * sassコンパイルの対象
 */
var src_sass = [
	root + 'sass/**/*.scss'
]

/**
 * css圧縮処理等の対象
 */
var src_css = [
	root + 'css/*.css',
	'!' + root + 'css/*.min.css',
]
var dest_css = root + 'css';

/**
 * js圧縮処理等の対象
 */
var src_js = [
	root + 'js/*.js',
	'!' + root + 'js/*.min.js'
]
var dest_js = root + 'js';

/**
 * CoffeeScriptのコンパイル対象
 */
var src_coffee = [
	root + 'coffee/*.coffee'
]

/**
 * sassコンパイル
 */
gulp.task('sass', function() {
	gulp.src(src_sass)
		.pipe(plumber({
			errorHandler: function(err) {
				console.log(err.messageFormatted);
				this.emit('end');
			}
		}))
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ["last 2 versions", "ie >= 11", "Android >= 4","ios_saf >= 8"],
			cascade: false
		}))
		.pipe(gulp.dest(dest_css));
});


/**
 * css圧縮
 */
gulp.task('mincss', function() {
	gulp.src(src_css)
		.pipe(plumber({
			errorHandler: function(err) {
				console.log(err.messageFormatted);
				this.emit('end');
			}
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(cleanCSS())
		.pipe(gulp.dest(dest_css));
});

/**
 * coffeeスクリプトコンパイル
 */
gulp.task('coffee', function() {
	gulp.src(src_coffee)
		.pipe(plumber({
			errorHandler: function(err) {
				console.log(err.messageFormatted);
				this.emit('end');
			}
		}))
		.pipe(coffee())
		.pipe(gulp.dest(dest_js));
});



/**
 * js圧縮
 */
gulp.task('minjs', function() {
	gulp.src(src_js)
		.pipe(plumber({
			errorHandler: function(err) {
				console.log(err.messageFormatted);
				this.emit('end');
			}
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify({preserveComments: 'some'}))
		.pipe(gulp.dest(dest_js));
});


/**
 * browser-sync init
 */
gulp.task('bs-init', function() {
	browserSync.init(bS_Options);
});

/**
 * browser-sync reload
 */
gulp.task('bs-reload', function() {
	browserSync.reload()
});


/**
 * メディアクエリをキレイにまとめる
 */
gulp.task('cmq', function() {
	gulp.src(src_css)
		.pipe(plumber({
			errorHandler: function(err) {
				console.log(err.messageFormatted);
				this.emit('end');
			}
		}))
		.pipe(cmq({log: true}))
		.pipe(gulp.dest('./css/cmq/'));
});




/**
 * watch
 */
gulp.task('watch',['sass'],function() {
	/**
	 * sassコンパイル
	 */
	watch(src_sass, function(event) {
		gulp.start('sass');
	});
	/**
	 * JSのコンパイル
	 */
	watch(src_js, function(event) {
		gulp.start('minjs');
	});
	/**
	 * CSSの圧縮
	 */
	watch(src_css, function(event) {
		gulp.start('mincss');
	});
});

/**
 * browserSync
 */
gulp.task('watch-bs',['bs-init','watch'],function() {
	watch(bS_WatchFiles, function(event) {
		gulp.start('bs-reload');
	});
});

/**
 * sassコンパイルのみ
 */
gulp.task('watch-sass',['sass'],function() {
	watch(src_sass, function(event) {
		gulp.start('sass');
	});
});