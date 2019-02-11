module.exports = (sequelize, Sequelize) => {
	const Product = sequelize.define('products', {
	  code: {
		  type: Sequelize.STRING
	  },
	  productName: {
		  type: Sequelize.STRING
	  },
	  details: {
		  type: Sequelize.STRING
	  },
		price: {
		  type: Sequelize.INTEGER
	  }

	});

	Product.associate=function(models){
			Product.belongsTo(models.categories);
			Product.belongsTo(models.users);
	}
	// Here we can connect companies and products base on company'id


	return Product;
}
