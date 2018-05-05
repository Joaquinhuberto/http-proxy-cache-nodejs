/**
 * Created by joaquingarcialanzas on 22/4/18.
 */

var express = require('express');
var mcache = require('memory-cache');
var http = require('http');
var httpProxy = require('http-proxy');


var proxy = httpProxy.createProxyServer({});
var app = express();

var cache = function(duration){
    return function (req, res, next){

        key = '<domain>' + req.originalUrl || req.url;
        cacheBody = mcache.get(key);
        if (cacheBody) {
            res.send(cacheBody);
            return;

        } else {


            res.sendResponse = res.send;

            res.sendResponse = proxy.res;
            res.send = function (body) {
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body);
            }
            next();
        }
    }
}

app.get('/*', cache(10),function(req, res){

    proxy.web(req, res, { target: 'http://127.0.0.1:3001' });
    console.log('cache: ' + mcache.keys())

})

var server = app.listen(3000, function(){
    console.log("Servidor inicializado en el puerto ", server.address().port);
})
