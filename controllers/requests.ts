import { Request, Response } from 'express'
import RequestModel from '../models/Request'

const getRequests = (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Get all requests' })
}

const getRequest = (req: Request, res: Response) => {
  res
    .status(200)
    .json({ success: true, message: `Get request ${req.params.id}` })
}

const createRequest = async (req: Request, res: Response) => {
  try {
    const request = await RequestModel.create(req.body)
    res.status(201).json({ success: true, data: request })
  } catch (error) {
    res.status(400).json({success: false})
  }
  
}

const updateRequest = (req: Request, res: Response) => {
  res
    .status(200)
    .json({ success: true, message: `Update request ${req.params.id}` })
}

const deleteRequest = (req: Request, res: Response) => {
  res
    .status(200)
    .json({ success: true, message: `Delete request ${req.params.id}` })
}

export default {
  getRequests,
  getRequest,
  createRequest,
  updateRequest,
  deleteRequest,
}
