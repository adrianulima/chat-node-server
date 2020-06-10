import { Router } from 'express'

const rooms = Router()

const roomsList = {}

rooms.get('/', (req, res) => {
  const total = Object.keys(roomsList).length
  const { limit = total, offset = 0 } = req.query

  res.status(200).json({
    list: roomsList,
    total,
    limit,
    offset,
  })
})

export default rooms
