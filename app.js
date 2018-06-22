/**
 * Created by joaquingarcialanzas on 22/4/18.
 */

var express = require('express');

var app = express();

var visitas;

app.use(function(req, res, next){
    visitas = visitas + 1;
    console.log("Visita " + visitas);
    next()
})

app.get('/*', function(req, res){
    setTimeout(function cb(){
        res.send("Hola Mundo, Visita " + visitas);
    },2000);

});

var server = app.listen(process.env.PORT || 3001, function(){
    console.log("Servidor inicializado en el puerto ", server.address().port);
    visitas = 0;
});
