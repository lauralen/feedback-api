import { Request, Response } from 'express'

const getRequests = (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Get all requests' })
}

const getRequest = (req: Request, res: Response) => {
  res
    .status(200)
    .json({ success: true, message: `Get request ${req.params.id}` })
}

const createRequest = (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Create new request' })
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
