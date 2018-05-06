/**
 * Created by joaquingarcialanzas on 22/4/18.
 */

var express = require('express');
var mcache = require('memory-cache');
//var http = require('http');


var proxy = new (require("http-proxy").createProxy)();
var app = express();

var cache = function(duration){
    return function (req, res, next){
        console.log('Comprobando cache.... '+'<domain>' + req.originalUrl || req.url);
        key = '<domain>' + req.originalUrl || req.url;
        cacheBody = mcache.get(key);
        if (cacheBody) {
            console.log('return cache....');
            res.send(cacheBody);
            return;

        } else {

            console.log('Cacheando.... ' + key);
            res.sendResponse = res.send;
            res.send = function (body) {
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body);
            }
            proxy.web(req, res, { target: 'http://127.0.0.1:3001' });
            next();
        }
    }
}

//app.use(cache(10));

app.get('/*',cache(10),function(req, res){
    console.log('app.get');

    //proxy.web(req, res, { target: 'http://127.0.0.1:3001' });
    //res.send(proxy.web(req, res, { target: 'http://127.0.0.1:3001' }));

    res.send('Hellooo!!');
    console.log('cache: ' + mcache.keys());

})


var server = app.listen(3000, function(){
    console.log("Servidor inicializado en el puerto ", server.address().port);
})
