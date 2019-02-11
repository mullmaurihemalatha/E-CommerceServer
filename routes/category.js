var express = require('express');
var router = express.Router();
var models= require('../models');
var CONFIG=require('../config/config.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/', async function(req, res, next) {
	// Save to MySQL database
	models.categories.create({
		name: req.body.name
	}).then(cat => {
		res.send(cat);
	})
  return;
});

router.get('/getcats', async function(req, res) {
	let cates=await models.categories.findAll();
    res.status(200).send(cates);
  return;
});

// Find a User by Id
router.post('/:id', async function(req, res) {
	let cat=await models.categories.findOne({
		where: {id: req.params.id}
	});
  	res.status(200).send(product);
  return;
});

module.exports = router;
