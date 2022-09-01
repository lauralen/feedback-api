const express = require('express')
const { getRequest, getRequests, createRequest,updateRequest,deleteRequest} = require('../controllers/requests')

const router = express.Router()

router.route('/').get(getRequests).post(createRequest)
router.route('/:id').get(getRequest).put(updateRequest).delete(deleteRequest)

module.exports = router