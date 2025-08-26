const { VehicleRequest, User } = require('../models');

class VehicleService {
    async generateRequestNumber() {
        const latestRequest = await VehicleRequest.findOne({
            order: [['id', 'DESC']],
            attributes: ['request_number']
        });

        let nextNumber = 1;
        if (latestRequest && latestRequest.request_number) {
            const currentNumber = parseInt(latestRequest.request_number.replace('REQ', ''));
            nextNumber = currentNumber + 1;
        }

        return `REQ${nextNumber.toString().padStart(4, '0')}`;
    }

    async createRequest(userId, requestData) {
        const requestNumber = await this.generateRequestNumber();

        const vehicleRequest = await VehicleRequest.create({
            request_number: requestNumber,
            user_id: userId,
            ...requestData
        });

        const createdRequest = await VehicleRequest.findByPk(vehicleRequest.id, {
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email', 'department']
            }]
        });

        return createdRequest;
    }

    async getUserRequests(userId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const { count, rows } = await VehicleRequest.findAndCountAll({
            where: { user_id: userId },
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email', 'department']
            }],
            order: [['request_date', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return {
            requests: rows,
            totalCount: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        };
    }

    async getAllRequests(page = 1, limit = 10, status = null) {
        const offset = (page - 1) * limit;
        const whereClause = status ? { status } : {};

        const { count, rows } = await VehicleRequest.findAndCountAll({
            where: whereClause,
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email', 'department']
            }],
            order: [['request_date', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return {
            requests: rows,
            totalCount: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        };
    }

    async markAsReturned(requestId) {
        const vehicleRequest = await VehicleRequest.findByPk(requestId);

        await vehicleRequest.update({
            status: 'returned',
            returned_at: new Date()
        });

        const updatedRequest = await VehicleRequest.findByPk(requestId, {
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email', 'department']
            }]
        });

        return updatedRequest;
    }

    async getRequestById(requestId) {
        const vehicleRequest = await VehicleRequest.findByPk(requestId, {
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email', 'department']
            }]
        });

        return vehicleRequest;
    }

    async getDashboardStats() {
        const totalRequests = await VehicleRequest.count();
        const pendingRequests = await VehicleRequest.count({
            where: { status: 'pending' }
        });
        const returnedRequests = await VehicleRequest.count({
            where: { status: 'returned' }
        });

        const recentRequests = await this.getAllRequests(1, 5);

        return {
            stats: {
                totalRequests,
                pendingRequests,
                returnedRequests
            },
            recentRequests: recentRequests.requests
        };
    }
}

module.exports = new VehicleService();
