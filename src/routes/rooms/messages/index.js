import { Router } from 'express'
import { includes } from 'lodash'
import HttpStatus from 'http-status-codes'
import { messagesDB, roomsDB, usersDB } from '../../../db'

const messages = Router()

messages.post('/', async (req, res) => {
  const { roomId, userId, text } = req.body

  const user = await usersDB.get(userId).catch((error) => {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ error })
  })
  if (!user) return

  const room = await roomsDB.get(roomId).catch((error) => {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ error })
  })
  if (!room) return

  if (!includes(room.users, user.userId)) {
    res.status(HttpStatus.BAD_GATEWAY).json({
      status: HttpStatus.BAD_GATEWAY,
      message: 'User is not in the room',
    })
    return
  }

  messagesDB
    .insert({
      roomId,
      userId: user.userId,
      userName: user.userName,
      text,
      timestamp: new Date().getTime(),
    })
    .then((message) => {
      res.status(200).json(message)
    })
    .catch((error) => {
      res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error })
    })
})

export default messages
