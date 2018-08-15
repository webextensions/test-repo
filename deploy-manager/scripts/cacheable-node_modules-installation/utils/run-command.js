var execCP = require('child_process').exec,
    spawnCP = require('child_process').spawn;

// var logger = require('note-down');

var awaitableExec = async function (cmd, args = [], options = {}) {
    return new Promise(function (resolve, reject) {
        var whitespacedCommand = cmd + ' ' + args.join(' ');

        var cwd = options.cwd || process.cwd();
        options.cwd = cwd;

        console.log(
            (function () {
                return ('(' + cwd + ') ');
            }()) +
            '$ ' + whitespacedCommand,
        );

        execCP(whitespacedCommand, options, (err, stdout, stderr) => {
            var output = {
                err,
                stdout,
                stderr
            };
            resolve(output);
        });
    });
};

var exec = function (cmd, args = [], options = {}, cb) {
    var whitespacedCommand = cmd + ' ' + args.join(' ');

    var cwd = options.cwd || process.cwd();
    options.cwd = cwd;

    console.log(
        (function () {
            return ('(' + cwd + ') ');
        }()) +
        '$ ' + whitespacedCommand
    );

    execCP(whitespacedCommand, options, (err, stdout, stderr) => {
        cb(err, stdout, stderr);
    });
};

var spawn = async function (cmd, args = [], options = {}) {
    return new Promise(function (resolve, reject) {
        var cwd = options.cwd || process.cwd();
        options.cwd = cwd;
        console.log(
            (function () {
                return ('(' + cwd + ') ');
            }()) +
            '$ ' + cmd + ' ' + args.join(' ')
        );

        // var colors = require('colors');
        // colors.enabled = true;

        // We may wish to use node-pty for better color support in the spawned process, but only after
        // the bug https://github.com/Microsoft/node-pty/issues/72#issuecomment-292714379 gets resolved
        // TODO: Check if https://github.com/moxystudio/node-cross-spawn provides better way to spawn the child process
        var childProcess = spawnCP(
            cmd,
            args,
            options
            // {
            //     env: {
            //         FORCE_COLOR: true
            //     },
            //     shell: true,     // https://stackoverflow.com/questions/48014957/quotes-in-node-js-spawn-arguments/48015471#48015471
            //     stdio: 'pipe'    // https://stackoverflow.com/questions/18825493/retaining-output-colors-when-shelling-out-to-node#comment78599609_20145153
            //     stdio: 'inherit' // https://stackoverflow.com/questions/7725809/preserve-color-when-executing-child-process-spawn/14231570#14231570
            //                      // https://stackoverflow.com/questions/7725809/preserve-color-when-executing-child-process-spawn/14231570#comment36250407_14231570
            //     stdio: [process.stdin, process.stdout, process.stderr]
            // }
        );

        // Not using process.stdout.write() directly, because at some points, that would cause the colored output escape codes to look incorrect
        // when they are split into 2 ".on('data')" events
        // https://stackoverflow.com/questions/20270973/nodejs-spawn-stdout-string-format/23975863#23975863
        //
        // TODO: Change it to a custom logic to print the output as soon as possible, while ensuring that the color
        // codes are printed out fully (basically, handle cases where 'data' event has returned only partial color
        // code and the remaining part would come with next 'data' event)
        var readline = require('readline');
        readline.createInterface({
            input: childProcess.stdout,
            terminal: false
        }).on('line', function(line) {
            console.log('stdout: ' + line);
        });
        // childProcess.stdout.on('data', function(data) {
        //     process.stdout.write(data);
        // });

        readline.createInterface({
            input: childProcess.stderr,
            terminal: false
        }).on('line', function(line) {
            console.log('stderr: ' + line);
        });

        // childProcess.stdout.on('end', function() {
        //     console.log('stdout end event');
        // });
        childProcess.on('exit', function(exitCode) {
            if (resolve) {
                resolve(exitCode);
            }
        });
        // childProcess.on('close', function(exitCode) {
        //     console.log('childProcess close event');
        // });
        // childProcess.stdout.on('close', function() {
        //     console.log('stdout close event');
        // });
    });
};

module.exports = {
    spawn,
    exec,
    awaitableExec
};
