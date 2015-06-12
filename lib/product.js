var request = require('request');

var host = 'http://intersafe.ru/api/products';

function Product (obj) {
    for (var key in obj) {
        this[key] = obj[key];
    }
};

Product.get = function (id, fn) {
    request(host + '/' + id, function (err, res, body) {
        if (err) return fn(err);
        if (200 != res.statusCode)
            return fn(new Error('Invalid status code: ' + res.statusCode));
        fn(null, new Product(JSON.parse(body)));
    });
};

Product.list = function (fn) {
    request(host + '?$top=20', function (err, res, body) {
        if (err) return fn(err);
        if (200 != res.statusCode)
            return fn(new Error('Invalid status code: ' + res.statusCode));
        
        var products = JSON.parse(body).map(function (p) {
            return new Product(p);
        });
        fn(null, products);
    });
};

module.exports = Product;
