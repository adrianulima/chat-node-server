import { Router } from 'express'
import { map, filter } from 'lodash'
import { roomsDB, usersDB } from '../../db'
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

rooms.get('/', async (req, res) => {
  const { offset, limit } = req.query
  const allUsers = await usersDB.getAll()

  roomsDB
    .getAll({ offset: +offset || 0, limit: +limit || 0, sort: 'timestamp' })
    .then((roomList) => {
      roomList.list = map(roomList.list, (room) => {
        room = { ...room }

        room.usersCount = filter(
          allUsers.list,
          (user) => user.roomId === room.roomId
        ).length

        room.protected = !!room.password
        delete room.password

        return room
      })
      res.status(HttpStatus.OK).json(roomList)
    })
    .catch((error) => sendError(res, error))
})

rooms.get('/:roomId', async (req, res) => {
  const { roomId } = req.params
  const allUsers = await usersDB.getAll()

  roomsDB
    .get(roomId)
    .then((room) => {
      room = { ...room }

      room.users = filter(allUsers.list, (user) => user.roomId === room.roomId)
      room.usersCount = room.users.length

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
