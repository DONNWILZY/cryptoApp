const express = require('express');
const router = express.Router();
const {registerUser, loginUser} = require('../controllers/authController'); // Update the path to authController as needed

// Route for user registration
router.post('/register', registerUser );
router.post('/login', loginUser);

module.exports = router;
