var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};
var nconf = require('nconf');
var FTPClient = require('ftp');
var fs = require('fs');
var AWS = require('aws-sdk');
module.exports = function (grunt)  {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        mongodump: {
            path: "mystore-db-<%= grunt.template.today('dd-mm-yyyy') %>-<%= grunt.template.today('HH-MM-ss') %>"
        },

        deletefile: {
            path: "dump_<%= grunt.template.today('dd-mm-yyyy') %>_<%= grunt.template.today('HH-MM') %>"
        },

        dump: {
            path: '<%=target_path%>'
        },

        restore: {
            path: '<%=target_path%>'
        },

        generateBuild: {
            buildNumber: '<%=number%>'
        },

        nodemon: {
            prod: {
                options: {
                    file: 'dist/latest/app/index.js',
                    env: {
                        PORT: '3000'
                    },
                    cwd: __dirname
                }
            },
            exec: {
                options: {
                    exec: 'less'
                }
            }
        },
        karma: {
            e2e: {
                configFile: 'karma-e2e.conf.js',
                singleRun: true
            },
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            },
            basictest: {
                configFile: "karma-basictest.conf.js"
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        'app/frontend/js/{,*/}*.js',
                        'app/frontend/css/{,*/}*.css',
                        'app/frontend/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                        'app/frontend/font/*'
                    ]
                }
            }
        },
        concat: {
            options: {
                separator: '\n/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/\n\n'
            },
            vendor2Css: {
                src: [
                    "dist/<%=target%>/app/frontend/css/new/jquery-ui.custom.min.css",
                    "dist/<%=target%>/app/frontend/css/new/font-awesome.min.css",
                    "dist/<%=target%>/app/frontend/css/new/bootstrap.min.css",
                    "dist/<%=target%>/app/frontend/css/dropzone.css",
                    "dist/<%=target%>/app/frontend/css/angular-material-1.1.0.min.css",
                    "dist/<%=target%>/app/frontend/mobihippo/css/theme.css"
                ],
                dest: 'dist/<%=target%>/app/frontend/css/vendor2.css'
            },
            mcmsJs: {
                src: [
                    "dist/<%=target%>/app/frontend/js/ms.js",
                    "dist/<%=target%>/app/frontend/js/ms-module.js",
                    "dist/<%=target%>/app/frontend/js/ms-controllers.js",
                    "dist/<%=target%>/app/frontend/js/ms-widgetDirectives.js",
                    "dist/<%=target%>/app/frontend/js/user.js",
                    "dist/<%=target%>/app/frontend/js/store.js",
                    "dist/<%=target%>/app/frontend/js/datatable.js",
                    "dist/<%=target%>/app/frontend/mobihippo/js/datatable.js",
                    "dist/<%=target%>/app/frontend/js/mform.js",
                    "dist/<%=target%>/app/frontend/js/validation.js",
                    "dist/<%=target%>/app/frontend/js/mcms/mcms-sourcefunctions.js",
                    "dist/<%=target%>/app/frontend/js/mcms/mcms-commandprocessors.js",
                    "dist/<%=target%>/app/frontend/js/mcms/mcms-commandhandlers.js",
                    "dist/<%=target%>/app/frontend/js/mcms/mcms-eventhandlers.js",
                    "dist/<%=target%>/app/frontend/js/mcms/mcms-formatters.js",
                    "dist/<%=target%>/app/frontend/js/mcms/mcms-fieldsettings.js",
                    "dist/<%=target%>/app/frontend/js/ms-adminCtrls.js",
                    "dist/<%=target%>/app/frontend/js/mcms/WidgetPreviewCtrl.js"
                ],
                dest: 'dist/<%=target%>/app/frontend/js/mcms.js'
            },
            mystoreJs: {
                src: [
                    "dist/<%=target%>/app/frontend/js/ms.js",
                    "dist/<%=target%>/app/frontend/js/ms-module.js",
                    "dist/<%=target%>/app/frontend/js/ms-controllers.js",
                    "dist/<%=target%>/app/frontend/js/ms-controllers2.js",
                    "dist/<%=target%>/app/frontend/js/ms-widgetDirectives.js",
                    "dist/<%=target%>/app/frontend/js/validation.js",
                    "dist/<%=target%>/app/frontend/js/mform.js",
                    "dist/<%=target%>/app/frontend/js/datatable.js",
                    "dist/<%=target%>/app/frontend/js/user.js",
                    "dist/<%=target%>/app/frontend/js/store.js",
                    "dist/<%=target%>/app/frontend/js/cart.js",
                    "dist/<%=target%>/app/frontend/js/mystore-functions.js"
                ],
                dest: "dist/<%=target%>/app/frontend/js/mystore.js"
            },
            mystoreNewJs: {
                src: [
                    "dist/<%=target%>/app/frontend/js/ms.js",
                    "dist/<%=target%>/app/frontend/js/ms-module.js",
                    "dist/<%=target%>/app/frontend/js/ms-controllers.js",
                    "dist/<%=target%>/app/frontend/js/validation.js",
                    "dist/<%=target%>/app/frontend/js/user.js",
                    "dist/<%=target%>/app/frontend/js/store.js",
                    "dist/<%=target%>/app/frontend/js/cart.js",
                    "dist/<%=target%>/app/frontend/js/mystore-functions.js"
                ],
                dest: "dist/<%=target%>/app/frontend/js/mystore_new.js"
            },
            vendorcss: {
                src: [
                    "dist/<%=target%>/app/frontend/css/new/jquery-ui.custom.min.css",
                    "dist/<%=target%>/app/frontend/css/new/chosen.min.css",
                    "dist/<%=target%>/app/frontend/new/datepicker.min.css",
                    "dist/<%=target%>/app/frontend/css/new/bootstrap-timepicker.min.css",
                    "dist/<%=target%>/app/frontend/css/new/daterangepicker.min.css",
                    "dist/<%=target%>/app/frontend/css/new/bootstrap.min.css",
                    "dist/<%=target%>/app/frontend/css/new/ace.min.css",
                    "dist/<%=target%>/app/frontend/css/mcms.css",
                    "dist/<%=target%>/app/frontend/css/datetimepicker.css",
                    "dist/<%=target%>/app/frontend/css/dropzone.css"
                ],
                dest: 'dist/<%=target%>/app/frontend/css/vendor.css'
            }

        },

        cssmin: {
            combine: {
                files: {
                    'dist/<%=target%>/app/frontend/css/vendor.min_<%=number%>.css': ['dist/<%=target%>/app/frontend/css/vendor.css'],
                    'dist/<%=target%>/app/frontend/css/vendor2.min_<%=number%>.css': ['dist/<%=target%>/app/frontend/css/vendor2.css']
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    'dist/<%=target%>/app/frontend/js/mcms.min_<%=number%>.js': ['dist/<%=target%>/app/frontend/js/mcms.js'],
                    'dist/<%=target%>/app/frontend/js/mystore.js': ['dist/<%=target%>/app/frontend/js/mystore.js'],
                    'dist/<%=target%>/app/frontend/js/mystore_new.js': ['dist/<%=target%>/app/frontend/js/mystore_new.js']
                }
            }
        },

        htmlrefs: {
            dist: {
                /** @required  - string including grunt glob variables */
                src: 'dist/<%=target%>/app/frontend/mobiadmin.html',
                dest: 'dist/<%=target%>/app/frontend/mobiadmin.html'
                /** @optional  - string directory name*/
            },
            options: {
                buildNumber: '<%=number%>',
                buildnew: '<%=vernumb%>',
                env: '<%=env%>',
                tag: '<%=branch%>'
            }
        },

        clone: {
            path: 'code'
        },

        symbolic: {
            path: '<%=target%>'
        },

        fetchdump: {
            options: {
                user: '<%=nconf.get()%>',
                password: '<%=nconf.get()%>'
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'code/', src: ['**'], options: {mode: true}, dest: 'dist/<%=target%>/'} // includes files in path and its subdirs
                ]
            }
        },

        clean: {
            build: {
                src: ["app/index.js"]
            }
        },

        compres: {
            path: "<%=target_path%>"
        },

        time: {
            path: "dist_<%= grunt.template.today('dd-mm-yyyy') %>_<%= grunt.template.today('HH:MM:ss') %>"
        },

        tag: {
            path: "<%= grunt.template.today('dd-mm-yyyy') %>_<%= grunt.template.today('HH:MM:ss') %>"
        },

        backup: {

            path: "mongobackup-<%= grunt.template.today('dd-mm-yyyy') %>-<%= grunt.template.today('HH:MM:ss') %>"

        },

        test: {

            buildNumber: '<%=number%>'

        },

        release: {

            options: {
                tagName: '<%= version %>', //default: '<%= version %>'
                npm: false,

            }
        }
    });

    grunt.registerMultiTask('test', 'test ', function () {

        console.log('number', this.data);


    });

    grunt.registerMultiTask('backup', 'use to create backup of database on s3 server', function () {
        var exec = require('child_process').exec;
        var done = this.async();
        var cmd = 'aws s3 cp /var/mongodump/dump/ s3://storehippo_backup/' + this.data + '  --recursive'
        exec(cmd, {encoding: 'binary', maxBuffer: 94475851 * 1024}, function (error, stdout, stderr) {
            if (!error) {
                console.log(stderr);
                done();
            }
            else {
                console.log(error);
            }
        });
    });

    grunt.registerTask('s3backup', function () {
        var exec = require('child_process').exec;
        var done = this.async();
        var targz = require('tar.gz');
        var path = '/var/mongodump/dumpstore/';
//        var path='/home/pawan/mongodump/dumpstore/';
        var cmd = 'ls ' + path;
        exec(cmd, function (error, stdout, stderr) {
            var c = stdout.split('\n');
            compres(c);

            function compres(c) {
                if (c.length == 1) {
                    done();
                    return;
                }
                var file = c.shift();
                var d = new Date();
                var date = d.getDate()
                var year = d.getFullYear()
                var month = d.getMonth();
                var hours = d.getHours();
                month = month + 1;
                var time = year + '-' + month + '-' + date + ':' + hours;
                var dir = file + '_' + time;
                var source = path + file;
                var fol = dir + '.tar.gz';
                var des = '/var/mongodump/dumpstorezip/' + fol;
//                var des = '/home/pawan/mongodump/dumpstorezip/' + fol;

                var compress = new targz().compress(source, des, function (err) {

                    if (err) throw err;

                    putfile(file, des, function () {
                        compres(c);
                    });
                });

                function putfile(file, des, next) {
                    var cmd3 = "aws s3 mv " + des + " s3://storehippo_backup/backup/" + file + '/' + fol;

                    exec(cmd3, function (error, stdout, stderr) {
                        if (error) throw error;
                        next();
                    });
//                    next()
                }
            }
        });
    });

    grunt.registerTask('dumpstore', 'create archive through Tarsnap', function () {
        var exec = require('child_process').exec;
        var done = this.async();
//        var cmd = "node app/dumpstore.js" ;
        var cmd = "node app/scripts/dumpstore.js";
        exec(cmd, {encoding: 'binary', maxBuffer: 94475851 * 1024}, function (error, stdout, stderr) {
            if (error) throw  error;

            done();
        });
    });

    grunt.registerTask('remove', '', function () {
        var exec = require('child_process').exec;
        var done = this.async();
//        var cmd1 = 'rm -r /home/pawan/mongodump/dumpstore/*';
//        var cmd = 'ls /home/pawan/mongodump/dumpstore/';
        var cmd = 'ls /var/mongodump/dumpstore/';
        var cmd1 = 'rm -r /var/mongodump/dumpstore/*';
        exec(cmd, function (error, stdout, stderr) {
            if (error) throw error;
            if (stdout.length != 0) {
                exec(cmd1, function (error, stdout, stderr) {

                });
            }
            else {
                console.log('empty folder');
            }
            done();
        });
    });

    grunt.registerTask('mongodump', function () {
        grunt.task.run('remove', 'dumpstore', 's3backup');
    });

    grunt.registerTask('s3backup1', 'use to create backup of database on s3 server', function () {
        var exec = require('child_process').exec;
        var done = this.async();
        var cmd = 'ls /var/mongodump/dump/';
        exec(cmd, {encoding: 'binary', maxBuffer: 94475851 * 1024}, function (error, stdout, stderr) {

            if (error) throw error;
            var stdout = stdout.split('\n');

            stdout.forEach(function (data) {
                var d = new Date();
                var date = d.getDate()
                var year = d.getFullYear()
                var month = d.getMonth();
                var hours = d.getHours();
                var time = year + '-' + month + '-' + date + ':' + hours;
                var dir = data + '_' + time;
                var cmd2 = "aws s3 cp /var/mongodump/dump/" + data + '/' + " s3://storehippo_backup/backup/" + data + '/' + dir + '  --recursive';
                exec(cmd2, {encoding: 'binary', maxBuffer: 94475851 * 1024}, function (error, stdout, stderr) {
                    if (error) throw error;
                    done();
                });
            });

        });
    });

    grunt.registerTask('list', 'move file ', function (n) {
        var exec = require('child_process').exec;
        var done = this.async();
        var cmd = 'aws s3 ls s3://storehippo_backup/';
//        var cmd ='ls /home/pawan/dump/';
//        var cmd ='ls /home/pawan/project/new/mystore/pawan/';
        console.log('command', cmd);
        exec(cmd, function (error, stdout, stderr) {
            console.log('in here', n)
            if (error) throw error;
            var dir = stdout.split('\n');
            dir.forEach(function (file) {
                var file = file.split('PRE ')
                var file2 = file[1];
                if (file2 != undefined) {
                    var file3 = file2.replace(' ', '');

                    var cmd1 = cmd + file3;
                    console.log('command1', cmd1)
                    exec(cmd1, function (error, stdout, stderr) {
                        console.log('stdout======', stdout)
                        var tt = stdout.split('\n');
                        var file = tt.split('PRE ')
                        var file2 = file[1];
                        if (file2 != undefined) {
                            var file3 = file2.replace(' ', '');
                            file3.forEach(function (l) {

                                if (l == n) {
                                    console.log('in here', file + '/' + l);
                                }

                            })
                        }
                    });
                }
            })

        });
    });

    grunt.registerMultiTask('compres', 'git pull into main directory', function () {
        var exec = require('child_process').exec;
        var done = this.async();
        console.log(this.data)
        var targz = require('tar.gz');
//        var compress = new targz().compress('/home/pawan/mongodump/'+this.data,'/home/pawan/mongozip/'+this.data+'.tar.gz', function(err){
        var compress = new targz().compress('/var/mongodump/dump/', '/var/mongozip/' + this.data + '.tar.gz', function (err) {
            if (!err) {
                console.log('compression completed');
                done();
            }
            else {
                console.log(err);
            }

        });
    });

    grunt.registerMultiTask('time', function () {
        var done = this.async();
        var time = this.data;
        grunt.config.set('target', time);
        done();
        console.log(time);
    });

    var dataObj = null;
    var target = "";
    if (fs.existsSync('/etc/env.json')) {
        var data = fs.readFileSync('/etc/env.json', 'utf8');
        dataObj = JSON.parse(data);
        target = dataObj['env'];
    }
    else {
        dataObj = {
            env: "devhippo"
        };
        target = dataObj['env'];
    }

    if (!process.env.AWS_ACCESS_KEY_ID) {
        process.env.AWS_ACCESS_KEY_ID = dataObj.accessKeyId;
        process.env.AWS_SECRET_ACCESS_KEY = dataObj.secretAccessKey;
        process.env.AWS_DEFAULT_REGION = dataObj.region;
    }

    grunt.option(target);
    var tag = grunt.option('tag');
    if (tag && String(tag).length < 14) {
        tag = "0" + tag;
    }

    /*for regular deployment on devhippo*/
    grunt.registerTask('deploy', 'number', function (n)  {
        if (n != null) {
            var numb = n;
            grunt.config.set('vernumb', numb);
        }
        else {
            var numb = '1';
            grunt.config.set('vernumb', numb);
        }
        grunt.config.set('env', target);
        if (!tag)  {
            grunt.config.set('branch', 'newmaster')
        }
        grunt.task.run('pull', 'clone', 'reDeploy', 'time', 'copy', 'version', 'concat', 'uglify', 'cssmin', 'htmlrefs', 'symbolic', 'generateBuild', 'moveMcmsJStos3', 'moveVendorCSStos3', 'moveMystoreJStoS3', 'moveDesignJStoS3', 'uploadAdminTheme', 'npmInstall', 'pm2Reload', 'changePermission', 'deleteOldDist', 'cleanindex');
    });

    /*creating tag after deployment on staging */
    grunt.registerTask('deploynew', "deploy code from master branch", function (n) {
        console.log('here in number during deploy', target, n);
        if (n != null) {
            var numb = n;
            grunt.config.set('vernumb', numb);
        }
        else {
            var numb = '1';
            grunt.config.set('vernumb', numb);
        }
        grunt.config.set('env', target);
        if (!tag) {
            grunt.config.set('branch', 'newmaster')
        }
        grunt.task.run('checkoutAndresethard', 'pull', 'clone', 'time', 'copy', 'concat', 'version', 'tag', 'uglify', 'cssmin', 'htmlrefs', 'symbolic', 'generateBuild', 'moveMcmsJStos3', 'moveVendorCSStos3', 'moveMystoreJStoS3', 'moveDesignJStoS3', 'uploadAdminTheme', 'npmInstall', 'pm2Reload', 'deleteOldDist', 'cleanindex');
    });

    /*creating tag after deployment on staging */
    grunt.registerTask('patchnew', "patching code from existing branch to new patch", function (n) {
        console.log('here in number during patch', target, n);
        if (n != null) {
            var numb = n;
            grunt.config.set('vernumb', numb);
        }
        else {
            var numb = '1';
            grunt.config.set('vernumb', numb);
        }
        grunt.config.set('env', target);
        if (!tag) {
            grunt.config.set('branch', 'newmaster')
        }
        grunt.task.run('checkoutAndresethard', 'pull', 'clone', 'time', 'copy', 'concat', 'version', 'tagVersion', 'uglify', 'cssmin', 'htmlrefs', 'symbolic', 'generateBuild', 'moveMcmsJStos3', 'moveVendorCSStos3', 'moveMystoreJStoS3', 'moveDesignJStoS3', 'uploadAdminTheme', 'npmInstall', 'pm2Reload', 'deleteOldDist', 'cleanindex');
    });

    /*deploy on production servers on the base of last tag deployed on staging*/
    grunt.registerTask('deployexisting', tag, function (n) {
        console.log('here in number during deploy', target, tag);
        if (n != null) {
            var numb = n;
            grunt.config.set('vernumb', numb);
        }
        else {
            var numb = '1';
            grunt.config.set('vernumb', numb);
        }
        grunt.config.set('env', target);
        grunt.config.set('tag', tag);
        grunt.config.set('branch', tag);
        grunt.task.run('pull', 'clone', 'time', 'copy', 'concat', 'version', 'uglify', 'cssmin', 'htmlrefs', 'symbolic', 'generateBuild', 'moveMcmsJStos3', 'moveVendorCSStos3', 'moveMystoreJStoS3', 'moveDesignJStoS3', 'uploadAdminTheme', 'npmInstall', 'deleteOldDist', 'cleanindex');
    });

    grunt.registerTask('npmInstall', function () {
        var exec = require('child_process').exec;
        var done = this.async();
        var cmd = 'npm install';
        exec(cmd, function (error, stdout, stderr) {
            if (!error) {
                console.log(stdout);
                console.log(stderr);
                done();
            }
            else {
                console.log(error);
            }
        })
    });

    grunt.registerTask('pm2Reload', function () {
        var exec = require('child_process').exec;
        var done = this.async();
        var cmd = 'pm2 reload index';
        exec(cmd, function (error, stdout, stderr) {
            if (!error) {
                console.log(stdout);
                console.log(stderr);
                done();
            }
            else {
                console.log(error);
            }
        })
    });

    grunt.registerMultiTask('tag', function () {
        console.log('here inside creating new tag');
        var done = this.async();
        var exec = require('child_process').exec;
        var time = this.data.replace(/[-_&\/\\#,+()$~%.'":*?<>{}]/g, '');
        var cmd = 'git branch ' + time + ' && git push origin ' + time;
        exec(cmd, function (error, stdout, stderr) {
            console.log(error, stdout, stderr);
            done();
        });
    });

    grunt.registerTask('tagVersion', function () {
        console.log('here inside creating new tagVersion');
        var exec = require('child_process').exec;
        var done = this.async();
        var cmd = 'grunt release';
        exec(cmd, function (error, stdout, stderr) {
            var cmd = 'git rev-parse --abbrev-ref HEAD';
            exec(cmd, function (error, stdout1, stderr) {
                var abc = (stdout1.replace('\n', '') + "-" + target);
                cmd = 'git describe --abbrev=0 --tags';
                exec(cmd, function (error, stdout, stderr) {
                    var xyz = (abc + "-" + stdout.replace('\n', ''));
                    var cmd = 'git tag ' + xyz + ' && git push origin ' + xyz;
                    exec(cmd, function (error, stdout, stderr) {
                        console.log(error, stdout, stderr);
                        done();
                    });
                })
            })
        })
    });

    grunt.registerTask('cleanindex', function () {
        console.log('here inside clenaindex');
        var exec = require('child_process').exec;
        var done = this.async();
        var cmd = 'rm -r app/index.js';
        exec(cmd, function (error, stdout, stderr) {
            console.log("command executed=====", error, stdout, stderr);
            done();
        });
    });

    grunt.registerTask('checkoutAndresethard', function () {
        console.log('here inside resetHardAndCheckout');
        var exec = require('child_process').exec;
        var done = this.async();
        if (tag) {
            var cmd = 'git checkout master && git reset --hard';
            exec(cmd, function (error, stdout, stderr) {
                console.log("command executed=====", error, stdout, stderr);
                done();
            });
        } else {
            console.log('inside else======');
            done();
        }

    });

    grunt.registerTask('moveUglifyJStos3', function () {
        var done = this.async();
        var s3Stream = require('s3-upload-stream'),
            zlib = require('zlib')
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_DEFAULT_REGION,
            maxRetries: 15,
            logger: process.stdout
        });
        var s3 = new AWS.S3();
        s3Stream.client(s3);
        var version = fs.readFileSync(__dirname + '/dist/latest/app/frontend/version.txt');


        function checkAndUploadFile(remoteVendorPath, vendorPath, cb) {
            //var remoteVendorPath = 'global/assets/vendor/js/vendor.min_' + version + '.js';
            console.log('here is vendor remote path===', remoteVendorPath);
            var params = {
                Bucket: 'mystore.in',
                Key: remoteVendorPath
            }
            s3.headObject(params, function (err, metadata) {
                console.log("moveUglifyJStos3 >>>>>>>>>>>", err, metadata);
                if (err && err.code === 'NotFound') {
                    //var vendorPath = __dirname + '/dist/latest/app/frontend/js/vendor.min_' + version + '.js';
                    console.log('here is vendor path===', vendorPath);
                    var read = fs.createReadStream(vendorPath);
                    var compress = zlib.createGzip();
                    var contentType = 'application/javascript';
                    var contentEncoding = 'gzip';
                    var upload = new s3Stream.upload({
                        Bucket: 'mystore.in',
                        Key: remoteVendorPath,
                        ContentType: contentType,
                        ContentEncoding: contentEncoding,
                        CacheControl: "max-age=315619200000,public",
                        Expires: new Date(new Date().getTime() + 315619200000)
                    });
                    upload.on('error', function (error) {
                        console.log(error);
                    });

                    upload.on('part', function (details) {
                        console.log(details);
                    });

                    upload.on('uploaded', function (details) {
                        console.log(details);
                        cb();
                    });
                    read.pipe(compress).pipe(upload);

                } else {
                    console.log("moveUglifyJStos3 File Already Exists >>> ", remoteVendorPath);
                    cb();
                }
            });
        }

        checkAndUploadFile('global/assets/vendor/js/vendor.min_' + version + '.js',
            __dirname + '/dist/latest/app/frontend/js/vendor.min_' + version + '.js',
            done);

    });

    grunt.registerTask('uploadAdminTheme', "creating and Uploading Admin Theme to S3", function () {

        var done = this.async();
        var s3Stream = require('s3-upload-stream'),
            zlib = require('zlib')
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_DEFAULT_REGION,
            maxRetries: 15,
            logger: process.stdout
        });
        var s3 = new AWS.S3();
        s3Stream.client(s3);

        var version = fs.readFileSync(__dirname + '/dist/latest/app/frontend/version.txt');


        var uploadThemeFile = function (cb) {
            var filename = 'adminthemeinfo-' + version + '.js';
            var remoteAdminThemePath = 'ms/admin/' + filename;

            var params = {
                Bucket: 'mystore.in',
                Key: remoteAdminThemePath

            }
            s3.headObject(params, function (err, metadata) {

                console.log("uploadAdminTheme  >>>>>>>>>>>", err, metadata);

                if (err && err.code === 'NotFound') {
                    require('./app/node_modules/ms-admin').environment = "prd";
                    require('./app/node_modules/ms-app').createAppForStore('adminv1', function (app) {
                        var request = {
                            entityName: 'ms.local_themes',
                            params: {}
                        };
                        app.call('getAdminThemeInfo', request, function (err, response) {

                            var adminThemePath = __dirname + '/dist/latest/app/frontend/ms/admin/' + filename;
                            console.log("adminThemePath >>>>>>>>>>>>>", adminThemePath);
                            var output = "ms_theme = " + JSON.stringify(response.data) + ";";
                            fs.writeFileSync(adminThemePath, output);

                            var read = fs.createReadStream(adminThemePath);
                            var compress = zlib.createGzip();
                            var contentType = 'application/javascript';
                            var contentEncoding = 'gzip';
                            var upload = new s3Stream.upload({
                                Bucket: 'mystore.in',
                                Key: remoteAdminThemePath,
                                ContentType: contentType,
                                ContentEncoding: contentEncoding,
                                CacheControl: "max-age=315619200000,public",
                                Expires: new Date(new Date().getTime() + 315619200000)
                            });
                            upload.on('error', function (error) {
                                console.log(error);
                            });
                            upload.on('part', function (details) {
                                console.log(details);
                            });
                            upload.on('uploaded', function (details) {
                                console.log(details);
                                cb();
                            });
                            read.pipe(compress).pipe(upload);
                        })
                    })

                } else {
                    console.log("uploadAdminTheme Admin Theme File Already Exists >>> ", remoteAdminThemePath);
                    cb();
                }
            });
        }

        var uploadThemeFile2 = function () {
            var filename = 'adminthemeinfo2-' + version + '.js';
            var remoteAdminThemePath = 'ms/admin/' + filename;

            var params = {
                Bucket: 'mystore.in',
                Key: remoteAdminThemePath

            }
            s3.headObject(params, function (err, metadata) {

                console.log("uploadAdminTheme  >>>>>>>>>>>", err, metadata);

                if (err && err.code === 'NotFound') {
                    var response = {};
                    require('./app/node_modules/ms-admin').environment = "prd";
                    require('./app/node_modules/ms-themes').getAdminThemeInfo({
                        store: {_id: "adminv2"},
                        query: {}
                    }, response, function (err, result) {
                        var adminThemePath = __dirname + '/dist/latest/app/frontend/ms/admin/' + filename;
                        console.log("adminThemePath >>>>>>>>>>>>>", adminThemePath);
                        var output = "ms_theme = " + JSON.stringify(response.data) + ";";
                        fs.writeFileSync(adminThemePath, output);

                        var read = fs.createReadStream(adminThemePath);
                        var compress = zlib.createGzip();
                        var contentType = 'application/javascript';
                        var contentEncoding = 'gzip';
                        var upload = new s3Stream.upload({
                            Bucket: 'mystore.in',
                            Key: remoteAdminThemePath,
                            ContentType: contentType,
                            ContentEncoding: contentEncoding,
                            CacheControl: "max-age=315619200000,public",
                            Expires: new Date(new Date().getTime() + 315619200000)
                        });
                        upload.on('error', function (error) {
                            console.log(error);
                        });
                        upload.on('part', function (details) {
                            console.log(details);
                        });
                        upload.on('uploaded', function (details) {
                            console.log(details);
                            done();
                        });
                        read.pipe(compress).pipe(upload);
                    });
                } else {
                    console.log("uploadAdminTheme2 Admin Theme File Already Exists >>> ", remoteAdminThemePath);
                    done();
                }
            });
        }

        uploadThemeFile2();
    });

    grunt.registerTask('moveMcmsJStos3', function () {
        var done = this.async();
        var s3Stream = require('s3-upload-stream'),
            zlib = require('zlib')
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_DEFAULT_REGION,
            maxRetries: 15,
            logger: process.stdout
        });
        var s3 = new AWS.S3();
        s3Stream.client(s3);
        var version = fs.readFileSync(__dirname + '/dist/latest/app/frontend/version.txt');
        var remotemcmsPath = 'global/assets/mcms/js/mcms.min_' + version + '.js';
        console.log('here is mcms remote path===', remotemcmsPath);

        var params = {
            Bucket: 'mystore.in',
            Key: remotemcmsPath
        }
        s3.headObject(params, function (err, metadata) {

            console.log("moveMcmsJStos3  >>>>>>>>>>>", err, metadata);

            if (err && err.code === 'NotFound') {
                var mcmsPath = __dirname + '/dist/latest/app/frontend/js/mcms.min_' + version + '.js';
                console.log('here is mcms path===', mcmsPath);

                var read = fs.createReadStream(mcmsPath);
                var compress = zlib.createGzip();
                var contentType = 'application/javascript';
                var contentEncoding = 'gzip';
                var upload = new s3Stream.upload({
                    Bucket: 'mystore.in',
                    Key: remotemcmsPath,
                    ContentType: contentType,
                    ContentEncoding: contentEncoding,
                    CacheControl: "max-age=315619200000,public",
                    Expires: new Date(new Date().getTime() + 315619200000)
                });
                upload.on('error', function (error) {
                    console.log(error);
                });

                upload.on('part', function (details) {
                    console.log(details);
                });

                upload.on('uploaded', function (details) {
                    console.log(details);
                    done();
                });
                read.pipe(compress).pipe(upload);

            } else {
                console.log("moveMcmsJStos3 File Already Exists >>> ", remotemcmsPath);
                done();
            }
        });


    });

    grunt.registerTask('moveVendorCSStos3', function () {
        var done = this.async();
        var s3Stream = require('s3-upload-stream'),
            zlib = require('zlib')
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_DEFAULT_REGION,
            maxRetries: 15,
            logger: process.stdout
        });
        var s3 = new AWS.S3();
        s3Stream.client(s3);
        var version = fs.readFileSync(__dirname + '/dist/latest/app/frontend/version.txt');


        var checkAndUploadFile = function (remotevendorCssPath, vendorCssPath, cb) {
            //var remotevendorCssPath = 'global/assets/vendor/css/vendor.min_' + version + '.css';
            console.log('here is mcms css remote path===', remotevendorCssPath);

            var params = {
                Bucket: 'mystore.in',
                Key: remotevendorCssPath
            }
            s3.headObject(params, function (err, metadata) {
                console.log("moveVendorCSStos3 >>>>>>>>>>>", err, metadata);
                if (err && err.code === 'NotFound') {
                    //var vendorCssPath = __dirname + '/dist/latest/app/frontend/css/vendor.min_' + version + '.css';
                    console.log('here is mcms css path===', vendorCssPath);
                    var read = fs.createReadStream(vendorCssPath);
                    var compress = zlib.createGzip();
                    var contentType = 'text/css';
                    var contentEncoding = 'gzip';
                    var upload = new s3Stream.upload({
                        Bucket: 'mystore.in',
                        Key: remotevendorCssPath,
                        ContentType: contentType,
                        ContentEncoding: contentEncoding,
                        CacheControl: "max-age=315619200000,public",
                        Expires: new Date(new Date().getTime() + 315619200000)
                    });
                    upload.on('error', function (error) {
                        console.log(error);
                    });

                    upload.on('part', function (details) {
                        console.log(details);
                    });

                    upload.on('uploaded', function (details) {
                        console.log(details);
                        cb();
                    });
                    read.pipe(compress).pipe(upload);
                } else {
                    console.log("moveVendorCSStos3 File Already Exists >>> ", remotevendorCssPath);
                    cb();
                }
            });
        }


        checkAndUploadFile('global/assets/vendor/css/vendor.min_' + version + '.css',
            __dirname + '/dist/latest/app/frontend/css/vendor.min_' + version + '.css',
            function () {
                checkAndUploadFile('global/assets/vendor/css/vendor2.min_' + version + '.css',
                    __dirname + '/dist/latest/app/frontend/css/vendor2.min_' + version + '.css',
                    function () {
                        done();
                    })
            })
    });

    grunt.registerTask('moveMystoreJStoS3', function () {
        var done = this.async();
        var s3Stream = require('s3-upload-stream'),
            zlib = require('zlib')
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_DEFAULT_REGION,
            maxRetries: 15,
            logger: process.stdout
        });
        var s3 = new AWS.S3();
        s3Stream.client(s3);

        var checkAndUploadFile = function (remotePath, filepath, cb) {
            var params = {
                Bucket: 'mystore.in',
                Key: remotePath
            }
            s3.headObject(params, function (err, metadata) {
                console.log("moveMystoreJStoS3 >>>>>>>>>>>", err, metadata);
                if (err && err.code === 'NotFound') {
                    var read = fs.createReadStream(filepath);
                    var compress = zlib.createGzip();
                    var contentType = 'application/javascript';
                    var contentEncoding = 'gzip';
                    var upload = new s3Stream.upload({
                        Bucket: 'mystore.in',
                        Key: remotePath,
                        ContentType: contentType,
                        ContentEncoding: contentEncoding,
                        CacheControl: "max-age=315619200000,public",
                        Expires: new Date(new Date().getTime() + 315619200000)
                    });
                    upload.on('error', function (error) {
                        console.log(error);
                    });

                    upload.on('part', function (details) {
                        console.log(details);
                    });

                    upload.on('uploaded', function (details) {
                        console.log(details);
                        cb();
                    });
                    read.pipe(compress).pipe(upload);
                } else {
                    console.log("moveMystoreJStoS3 File Already Exists >>> ", remotePath);
                    cb();
                }
            })
        }
        var version = fs.readFileSync(__dirname + '/dist/latest/app/frontend/version.txt');
        var remotePath = 'global/assets/mystore/js/mystore-' + version + '.js';
        var filepath = __dirname + '/dist/latest/app/frontend/js/mystore.js';
        checkAndUploadFile(remotePath, filepath, function () {
            var remotePath = 'global/assets/mystore/js/mystore_new-' + version + '.js';
            var filepath = __dirname + '/dist/latest/app/frontend/js/mystore_new.js';
            checkAndUploadFile(remotePath, filepath, function () {
                done();
            });
        });
    });

    grunt.registerTask('moveDesignJStoS3', function () {
        var done = this.async();
        var s3Stream = require('s3-upload-stream'),
            zlib = require('zlib')
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_DEFAULT_REGION,
            maxRetries: 15,
            logger: process.stdout
        });
        var s3 = new AWS.S3();
        s3Stream.client(s3);
        var version = fs.readFileSync(__dirname + '/dist/latest/app/frontend/version.txt');

        var filename = 'designthemeinfo-' + version + '.js';
        var remoteDesignThemePath = 'ms/design/' + filename;

        var params = {
            Bucket: 'mystore.in',
            Key: remoteDesignThemePath

        }
        s3.headObject(params, function (err, metadata) {

            console.log("uploadDesignTheme  >>>>>>>>>>>", err, metadata);

            if (err && err.code === 'NotFound') {
                var response = {};
                require('./app/node_modules/ms-admin').environment = "prd";
                require('./app/node_modules/ms-themes').getDesignThemeInfo({
                    store: {_id: "adminv2"},
                    query: {}
                }, response, function (err, result) {
                    var designThemePath = __dirname + '/dist/latest/app/frontend/ms/admin/' + filename;
                    console.log("designThemePath >>>>>>>>>>>>>", designThemePath);
                    var output = "design_theme = " + JSON.stringify({
                        templates: response.data.templates,
                        widgets: response.data.widgets
                    }) + ";";
                    fs.writeFileSync(designThemePath, output);

                    var read = fs.createReadStream(designThemePath);
                    var compress = zlib.createGzip();
                    var contentType = 'application/javascript';
                    var contentEncoding = 'gzip';
                    var upload = new s3Stream.upload({
                        Bucket: 'mystore.in',
                        Key: remoteDesignThemePath,
                        ContentType: contentType,
                        ContentEncoding: contentEncoding,
                        CacheControl: "max-age=315619200000,public",
                        Expires: new Date(new Date().getTime() + 315619200000)
                    });
                    upload.on('error', function (error) {
                        console.log(error);
                    });
                    upload.on('part', function (details) {
                        console.log(details);
                    });
                    upload.on('uploaded', function (details) {
                        console.log(details);
                        done();
                    });
                    read.pipe(compress).pipe(upload);
                });
            } else {
                console.log("Design Theme File Already Exists >>> ", remoteDesignThemePath);
                done();
            }
        });
    });

    //latest commit id
    var _ = grunt.util._;
    var exec = require('child_process').exec;

    grunt.registerTask('version', 'get the latest commit id', function () {
        var options = this.options({
            id: false, // show emails in the output
            nomerges: false, // only works when sorting by commits
            output: './AUTHORS.txt' // the output file
        });
        var done = this.async();
        var _format = function (stdout) {
            var maxcol = 0;
            var pad = ' ';
            return stdout.replace(/^\s+|\s+$/g, '').split('\n').map(function (l) {
                var numl = l.match(/\d+/);
                if (numl) {
                    numl = numl[0].length;
                    maxcol = numl > maxcol ? numl : maxcol;
                    pad = '  ' + new Array(maxcol - numl + 1).join(' ');
                }
                return _.trim(l.replace(/\t+/, pad));
            });
        };
        // sort types
        var sortMethod = {
            alphabetical: 'sort',
            chronological: 'reverse'
        };
        // sort output
        var _sort = function (stdout) {
            if (sortMethod[options.sort]) {
                stdout = _.unique(stdout[sortMethod[options.sort]]());
            }
            return stdout;
        };
        // default command 'git'
        var cmd = 'git --git-dir=code/.git rev-parse --short HEAD';     //get the latest commit id in short version
        cmd += '';
        exec(cmd, function (error, stdout, stderr) {
            if (!error) {
                stdout = _format(stdout);
                stdout = _sort(stdout);
                var v = stdout.join('\n');
                console.log(v);
                grunt.config.set('number', v);
                done();
            } else {
                grunt.fail.warn(error);
            }
        })
    });

    grunt.registerTask('pull', 'git pull into main directory', function () {
        var exec = require('child_process').exec;
        var done = this.async();
        if (!tag) {
            var cmd = 'git pull ';

        } else {
            var cmd = 'git init && git fetch && git checkout ' + tag + ' && git pull';
        }
        exec(cmd, function (error, stdout, stderr) {
            if (stdout.indexOf("Gruntfile.js") > -1) {
                exec(cmd, function (error, stdout, stderr) {
                    if (!error) {
                        console.log(stdout);
                        console.log(stderr);
                        done();
                    }
                    else {
                        console.log(error);
                    }
                })
            }

            else {
                if (!error) {
                    console.log(stdout);
                    console.log(stderr);
                    done();
                }
                else {
                    console.log(error);
                }
            }
        })
    });

    grunt.registerTask('reDeploy', function () {
        var exec = require('child_process').exec;
        var done = this.async();
        //if (!tag) {
        var cmd = 'git pull ';

        // } else {
        var comnd = 'grunt deploy';
        // }
        exec(cmd, function (error, stdout, stderr) {
            if (stdout.indexOf("Gruntfile.js") > -1) {
                exec(comnd, function (error, stdout, stderr) {
                    if (!error) {
                        console.log(stdout);
                        console.log(stderr);
                        done();
                    }
                    else {
                        console.log(error);
                    }
                })
            }

            else {
                if (!error) {
                    console.log(stdout);
                    console.log(stderr);
                    done();
                }
                else {
                    console.log(error);
                }
            }
        })
    });

    grunt.registerTask('deleteOldDist', function () {
        var exec = require('child_process').exec;
        var child;
        var myDone = grunt.task.current.async();
        exec('ls dist/', function (error, stdout, stderr) {
            var c = stdout.split('\n');
            console.log(c.length - 1);
            startDel(c);

            function del(file, next) {
                console.log('in delete');
                var cmd = 'rm -r "dist/' + file + '"';
                child = exec(cmd, function (err, stdout, stderr) {
                    console.log("DELETED");
                    if (err) {
                        console.error(err);
                        return next();
                    }
                    console.log('deleting', stdout);
                    console.log(stderr);
                    next();
                })
            }

            function startDel(c) {
                if (c.length < 2) {
                    myDone();
                }
                var file = c.shift();
                if (file) {
                    var splite = file.split('_');
                    if (splite[1]) {
                        var date = splite[1].split('-');
                        var day = date[0];
                        var month = date[1];
                        var year = date[2];
                        var distDate = new Date(year, month - 1, day).getTime();
                        var currentDate = new Date().getTime();
                        if (currentDate - distDate > 604800000) {
                            del(file, function () {
                                console.log('deleted ', file);
                                startDel(c);
                            })
                        }
                        else {
                            console.log('in delete else');
                            startDel(c);
                        }
                    } else {
                        startDel(c);
                    }
                } else {
                    myDone();
                }
            }
        });
    });

    grunt.registerTask('changePermission', function () {
        var exec = require('child_process').exec;
        var child;
        var done = this.async();
        exec('cd /var/www/storehippo/dist/latest/app/servers/aws-lambda-image/bin && chmod u+x linux/*', function (error, stdout, stderr) {
            done();
        })
    });

    //clone
    grunt.registerMultiTask('clone', 'Restore the latest commit file from a git repository', function (n) {
        var exec = require('child_process').exec;
        var done = this.async();
        var cmd = 'git clone git@github.com:HippoInnovations/storehippo.git' + this.data;
        var cmd = 'cd code && ';
        if (!tag) {
            cmd += 'git pull && ';
        } else {
            cmd += 'git init && git fetch && git checkout ' + tag + ' && git pull && ';
        }
        cmd += 'cd ..';
        exec(cmd, function (error, stdout, stderr) {
            if (!error) {
                console.log(stdout);
                console.log(stderr);
                done();
            }
            else {
                grunt.fail.warn(error);
            }
        })
    });
    //symbolic link
    grunt.registerMultiTask('symbolic', 'To create symbolic link', function () {
        var exec = require('child_process').exec;
        var done = this.async();
        var cmd = 'ln -s -fn ' + this.data + ' dist/latest';
        cmd += '';
        console.log('cmd==', cmd);
        exec(cmd, function (error, stdout, stderr) {
            if (!error) {
                console.log(stdout);
                console.log(stderr);
                done();
            }
            else {
                console.log(error);
            }
        });
    });

    //reverting symbolic link
    grunt.registerTask('revertingsymbolic', 'To revert symbolic link', function () {
        var fs = require("fs");
        var done = this.async();
        fs.readdir('dist/', function (err, files) {
            console.log("----------------sss------", err, files)
            if (err) {
                throw err;
            }
        })
    });

    grunt.registerMultiTask('generateBuild', 'generate Build Number ', function () {
        console.log('number', this.data);
        var done = this.async();
        fs.writeFileSync(__dirname + '/dist/latest/app/frontend/version.txt', this.data);
        done();
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-htmlrefs');
};
