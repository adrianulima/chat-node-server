import { Router } from 'express'
import { map } from 'lodash'
import { roomsDB } from '../../db'
import messages from './messages'
import users from './users'
import HttpStatus from 'http-status-codes'
import { sendError } from '../../utils/errorHandler'

const rooms = Router()
rooms.use('/:roomId/messages', messages)
rooms.use('/:roomId/users', users)

rooms.post('/', (req, res) => {
  const { size, password } = req.body

  roomsDB
    .insert({
      size,
      password,
    })
    .then((room) => {
      room = { ...room }
      room.protected = !!room.password
      delete room.password
      res.status(HttpStatus.OK).json(room)
    })
    .catch((error) => sendError(res, error))
})

rooms.get('/', (req, res) => {
  const { offset, limit } = req.query
  roomsDB
    .getAll({ offset: +offset || 0, limit: +limit || 0, sortProp: 'timestamp' })
    .then((roomList) => {
      roomList.list = map(roomList.list, (room) => {
        room = { ...room }
        room.protected = !!room.password
        delete room.password
        return room
      })
      res.status(HttpStatus.OK).json(roomList)
    })
    .catch((error) => sendError(res, error))
})

rooms.get('/:roomId', (req, res) => {
  const { roomId } = req.params
  roomsDB
    .get(roomId)
    .then((room) => {
      room = { ...room }
      room.protected = !!room.password
      delete room.password
      res.status(HttpStatus.OK).json(room)
    })
    .catch((error) => sendError(res, error))
})

rooms.put('/:roomId', (req, res) => {
  const { roomId } = req.params
  const { size, password } = req.body
  const item = { roomId }

  if (size) item.size = size

  if (password !== undefined) item.password = password

  roomsDB
    .update(item)
    .then((room) => {
      room = { ...room }
      room.protected = !!room.password
      delete room.password
      res.status(HttpStatus.OK).json(room)
    })
    .catch((error) => sendError(res, error))
})

rooms.delete('/:roomId', (req, res) => {
  const { roomId } = req.params

  roomsDB
    .delete(roomId)
    .then((room) => res.status(HttpStatus.OK).json(room))
    .catch((error) => sendError(res, error))
})

export default rooms
