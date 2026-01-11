const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Pastikan nama fungsi setelah titik (.) sama dengan yang ada di controller
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/status', authController.getStatus);
router.get('/logout', authController.logout);

module.exports = router;