var express = require('express');
var SerialPort = require("serialport");
var portName = 'COM3';

var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});


var sp = new SerialPort(portName, {
    baudRate: 9600
});// instantiate the port

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
var readDataX = "";  // this stores the buffer

var cleanDataY = "";
var readDataY = "";



sp.on("data", function (data) { // call back when data is received
	
	console.log("serial port: " + data.toString());
	
    readDataX += data.toString(); // append data to buffer
    // if the letters "A" and "B" are found on the buffer then isolate what"s in the middle
    // as clean data. Then clear the buffer.
    if (readDataX.indexOf("B") >= 0 && readDataX.indexOf("A") >= 0) {
        cleanDataX = readDataX.substring(readDataX.indexOf("A") + 1, readDataX.indexOf("B"));
        readDataX = "";
        io.sockets.emit("xdata", cleanDataX);
    }

    readDataY += data.toString(); 


    if (readDataY.indexOf("C") >= 0 && readDataY.indexOf("D") >= 0) {
        cleanDataY = readDataY.substring(readDataY.indexOf("C") + 1, readDataY.indexOf("D"));
        readDataY = "";
        io.sockets.emit("ydata", cleanDataY);
    }

});



server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port);
});



io.on('connection',function(socket){

    

    socket.on('test',function(){
        console.log('test received');
    });
});


