import HttpStatus from 'http-status-codes'
import { includes } from 'lodash'

export const checkPassword = (room, password, res) => {
  if (!!room.password && room.password !== password) {
    if (res)
      res.status(HttpStatus.BAD_GATEWAY).json({
        status: HttpStatus.BAD_GATEWAY,
        message: 'Invalid password',
      })
    return false
  }
  return true
}

export const checkRoomUsers = (room, userIds, res) => {
  if (!includes(room.users, userIds)) {
    if (res)
      res.status(HttpStatus.BAD_GATEWAY).json({
        status: HttpStatus.BAD_GATEWAY,
        message: 'User is not in the room',
      })
    return false
  }

  return true
}
