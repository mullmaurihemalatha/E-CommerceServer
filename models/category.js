
module.exports = (sequelize, Sequelize) => {
	const Category = sequelize.define('categories', {
	  name: {
		  type: Sequelize.STRING
	  },
	  description: {
		  type: Sequelize.STRING
	  }
	});
	Category.associate=function(models){
			Category.hasMany(models.products);
	}



	return Category;
}
