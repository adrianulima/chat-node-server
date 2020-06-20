import { Router } from 'express'
import HttpStatus from 'http-status-codes'
import { roomsDB, usersDB } from '../../../db'
import { getItem } from '../../../db/helpers'
import { checkPassword, isFull } from '../helpers'
import { sendError } from '../../../utils/errorHandler'

const users = Router({ mergeParams: true })

users.post('/', async (req, res) => {
  const { roomId } = req.params
  const { userName } = req.body
  const { password } = req.headers

  const room = await getItem(roomsDB, roomId, res)
  if (!room) return

  if (!checkPassword(room, password, res)) return

  if (isFull(room, res)) return

  usersDB
    .insert({ userName, roomId })
    .then((user) => {
      room.users = [] || room.users
      room.users.push(user)
      res.status(200).json(user)
    })
    .catch((error) => sendError(res, error))
})

users.get('/', async (req, res) => {
  const { roomId } = req.params
  const { password } = req.headers
  const { offset, limit } = req.query

  const room = await getItem(roomsDB, roomId, res)
  if (!room) return

  if (!checkPassword(room, password, res)) return

  usersDB
    .getAll({
      offset: +offset || 0,
      limit: +limit || 0,
    })
    .then((userList) => res.status(HttpStatus.OK).json(userList))
    .catch((error) => sendError(res, error))
})

export default users
