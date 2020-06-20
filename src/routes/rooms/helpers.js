import { includes } from 'lodash'
import { sendError, NotAutorizedError } from '../../utils/errorHandler'

export const checkPassword = (room, password, res) => {
  if (!!room.password && room.password !== password) {
    if (res) sendError(res, new NotAutorizedError('Invalid room password'))
    return false
  }
  return true
}

export const checkRoomUsers = (room, userIds, res) => {
  if (!includes(room.users, userIds)) {
    if (res) sendError(res, new NotAutorizedError('User is not in the room'))
    return false
  }

  return true
}
