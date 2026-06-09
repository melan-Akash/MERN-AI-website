import express from 'express';
import { createCheckoutSession, verifyStripePayment } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/create-checkout-session', auth, createCheckoutSession);
userRouter.post('/verify-payment', auth, verifyStripePayment);

export default userRouter;
