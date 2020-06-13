import DBManager from '../utils/DBManager'

export const roomsDB = DBManager({ name: 'room' })
export const usersDB = DBManager({ name: 'user' })
export const messagesDB = DBManager({ name: 'message' })
