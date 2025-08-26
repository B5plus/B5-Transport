const User = require('./User');
const VehicleRequest = require('./VehicleRequest');

User.hasMany(VehicleRequest, {
    foreignKey: 'user_id',
    as: 'vehicleRequests'
});

VehicleRequest.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

module.exports = {
    User,
    VehicleRequest
};
