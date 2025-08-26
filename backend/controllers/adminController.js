const vehicleService = require('../services/vehicleService');

class AdminController {
    async getAllRequests(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status || null;

            const result = await vehicleService.getAllRequests(page, limit, status);

            res.json({
                message: 'All requests retrieved successfully',
                data: result
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    async markAsReturned(req, res) {
        try {
            const { id } = req.params;
            const updatedRequest = await vehicleService.markAsReturned(id);

            res.json({
                message: 'Vehicle marked as returned successfully',
                data: { request: updatedRequest }
            });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }

    async getRequestById(req, res) {
        const { id } = req.params;
        const vehicleRequest = await vehicleService.getRequestById(id);

        res.json({
            message: 'Request retrieved successfully',
            data: { request: vehicleRequest }
        });
    }

    async getDashboardStats(res) {
        const data = await vehicleService.getDashboardStats();

        res.json({
            message: 'Dashboard statistics retrieved successfully',
            data
        });
    }
}

module.exports = new AdminController();
