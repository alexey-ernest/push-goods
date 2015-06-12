var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var Product = require('./lib/product');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/', function (req, res, next) {
    Product.list(function (err, products) {
        if (err) return next(err);
        res.render('home', { products: products });
    });
});

app.get('/:id', function (req, res, next) {
    Product.get(req.params.id, function (err, product) {
        if (err) return next(err);
        res.send(product);
    });
});

io.on('connection', function (socket) {
    socket.on('product:click', function (id) {
        console.log('Product with id ' + id + ' was clicked.');
    });
});

module.exports = http;
