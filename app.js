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

app.get('/operator', function (req, res, next) {
    Product.list(function (err, products) {
        if (err) return next(err);
        res.render('operator', { products: products });
    });
});

var operatorio = io.of('/operator');
operatorio.on('connection', function (socket) {
    socket.on('product:push', function (customer_id, product_id) {
        Product.get(product_id, function (err, product) {
            if (err) throw err;
            customerio.to(customer_id).emit('product:push', product);
        });
    });
});

var customerio = io.of('/customer');
customerio.on('connection', function (socket) {
    socket.on('product:view', function (id) {
        Product.get(id, function (err, product) {
            if (err) throw err;
            operatorio.emit('product:view', socket.id, product);
        });
    });
});


module.exports = http;
