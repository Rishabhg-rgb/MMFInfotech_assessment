import express from 'express';
import { signup, login, protect, getMe } from '../controllers/auth.controller';
import { validateRequest, signupSchema, loginSchema } from '../utils/validation';

const router = express.Router();

router.post('/signup', validateRequest(signupSchema), signup);
router.post('/login', validateRequest(loginSchema), login);
router.get('/me', protect, getMe);

export default router;