const selenium = require('selenium-standalone')
const opera = require('operadriver')

console.log(opera.start())

selenium.install({
    logger: console.log
}, (err, drivers) => {
    if (err) return console.error(err)
    console.log('selenium-standalone installed')
    selenium.start({ drivers }, (err, res) => {
        if (err) return console.err(err)
        console.log('selenium-standalone running, pid:', res.pid)
    })
})

function exit() {
    try { opera.stop() } 
    catch (ex) { }
}

process.on('exit', exit);

//catches ctrl+c event
process.on('SIGINT', exit);

//catches uncaught exceptions
process.on('uncaughtException', exit);