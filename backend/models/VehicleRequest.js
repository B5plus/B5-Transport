const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VehicleRequest = sequelize.define('VehicleRequest', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    request_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    request_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    vehicle_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    vehicle_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    taken_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    estimated_usage: {
        type: DataTypes.TIME,
        allowNull: false
    },
    department: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'returned'),
        defaultValue: 'pending',
        allowNull: false
    },
    returned_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'vehicle_requests',
    timestamps: false
});

module.exports = VehicleRequest;
