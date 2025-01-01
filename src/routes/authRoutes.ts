import express from 'express';
import { login, register } from '../controllers/authController';
const router = express.Router();

router.post('/resgister',register);
router.post('/login',login);

export default router;  