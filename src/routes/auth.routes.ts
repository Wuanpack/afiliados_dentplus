import { Router } from 'express'
import * as AuthController from '../controllers/auth.controller'

const router = Router()

router.get('/', AuthController.loginForm)
router.post('/', AuthController.loginAction)
router.get('/register', AuthController.registerForm)
router.post('/register', AuthController.registerAction)
router.post('/logout', AuthController.logout)

export default router
