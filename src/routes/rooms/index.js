import { Router } from 'express'
import { map } from 'lodash'
import { roomsDB } from '../../db'
import messages from './messages'
import HttpStatus from 'http-status-codes'

const rooms = Router()
rooms.use('/:id/messages', messages)

rooms.get('/', (req, res) => {
  const { offset, limit } = req.query
  roomsDB
    .getAll({ offset, limit, sortProp: 'timestamp' })
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
        .json({ error })
    })
})

rooms.get('/:id', (req, res) => {
  const { id } = req.params
  roomsDB
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
        .json({ error })
    })
})

export default rooms
