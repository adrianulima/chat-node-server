import { Router } from 'express'
import HttpStatus from 'http-status-codes'
import { messagesDB, roomsDB, usersDB } from '../../../db'
import { getItem } from '../../../db/helpers'
import { checkPassword, checkRoomUser } from '../helpers'
import { sendError } from '../../../utils/errorHandler'

const messages = Router({ mergeParams: true })

messages.post('/', async (req, res) => {
  const { roomId } = req.params
  const { userId, text } = req.body
  const password = req.headers

  const user = await getItem(usersDB, userId, res)
  if (!user) return

  const room = await getItem(roomsDB, roomId, res)
  if (!room) return

  if (!checkRoomUser(room, userId, res) || !checkPassword(room, password, res))
    return

  messagesDB
    .insert({
      roomId,
      userId: user.userId,
      userName: user.userName,
      text,
      timestamp: new Date().getTime(),
    })
    .then((message) => res.status(200).json(message))
    .catch((error) => sendError(res, error))
})

messages.get('/', async (req, res) => {
  const { roomId } = req.params
  const { password } = req.headers
  const { offset, limit, after, before } = req.query

  const room = await getItem(roomsDB, roomId, res)
  if (!room) return

  if (!checkPassword(room, password, res)) return

  messagesDB
    .getAll({
      offset: +offset || 0,
      limit: +limit || 0,
      filter: (message) =>
        (!after || message.timestamp > after) &&
        (!before || message.timestamp < before),
      sort: 'timestamp',
      order: 'desc',
    })
    .then((messageList) => res.status(HttpStatus.OK).json(messageList))
    .catch((error) => sendError(res, error))
})

export default messages
