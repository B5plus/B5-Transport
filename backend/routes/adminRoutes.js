const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/requests', adminController.getAllRequests);
router.get('/request/:id', adminController.getRequestById);
router.patch('/request/:id/return', adminController.markAsReturned);
router.get('/dashboard', adminController.getDashboardStats);

module.exports = router;
