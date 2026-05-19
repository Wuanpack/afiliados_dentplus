import { Router } from 'express'
import * as AffiliateController from '../controllers/affiliate.controller'
import * as UserController from '../controllers/user.controller'

const router = Router()

router.get('/', AffiliateController.index)
router.get('/create', AffiliateController.createAffiliateForm)
router.get('/:id', AffiliateController.showAffiliateById)
router.post('/', AffiliateController.createAffiliateAction)
router.get('/:id/edit', AffiliateController.editAffiliateForm)
router.post('/:id/edit', AffiliateController.editAffiliateAction)
router.post('/:id/deactivate', AffiliateController.deactivateAffiliateAction)
router.post('/:id/activate', AffiliateController.activateAffiliateAction)

router.post('/user/:id/deactivate', UserController.deactivateUserAction)
router.post('/user/:id/activate', UserController.activateUserAction)



export default router
