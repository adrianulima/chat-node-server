import { Router } from 'express'
import HttpStatus from 'http-status-codes'

const health = Router()

health.get('/', (req, res) =>
  res.status(HttpStatus.OK).json({ uptime: process.uptime() })
)

export default health
