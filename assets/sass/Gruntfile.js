module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    var buildCacheDir = '~build-cache';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        compass: {
            options: {
                //config: 'config.rb',
                outputStyle: 'compressed',
                noLineComments: true,
                force: true,
                sassDir: 'src',
                require: 'bootstrap-sass'
            },

            build: {
                options: {
                    noLineComments: false,
                    //outputStyle: 'expanded',

                    httpPath: './',

                    httpImagesPath: '../images',
                    imagesDir: '../images', // css中图片路径
                    generatedImagesDir: '../images', // 生成图片的存档位置

                    httpFontsDir: '../fonts',
                    fontsDir: '../fonts', // css中字体路径

                    cssDir: '../css'
                }
            }
        },

        copy: {
            build: {
                filter: 'isFile'
            }
        },

        watch: {
            specify: {
                options: {
                    nospawn: true
                },
                files: ['src/**/*.scss'],
                filter: 'isFile'
            }
        },

        clean: {
            build: [buildCacheDir]
        }
    });


    // 监听处理
    grunt.event.on('watch', function(action, filePath, target) {

        if (/scss$/.test(filePath) == false) {
            return false;
        }

        grunt.log.writeln("\n========== watch trigger ==========\n");

        grunt.log.ok('"' + filePath + '" 内容发生变化，开始寻找主编译文件.');

        //var targetPath = getCompileFile(filePath);
        var targetPath = 'src/page.scss';
        if (targetPath) {

            grunt.log.ok('主编译文件: "' + targetPath + '" 准备编译.');
            grunt.config.set('compass.build.options.specify', [targetPath]);
            grunt.task.run('compass:build');
        } else {
            grunt.log.error('"' + filePath + '" 找不到主编译文件.');
        }

        return false;
    });

    // 对单独文件打包
    // sudo grunt build --target=module
    grunt.registerTask('build', '', function() {
        var target = grunt.option('target') || '';

        if (!target) {
            grunt.log.error('target error');
            return false;
        }

        var srcRootPath = 'src/' + target;

        var package = grunt.file.readJSON(srcRootPath + '/package.json');

        var targetScssPath = srcRootPath + '.scss';
        var targetCssName = package.name + '.css';
        var distPath =  'dist/' + package.name + '/' + package.version + '/';

        grunt.log.ok('targetScssPath：' + targetScssPath);
        grunt.log.ok('buildCacheDir：' + buildCacheDir);

        // 把scss编译到缓存文件夹中
        grunt.config.set('compass.build.options.specify', [targetScssPath]);
        grunt.config.set('compass.build.options.cssDir', [buildCacheDir]);


        // 缓存文件夹中转移到目标目录
        grunt.log.ok('copy src：' + buildCacheDir + '/' + targetCssName);
        grunt.log.ok('distPath：' + distPath);
        grunt.config.set('copy.build', {
            src: buildCacheDir + '/' + target + '.css',
            dest: distPath + '/' + targetCssName
        });

        // run
        grunt.task.run('compass:build');
        grunt.task.run('copy:build');
        grunt.task.run('clean:build');
    });

    grunt.registerTask('default', ['watch:specify']);
    grunt.registerTask('dev', ['compass:dev']);

    // Help
    // ----------------------------------
    function isWinPath(filePath) {
        return /\\/.test(filePath);
    }

    function path2Arr(filePath) {
        var delimiter = isWinPath(filePath) ? '\\' : '/';
        return filePath.split(delimiter);
    }

    /**
     * 寻找主编译文件
     * src/m/home/_index.scss
     * src/m/home/_feed.scss
     * src/m/home/_sidebar.scss
     * src/m/home/sidebar/_person.mod.scss
     *  =>
     * src/m/home/home.scss
     *
     * @param filePath
     * @returns {*}
     */
    function getCompileFile(filePath) {
        var pathArr = path2Arr(filePath);

        var hasUnderline = /_.+\.scss$/.test(filePath);

        if (hasUnderline) {
            var pathNode, parentPath;
            while (pathNode = pathArr.pop()) {
                if (pathArr.length < 2) {
                    return false;
                }

                parentPath = pathArr.join('/') + '.scss';
                if (grunt.file.exists(parentPath)) {
                    return parentPath;
                }
            }

            return false;
        }

        return filePath;
    }
};