const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthService {
    generateToken(userId) {
        return jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );
    }

    async register(userData) {
        const user = await User.create(userData);
        const token = this.generateToken(user.id);

        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            department: user.department,
            role: user.role,
            created_at: user.created_at
        };

        return { user: userResponse, token };
    }

    async login(email, password) {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const token = this.generateToken(user.id);

        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            department: user.department,
            role: user.role,
            created_at: user.created_at
        };

        return { user: userResponse, token };
    }

    async getUserById(userId) {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        return user;
    }
}

module.exports = new AuthService();
