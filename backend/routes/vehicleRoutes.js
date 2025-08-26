const express = require('express');
const { body } = require('express-validator');
const vehicleController = require('../controllers/vehicleController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const vehicleRequestValidation = [
    body('vehicle_type').trim().notEmpty().withMessage('Vehicle type is required'),
    body('vehicle_number').trim().notEmpty().withMessage('Vehicle number is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('taken_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Taken time must be in HH:MM format'),
    body('estimated_usage').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Estimated usage must be in HH:MM format'),
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('remarks').optional().trim()
];

router.use(authenticateToken);

router.post('/request', vehicleRequestValidation, vehicleController.createRequest);
router.get('/my-requests', vehicleController.getUserRequests);
router.get('/request/:id', vehicleController.getRequestById);

module.exports = router;
