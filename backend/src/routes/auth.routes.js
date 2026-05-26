const express = require('express');
const router = express.Router();
const { register, login, requestOtp, verifyOtp } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);

module.exports = router;
