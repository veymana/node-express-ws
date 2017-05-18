var express = require('express');
var app = express();
const url = require('url');
var expressWs = require('express-ws')(app);
var clients=[];
 
app.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
  return next();
});
 
app.get('/', function(req, res, next){
  console.log('get route', req.testing);
  res.end();
});
 
app.ws('/mock/:id', function(ws, req) {
 
 clients.push({'id':req.params.id,'connection':ws});

  ws.on('message', function(msg) 
    {
        var msgObj=null;

        try {
            msgObj=JSON.parse(msg);
           }
       catch(err) {
          console.log("Something wrong with your message..");
        }

    if(msgObj!=null){
        for (var i = 0, len = clients.length; i < len; i++) 
        {
            var client= clients[i];
            if(client.id==msgObj.id){
                client.connection.send(msg);
            }
        }
    }
  });
 
  console.log('Client '+req.params.id+" Connected...");
  
});
 
app.listen(3000);