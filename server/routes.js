/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors'),
    jwt = require('jwt-simple');


module.exports = function(app) {

    app.use('/auth', require('./api/auth'));

    app.get('/mu-e356046b-19ab9d8f-60de6263-b400f9e0', function(req, res){
      res.send(42);
    });

  // Insert routes below
  app.use('/api/users', require('./api/user'));
  app.use('/api/registrations', require('./api/registration'));
  app.use('/api/members', require('./api/member'));
  //app.use('/api/things', spMiddleware.authenticate, require('./api/thing'));
  app.use('/api/things', require('./api/thing'));

    app.get('/api/xml', function(req, res){
        res.send('<?xml version="1.0" encoding="utf-8" ?> <UPay><MerchantID> merchantID </MerchantID> <OrderID> orderID </OrderID><Status> status </Status> <StatusCode> statusCode </StatusCode> <Amount> amount </Amount> <Date> date </Date> <TransactionRef> transactionRef </TransactionRef></UPay>');
    });

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};