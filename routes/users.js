var express = require('express');
var router = express.Router();
var models= require('../models');
var CONFIG=require('../config/config.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/register',async function(req,res){
	var hashedPassword = bcrypt.hashSync(req.body.password, 8);

	// Save to MySQL database
	let user=await models.users.create({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
	  email: req.body.email,
	  password: hashedPassword,
	});
  	res.status(200).send(user);
	return;
});

router.post('/login',async function(req,res){
  try{
		let user=await models.users.findOne({
      where:{
        email: req.body.email
      }
    });

    if (!user)
      return res.status(404).send('No user found.');



    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

	  if (!passwordIsValid)
      return res.status(401).send({ auth: false, token: null });

      console.log("Hello");
    let token = jwt.sign({ id: user.id },CONFIG.key , {
	      expiresIn: 50000000 // expires in 24 hours
	    });
	    res.status(200).send({
				auth: true,
				token: token,
				user: user,
			});
    }catch(err){
      console.log(err);
    }
      return;
});



module.exports = router;
