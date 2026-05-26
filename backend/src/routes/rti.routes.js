const express = require('express');
const router = express.Router();
const rtiController = require('../controllers/rti.controller');
const trackingController = require('../controllers/tracking.controller');
const { optionalAuth } = require('../middleware/auth');

router.post('/generate', rtiController.generate);
router.post('/submit', optionalAuth, rtiController.submit);
router.get('/:id', trackingController.getByApplicationId);

module.exports = router;
