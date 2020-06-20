import { find } from 'lodash'
import { sendError, NotAutorizedError } from '../../utils/errorHandler'

export const checkPassword = (room, password, res) => {
  if (!!room.password && room.password !== password) {
    if (res) sendError(res, new NotAutorizedError('Invalid room password'))
    return false
  }
  return true
}

export const checkRoomUser = (room, userId, res) => {
  if (!find(room.users, (user) => user.userId === userId)) {
    if (res) sendError(res, new NotAutorizedError('User is not in the room'))
    return false
  }

  return true
}
