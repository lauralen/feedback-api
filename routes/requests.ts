import express from 'express'
import controller from '../controllers/requests'

const router = express.Router()

router.route('/').get(controller.getRequests).post(controller.createRequest)
router
  .route('/:id')
  .get(controller.getRequest)
  .put(controller.updateRequest)
  .delete(controller.deleteRequest)

export = router
