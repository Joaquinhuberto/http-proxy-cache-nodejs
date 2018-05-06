/**
 * Created by joaquingarcialanzas on 5/5/18.
 */

var express = require('express');

var http = require('http'),
    httpProxy = require('http-proxy');


var proxy = httpProxy.createServer({
    target:'http://localhost:3001'
});


proxy.listen(3000);



proxy.on('proxyReq', function(proxyReq, req, res, options) {
    console.log('proxyReq:');
    proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');

});


proxy.on('proxyRes',  function (proxyRes, req, res) {
    console.log('proxyRes:');
    console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
});

proxy.on('error', function (err, req, res) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });

    res.end('Something went wrong. And we are reporting a custom error message.');
});

