import { Router } from 'express'
import { map } from 'lodash'
import { DBManager } from '../../utils/db'

const rooms = Router()
const roomManager = DBManager()

rooms.get('/', (req, res) => {
  const { offset, limit } = req.query
  roomManager
    .getAll(offset, limit)
    .then((roomList) => {
      roomList.list = map(roomList.list, (room) => {
        room = Object.assign({}, room)
        room.protected = !!room.password
        delete room.password
        return room
      })
      res.status(200).json(roomList)
      return
    })
    .catch((error) => {
      console.log(error)
      res.status(error.status || 500).send({ error })
      return
    })
})

rooms.get('/:id', (req, res) => {
  const { id } = req.params
  roomManager
    .get(id)
    .then((room) => {
      room = Object.assign({}, room)
      room.protected = !!room.password
      delete room.password
      res.status(200).json(room)
      return
    })
    .catch((error) => {
      res.status(error.status || 500).send({ error })
      return
    })
})

export default rooms
