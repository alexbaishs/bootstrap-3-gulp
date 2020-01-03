var syntax        = 'scss'; // Syntax: sass or scss

var gulp          = require('gulp'), // Сообственно Gulp JS
		gutil         = require('gulp-util' ),
		sass          = require('gulp-sass'), // для компиляции нашего SCSS кода
		browserSync   = require('browser-sync'), // локальный dev сервер с livereload
		concat        = require('gulp-concat'), // Склейка файлов
		uglify        = require('gulp-uglify'), // будет сжимать наш JS
		cleancss      = require('gulp-clean-css'), // будет сжимать наш CSS
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'), // автоматически добавляет вендорные префиксы к CSS свойствам
		notify        = require('gulp-notify'),

		imagemin      = require('gulp-imagemin'), // для сжатия картинок
		pngquant      = require('imagemin-pngquant'), // дополнения к предыдущему плагину, для работы с PNG 
		sourcemaps    = require('gulp-sourcemaps'), // возьмем для генерации css sourscemaps, которые будут помогать нам при отладке кода
		rigger        = require('gulp-rigger'), // позволяет импортировать один файл в другой простой конструкцией //= footer.html
		rimraf        = require('rimraf'); // rm -rf для ноды

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'build'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('styles', function() {
	return gulp.src('src/'+syntax+'/**/*.'+syntax+'')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	//.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('build/css'))
	.pipe(browserSync.stream())
});

gulp.task('scripts', function() {
	return gulp.src([
		'src/libs/jquery/dist/jquery.min.js',
		'src/libs/js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('build/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function() {
	return gulp.src('src/*.html')
  .pipe(rigger()) //Прогоним через rigger
	.pipe(gulp.dest('build'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('watch', function() {
	gulp.watch('src/'+syntax+'/**/*.'+syntax+'', gulp.parallel('styles'));
	gulp.watch('src/**/*.js', gulp.parallel('scripts'));
	gulp.watch('src/**/*.html', gulp.parallel('code'))
});

gulp.task('default', gulp.parallel('watch', 'code', 'styles', 'scripts', 'browser-sync'));
