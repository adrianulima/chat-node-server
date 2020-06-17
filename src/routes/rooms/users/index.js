import { Router } from 'express'
import HttpStatus from 'http-status-codes'
import { roomsDB, usersDB } from '../../../db'
import { getItem } from '../../../db/helpers'
import { checkPassword } from '../helpers'

const users = Router({ mergeParams: true })

users.post('/', async (req, res) => {
  const { roomId } = req.params
  const { userName } = req.body
  const password = req.headers

  const room = await getItem(roomsDB, roomId, res)
  if (!room) return

  if (!checkPassword(room, password, res)) return

  usersDB
    .insert(userName)
    .then((user) => {
      res.status(200).json(user)
    })
    .catch((error) => {
      res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error })
    })
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
    .then((userList) => {
      res.status(HttpStatus.OK).json(userList)
    })
    .catch((error) => {
      res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error })
    })
})

export default users
