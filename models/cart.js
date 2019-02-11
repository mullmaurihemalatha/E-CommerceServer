module.exports = (sequelize, Sequelize) => {
	const Cart = sequelize.define('cart', {
		quantity: {
			type: Sequelize.INTEGER
		}
	});
	Cart.associate=function(models){
		Cart.belongsTo(models.products);
		Cart.belongsTo(models.users);
	}
	return Cart;
}
