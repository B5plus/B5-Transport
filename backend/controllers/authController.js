const authService = require('../services/authService');

class AuthController {
    async register(req, res) {
        try {
            const { name, email, password, department, role } = req.body;

            const result = await authService.register({
                name,
                email,
                password,
                department,
                role: role || 'user'
            });

            res.status(201).json({
                message: 'User registered successfully',
                data: result
            });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);

            res.json({
                message: 'Login successful',
                data: result
            });
        } catch (error) {
            res.status(401).json({
                message: error.message
            });
        }
    }

    async getProfile(req, res) {
        const user = await authService.getUserById(req.user.id);

        res.json({
            message: 'Profile retrieved successfully',
            data: { user }
        });
    }

    async logout(req, res) {
        res.json({
            message: 'Logout successful'
        });
    }
}


module.exports = new AuthController();
