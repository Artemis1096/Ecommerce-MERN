import express from 'express'
import {testController,loginController, registerController} from '../controller/authController.js'
import { requireSignIn } from '../middleware/authMiddleware.js'
import { isAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

// Register Route
router.post('/register',registerController)

// Login Route
router.post('/login',loginController)

// Authentication Check
router.get('/test',requireSignIn,isAdmin,testController);

export default router;