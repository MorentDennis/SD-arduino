var express = require('express');
var SerialPort = require("serialport");
var portName = 'COM3';
//var otherPortName = 'COM4';

var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});


// var outPutSp = new SerialPort(otherPortName, {
//     baudRate: 9600
// })



// outPutSp.on('open', () => {
//     console.log('outPut port open');
//     outPutSp.write('H');
// })


var sp = new SerialPort(portName, {
    baudRate: 9600
});// instantiate the port

var outPutSp = sp; // for testing


sp.on("close", function (err) {
    console.log("port closed");
  });
  
  sp.on("error", function (err) {
    console.error("error", err);
  });
  
  sp.on("open", function () {
    io.sockets.emit("test")
  });

var cleanDataX = ""; // this stores the clean data
var bufferString = "";  // this stores the buffer
var cleanDataY = "";

sp.on("data", function (data) { 
	
    bufferString += data.toString() 

    // if the letters "A" and "B" are found on the buffer then isolate what"s in the middle
    // as clean data. Then clear the buffer.
    if (bufferString.indexOf("B") >= 0 && bufferString.indexOf("A") >= 0) {
        cleanDataX = bufferString.substring(bufferString.indexOf("A") + 1, bufferString.indexOf("B"));
        cleanDataY =  bufferString.substring(bufferString.indexOf("C") + 1, bufferString.indexOf("D"))
        bufferString = "";
       
        if(cleanDataX  == 1023)
        {
            io.sockets.emit("movedRight");
        }
        else if (cleanDataX <= 1)
        {
            io.sockets.emit("movedLeft");
        }
        else if (cleanDataX  < 1022) {
            io.sockets.emit("stopped")
        }
        if (cleanDataY == 1023)
        {
            io.sockets.emit("jumped");
        }
        else if(cleanDataY < 1022)
        {
            io.sockets.emit("nojump");
        } 
        cleanDataX = "";
        cleanDataY = "";
    }
});


server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port);
});


io.on('connection',function(socket){

    socket.on('gameOver',function(){
        outPutSp.write('gameOver');
        console.log("gameOver");
    });

    socket.on('playing',function(){
        outPutSp.write('playing');
        console.log("playing");
    });

    socket.on('won',function(){
        outPutSp.write('won');
        console.log("won");
    });
});
