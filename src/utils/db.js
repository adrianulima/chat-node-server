import { uniqueId, values, sortBy } from 'lodash'

export const DBManager = () => {
  const db = {}

  return {
    get: (id) => {
      return new Promise((resolve, reject) => {
        if (db[id]) resolve(db[id])
        else reject({ error: { status: 401, message: 'Object not found' } })
      })
    },

    getAll: (offset, limit) => {
      return new Promise((resolve, reject) => {
        offset = parseInt(offset) || 0
        limit = parseInt(limit) || Object.keys(db).length

        console.log(offset)
        console.log(offset + limit)
        const list = sortBy(values(db), 'timestamp').slice(
          offset,
          offset + limit
        )

        resolve({
          list: list,
          total: Object.keys(db).length,
          limit,
          offset,
        })
      })
    },

    insert: (room) => {
      return new Promise((resolve, reject) => {
        const id = uniqueId()
        if (!db[id]) {
          db[room.id] = { ...room, id }
          resolve(db[room.id])
        } else reject({ error: { status: 500, message: 'Database error' } })
      })
    },

    update: (room) => {
      return new Promise((resolve, reject) => {
        if (!!db[room.id]) {
          db[room.id] = room
          resolve(room)
        } else reject({ error: { status: 401, message: 'Object not found' } })
      })
    },

    delete: (id) => {
      return new Promise((resolve, reject) => {
        if (!!db[id]) {
          db[id] = null
          resolve(id)
        } else reject({ error: { status: 401, message: 'Object not found' } })
      })
    },
  }
}
