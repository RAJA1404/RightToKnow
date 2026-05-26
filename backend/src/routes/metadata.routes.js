const express = require('express');
const metadataController = require('../controllers/metadata.controller');

const router = express.Router();

router.get('/categories', metadataController.getCategories);
router.get('/sample-questions', metadataController.getSampleQuestions);

module.exports = router;
