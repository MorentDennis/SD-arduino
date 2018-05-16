var serialport = require("serialport");
var readline = require('readline');


var portname = process.argv[2];

var myPort = new serialport(portname, {baudRate: 9600});

var rl = readline.createInterface(
    {
        input: process.stdin,
        output: process.stdout
    }
)
myPort.on('open',()=> {
    console.log("port open");

})

rl.on('line', ()=> {
    myPort.write("test3");
})

myPort.on('data', (data)=> {
    console.log(data.toString())
})
