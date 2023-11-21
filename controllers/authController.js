const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();



const registerUser = async (req, res) => {
    const { firstName, lastName, username, phone, email, password } = req.body;

    try {
        // Check if the user with the given email already exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                status: 'fail',
                message: 'User already exists.',
                //user: user,
            });
        }

        // Create a new user and set their verified status to true directly
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            username,
            phone,
            email,
            password: hashedPassword,
            verified: true, // Assuming you want to skip the email verification
        });

        const savedUser = await newUser.save();
        delete savedUser.password; // Remove the password field before sending the response

        return res.status(200).json({
            status: 'success',
            message: 'Sign up successful.',
            user: savedUser,
        });
    } catch (error) {
        console.error('Error while registering user:', error);

        return res.status(500).json({
            status: 'failed',
            message: 'An error occurred while signing up. Please try again.',
        });
    }
};


  //////////SIGN-IN USER
  const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({
                status: 'failed',
                message: 'Username or Email field is required',
            });
        }

        let user;

        if (email) {
            // If an email is provided, find the user by email
            user = await User.findOne({ email });
        }

        if (!user) {
            return res.status(404).json({
                status: 'failed',
                message: 'User not found',
            });
        }

        console.log('User retrieved:', user);

        const isPasswordValid = await bcrypt.compare(password, user.password);

        console.log('Extracted password:', password);

        if (!isPasswordValid) {
            return res.status(400).json({
                status: 'failed',
                message: 'Invalid password',
            });
        }

        // if (!user.verifiedEmail) {
        //     return res.status(400).json({
        //         status: 'failed',
        //         message: 'Please verify your email before signing in',
        //     });
        // }

        // Set the user's activeStatus to "online"
        // user.activeStatus = "online";
        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SEC_KEY,
            {
                expiresIn: '24h',
            }
        );

        // Create a user details object with the desired fields
        const userDetails = {
            _id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastname: user.lastName,
            phone: user.phone,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        return res.status(200).json({
            status: 'success',
            message: 'Successfully signed in',
            token,
            user: userDetails,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'failed',
            message: 'Internal server error',
        });
    }
};

  

const authController = {
    registerUser,
    loginUser,
};

module.exports = authController;
