import { uniqueId, values, sortBy } from 'lodash'
import HttpStatus from 'http-status-codes'

export const DBManager = () => {
  const db = {}

  return {
    get: (id) => {
      return new Promise((resolve, reject) => {
        if (db[id]) resolve(db[id])
        else
          reject({
            error: {
              status: HttpStatus.NOT_FOUND,
              message: 'Object not found',
            },
          })
      })
    },

    getAll: (offset, limit) => {
      offset = parseInt(offset) || 0
      limit = parseInt(limit) || Object.keys(db).length

      const list = sortBy(values(db), 'timestamp').slice(offset, offset + limit)

      return Promise.resolve({
        list: list,
        total: Object.keys(db).length,
        limit,
        offset,
      })
    },

    insert: (room) => {
      return new Promise((resolve, reject) => {
        const id = uniqueId()
        if (!db[id]) {
          db[room.id] = { ...room, id }
          resolve(db[room.id])
        } else
          reject({
            error: {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              message: 'Database error',
            },
          })
      })
    },

    update: (room) => {
      return new Promise((resolve, reject) => {
        if (!!db[room.id]) {
          db[room.id] = room
          resolve(room)
        } else
          reject({
            error: {
              status: HttpStatus.NOT_FOUND,
              message: 'Object not found',
            },
          })
      })
    },

    delete: (id) => {
      return new Promise((resolve, reject) => {
        if (!!db[id]) {
          delete db[id]
          resolve(id)
        } else
          reject({
            error: {
              status: HttpStatus.NOT_FOUND,
              message: 'Object not found',
            },
          })
      })
    },

    clear: () => {
      Object.keys(db).forEach((key) => {
        delete db[key]
      })
      return Promise.resolve()
    },
  }
}
