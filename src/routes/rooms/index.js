import { Router } from 'express'

const rooms = Router()

const roomsList = []

rooms.get('/', (req, res) => {
  const { limit = roomsList.length, offset = 0 } = req.query

  res.status(200).json({
    list: roomsList,
    total: roomsList.length,
    limit,
    offset,
  })
})

export default rooms
