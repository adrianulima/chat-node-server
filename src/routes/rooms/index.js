import { Router } from 'express'
import { map } from 'lodash'
import { DBManager } from '../../utils/db'
import HttpStatus from 'http-status-codes'

const rooms = Router()
const roomManager = DBManager()

rooms.get('/', (req, res) => {
  const { offset, limit } = req.query
  roomManager
    .getAll(offset, limit)
    .then((roomList) => {
      roomList.list = map(roomList.list, (room) => {
        room = { ...room }
        room.protected = !!room.password
        delete room.password
        return room
      })
      res.status(HttpStatus.OK).json(roomList)
    })
    .catch((error) => {
      res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error })
    })
})

rooms.get('/:id', (req, res) => {
  const { id } = req.params
  roomManager
    .get(id)
    .then((room) => {
      room = { ...room }
      room.protected = !!room.password
      delete room.password
      res.status(HttpStatus.OK).json(room)
    })
    .catch((error) => {
      res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error })
    })
})

export default rooms
