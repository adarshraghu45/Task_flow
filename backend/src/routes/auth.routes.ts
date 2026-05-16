import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', authenticate, AuthController.logout);
router.post('/forgot-password', validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), AuthController.resetPassword);
router.get('/me', authenticate, AuthController.me);
router.get('/admin', authenticate, authorize('admin'), (_req, res) => {
  res.json({ success: true, message: 'Admin access granted', data: null });
});

export default router;
