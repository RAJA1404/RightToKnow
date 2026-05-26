const express = require('express');
const departmentController = require('../controllers/departmentController');

const router = express.Router();

router.get('/departments', departmentController.getDepartments);
router.get('/departments/:id/hods', departmentController.getDepartmentHods);
router.get('/hods/:id/suboffices', departmentController.getHodSubOffices);
router.get('/public-authorities', departmentController.getPublicAuthorities);
router.get('/public-authorities/:id/hods', departmentController.getPublicAuthorityHods);

module.exports = router;
