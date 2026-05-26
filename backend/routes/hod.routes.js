const express = require('express');
const hodController = require('../controllers/hod.controller');

const router = express.Router();

router.get('/status', hodController.getHodStatus);
router.get('/', hodController.getAllHods);
router.get('/:departmentId', hodController.getHodByDepartment);

module.exports = router;
