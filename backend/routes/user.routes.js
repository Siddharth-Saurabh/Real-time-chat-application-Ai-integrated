import { Router } from "express";
import * as userController from "../controllers/user.controllers.js";
import { body } from 'express-validator';
import * as authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.post(
  '/register',
  [
    body('email')
      .trim()
      .isEmail().withMessage('Email must be valid')
      .bail()
      .isLength({ min: 6 }).withMessage('Email must be at least 6 characters long'),

    body('password')
      .trim()
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  userController.createUserController
);

router.post(
  '/login',
  [
    body('email')
      .trim()
      .isEmail().withMessage('Email must be valid')
      .bail()
      .isLength({ min: 6 }).withMessage('Email must be at least 6 characters long'),

    body('password')
      .trim()
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  userController.loginController
);

router.get('/profile', authMiddleware.authUser, userController.profileController);

router.post('/logout', authMiddleware.authUser, userController.logoutController);

router.get('/all', authMiddleware.authUser, userController.getAllUsersController);
export default router;
