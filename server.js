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
var bufferString = "";  // this stores the buffer

var cleanDataY = "";
var readDataY = "";



sp.on("data", function (data) { // call back when data is received
	
	//console.log("serial port: " + data.toString());
	
    bufferString += data.toString() 
   // console.log(bufferString);
  //  console.log(bufferString);
   // console.log(readDataX) // append data to buffer
    // if the letters "A" and "B" are found on the buffer then isolate what"s in the middle
    // as clean data. Then clear the buffer.
    if (bufferString.indexOf("B") >= 0 && bufferString.indexOf("A") >= 0) {
        cleanDataX = bufferString.substring(bufferString.indexOf("A") + 1, bufferString.indexOf("B"));
        cleanDataY =  bufferString.substring(bufferString.indexOf("C") + 1, bufferString.indexOf("D"))
       // console.log(cleanDataX);
        console.log(cleanDataY);
        
        bufferString = "";
       
        if(cleanDataX  == 1023)
        {
            io.sockets.emit("movedRight");
          //  console.log("movedRight")
          //  readDataX = "";
        }
        else if (cleanDataX <= 1)
        {
            io.sockets.emit("movedLeft");
        //    readDataX =  "";
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

    

    socket.on('test',function(){
        console.log('test received');
    });
});


