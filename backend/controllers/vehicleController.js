const vehicleService = require('../services/vehicleService');

class VehicleController {
    async createRequest(req, res) {
        try {
            const {
                vehicle_type,
                vehicle_number,
                location,
                taken_time,
                estimated_usage,
                department,
                remarks
            } = req.body;

            const vehicleRequest = await vehicleService.createRequest(req.user.id, {
                vehicle_type,
                vehicle_number,
                location,
                taken_time,
                estimated_usage,
                department,
                remarks
            });

            res.status(201).json({
                message: 'Vehicle request created successfully',
                data: { request: vehicleRequest }
            });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }

    async getUserRequests(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const result = await vehicleService.getUserRequests(req.user.id, page, limit);

            res.json({
                message: 'User requests retrieved successfully',
                data: result
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    async getRequestById(req, res) {
        try {
            const { id } = req.params;
            const vehicleRequest = await vehicleService.getRequestById(id);

            res.json({
                message: 'Request retrieved successfully',
                data: { request: vehicleRequest }
            });
        } catch (error) {
            res.status(404).json({
                message: error.message
            });
        }
    }
}

module.exports = new VehicleController();
