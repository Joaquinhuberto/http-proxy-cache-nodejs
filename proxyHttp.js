/**
 * Created by joaquingarcialanzas on 22/4/18.
 */

var express = require('express');
var mcache = require('memory-cache');
//var http = require('http');

var duration = 10;

var proxy = new (require("http-proxy").createProxy)();
var app = express();

app.use(function (req, res, next){
    console.log('\nCache: ' + mcache.keys());
    console.log('Comprobando cache.... '+'<domain>' + req.originalUrl || req.url);

    key = '<domain>' + req.originalUrl || req.url;
    cacheBody = mcache.get(key);
    if (cacheBody) {
        console.log('return cache....' + cacheBody);
        res.send(cacheBody);
        return;

    } else {
        proxy.web(req, res, {target: 'http://127.0.0.1:3001'});
        next();
    }
});

proxy.on('proxyRes', function (proxyRes, req, res) {
    proxyRes.on('data', function(data) {
        var body = data.toString('utf-8');
        console.log('Cacheando.... ' + key + " -> " + body);
        mcache.put(key, body, duration * 1000);
    });

});

app.get('/*', function(req, res){
    //console.log('app.get');
});


var server = app.listen(3000, function(){
    console.log("Servidor inicializado en el puerto ", server.address().port);
});
