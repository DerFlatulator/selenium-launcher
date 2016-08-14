var selenium = require('selenium-standalone')
var opera = require('operadriver')
var pids = []

console.log('start-selenium is running, press ^C or kill the process to stop the servers')

console.log('operadriver is pre-installed')
var res = opera.start()
forward(res, '[operadriver] ')
console.log('operadriver running, pid:', res.pid, 'port ')
pids.push(res.pid)

console.log('selenium-standalong is installing...')
selenium.install({
    logger: process.argv.indexOf('-v') > -1 ? console.log : function () {}
}, function (err, drivers) {
    if (err) return error(err)
    console.log('selenium-standalone installed')
    selenium.start({ drivers: drivers }, function (err, res) {
        if (err) return error(err)
        pids.push(res.pid)
        console.log('selenium-standalone running, pid:', res.pid)
        forward(res, '[selenium-server] ')
    })
})

function exit(e) {
    console.log('start-selenium has stopped')
    try { 
        opera.stop()
        pids.forEach(function (pid) {
            process.kill(pid)
        })
    }
    finally {
        process.exit()
    }
}

function error(e) {
    console.error(e)
    exit()
}

function forward(res, name) {
    res.stdout.on('data', function (data) {
        process.stdout.write(name, 'utf-8')
        process.stdout.write(data, 'utf-8')
    })
    res.stderr.on('data', function (data) { 
        process.stderr.write(name, 'utf-8')
        process.stderr.write(data, 'utf-8')
    })
}

process.on('exit', exit);

//catches ctrl+c event
process.on('SIGINT', exit)