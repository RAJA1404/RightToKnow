const express = require('express');
const locationController = require('../controllers/location.controller');

const router = express.Router();

router.get('/districts', locationController.getDistricts);
router.get('/taluks', locationController.getTaluks);
router.get('/villages', locationController.getVillages);

module.exports = router;
