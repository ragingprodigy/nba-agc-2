/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var Member = require('../api/member/member.model');


Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});
/*
Member.find({}).remove(function(){
   Member.create({
       firstName: 'James', middleName: 'Frederick', surname:'Patterson', yearCalled: 1991, branch: 'Lagos'
   },{
       firstName: 'Peter', middleName: 'Vaughn', surname:'Sutton', yearCalled: 1981, branch: 'Rivers'
   },{
       firstName: 'Paul', middleName: 'Peter', surname:'Baker', yearCalled: 1998, branch: 'Anambra'
   },{
       firstName: 'Phillipa', middleName: 'Agnes', surname:'Gendarme', yearCalled: 2003, branch: 'Lagos'
   },{
       firstName: 'Felicia', middleName: 'Agnes', surname:'Matlock', yearCalled: 2009, branch: 'Ogun'
   });
});*/