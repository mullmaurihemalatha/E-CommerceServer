var express = require('express');
var router = express.Router();
var models= require('../models');
var CONFIG=require('../config/config.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const seq=require('Sequelize');

router.post('/', async function(req, res) {
   var token = req.headers['x-auth-token'];
   if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
   let user=await jwt.verify(token, CONFIG.key);
		let pro=await models.products.create({
			categoryId: req.body.categoryid,
      userId: user.id,
			code : req.body.code,
			productName: req.body.productName,
			details: req.body.details
		})

	return  res.status(200).send(pro);
});

// FETCH all Users
router.get('/', async function(req, res) {
  var token = req.headers['x-auth-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  let user=await jwt.verify(token, CONFIG.key);
  if(!user)
  return res.status(403).send("Un Auth");

	models.products.findAll().then(products => {
	  // Send all Users to Client
	  res.send(products);
	});
});


router.post('/addtocart', async function(req, res) {
   var token = req.headers['x-auth-token'];
   console.log(token);
   if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
   let user=await jwt.verify(token, CONFIG.key);
   console.log(req.body);
   let item=await models.cart.findOne({
     where:{
       productId: req.body.productId,
       userId: user.id
     }
   });
   if(item){
     item.quantity=item.quantity+1;
     await item.save();
   }else{
		await models.cart.create({
			productId: req.body.productId,
      userId: user.id,
      quantity: 1
		})
  }
  let items= await models.cart.findAndCountAll({
    where:{
      userId: user.id
    }
  });
	return  res.status(200).send({success: true, count: items.count});
});


router.get('/getcart', async function(req, res) {
   var token = req.headers['x-auth-token'];
   if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
   let user=await jwt.verify(token, CONFIG.key);
   let items= await models.cart.findAll({
    where:{
      userId: user.id
    },
    include :[{
      model: models.products
    }]
  });
	return res.status(200).send(items);
});



router.post('/checkout', async function(req, res) {
   var token = req.headers['x-auth-token'];
   if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
   let user=await jwt.verify(token, CONFIG.key);
   let items= await models.cart.findAll({
    where:{
      userId: user.id
    },
    include :[{
      model: models.products
    }]
  });
  let date=new Date();
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  for(let item in items){
    await models.orders.create({
      productId: item.productId,
      userId: item.userId,
      quantity: item.quantity,
      date: year+"-"+monthIndex+"-"+day,
      status: "PENDING"
    });

  }
  await models.cart.destroy({
    where: {
      userId: user.id
    }
  })
	return res.status(200).send({success: true});
});

router.get('/orders', async function(req, res) {
   var token = req.headers['x-auth-token'];
   if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
   let user=await jwt.verify(token, CONFIG.key);
   let items= await models.orders.findAll({
    where:{
      userId: user.id
    },
    include :[{
      model: models.products
    }]
  });
	return res.status(200).send(items);
});

router.get('/search', async function(req, res) {
  var token = req.headers['x-auth-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  let user=await jwt.verify(token, CONFIG.key);
  if(!user)
  return res.status(403).send("Un Auth");
  console.log(req.query);
  let q=req.query.q.toLowerCase();
  let s=req.query.s;

  // if(s=='price'){
  //
  // }elseif(s=='name'){
  //
  // }

  let Op=models.sequelize.Op;
  let pros=await models.products.findAll({
    where: {
      productName:{
        [Op.like]: '%'+q+'%'
      }
    },
    order:[]
  });
  console.log(pros);

  res.status(200).send(pros);
	return;
});

// Find a User by Id
router.get('/:id', async function(req, res) {
  var token = req.headers['x-auth-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  let user=await jwt.verify(token, CONFIG.key);
  if(!user)
  return res.status(403).send("Un Auth");
  console.log(req.params.id);
  let product=await models.products.findAll({
    where:{
      id: req.params.id
    }
  });
  res.status(200).send(product);
  console.log(product);
	// models.products.findOne({
	// 	where: {id: req.params.id},
	// 	include :{model: models.categories}
	// }).then(product => {
	// 	res.send(product);
  //   console.log(product);
	// });
  return;
});

module.exports = router;
