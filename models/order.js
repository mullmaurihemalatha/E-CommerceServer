module.exports = (sequelize, Sequelize) => {
	const Order = sequelize.define('orders', {
		quantity: {
			type: Sequelize.INTEGER
		},
		date:{
			type: Sequelize.DATE
		},
		status:{
			type: Sequelize.STRING
		}
	});
	Order.associate=function(models){
		Order.belongsTo(models.products);
		Order.belongsTo(models.users);
	}
	return Order;
}
