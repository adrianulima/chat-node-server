import { uniqueId, values, orderBy } from 'lodash'
import HttpStatus from 'http-status-codes'

const DBManager = ({ idKey, name }) => {
  if (!name) throw 'Name is required'
  idKey = idKey || `${name.toLowerCase()}Id`
  const db = {}

  return {
    get: (id) => {
      return new Promise((resolve, reject) => {
        if (db[id]) resolve(db[id])
        else
          reject({
            error: {
              status: HttpStatus.NOT_FOUND,
              message: `${name} not found`,
            },
          })
      })
    },


    getAll: ({ offset = 0, limit = 0, sortProp, order = 'asc' } = {}) => {
      offset = parseInt(offset)
      limit = parseInt(limit) || Object.keys(db).length

      const list = orderBy(values(db), sortProp, order).slice(
        offset,
        offset + limit
      )

      return Promise.resolve({
        list: list,
        total: Object.keys(db).length,
        limit,
        offset,
      })
    },

    insert: (item) => {
      return new Promise((resolve, reject) => {
        const id = uniqueId()
        if (!db[id]) {
          db[id] = { ...item, [idKey]: id }
          resolve(db[id])
        } else
          reject({
            error: {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              message: 'Database error',
            },
          })
      })
    },

    update: (item) => {
      return new Promise((resolve, reject) => {
        if (!!db[item[idKey]]) {
          db[item[idKey]] = item
          resolve(item)
        } else
          reject({
            error: {
              status: HttpStatus.NOT_FOUND,
              message: `${name} not found`,
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
              message: `${name} not found`,
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

export default DBManager
