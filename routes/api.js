'use strict';

var express = require('express');
var router = express.Router();

var models = {
  User: require('../models/User'),
  Homepage: require('../models/Homepage'),
  Link: require('../models/Link'),
  Quote: require('../models/Quote'),
  Project: require('../models/Project'),
  ProjectDetail: require('../models/ProjectDetail'),
  About: require('../models/About'),
  AboutDetail: require('../models/AboutDetail'),
  Summary: require('../models/Summary'),
  AboutPhoto: require('../models/AboutPhoto'),
};

var createCrudController = require('../controllers/crudController').createCrudController;

Object.keys(models).forEach(function (key) {
  var Model = models[key];
  var ctrl = createCrudController(Model);
  var base = '/' + key.toLowerCase();
  router.get(base, ctrl.list);
  router.get(base + '/:id', ctrl.get);
  router.post(base, ctrl.create);
  router.put(base + '/:id', ctrl.update);
  router.delete(base + '/:id', ctrl.remove);
});

module.exports = router;


