import { uniqueId, values, orderBy } from 'lodash'
import HttpStatus from 'http-status-codes'

// eslint-disable-next-line jsdoc/require-returns
/**
 * @param  {{ name:string, idKey?:string}} props
 */
const DBManager = ({ name, idKey }) => {
  if (!name) throw new Error('Name is required')
  idKey = idKey || `${name.toLowerCase()}Id`
  const db = {}

  return {
    /**
     * @param  {string} id
     * @returns  {Promise}
     */
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

    /**
     * @param  {{ offset?:number, limit?:number, sortProp?:string, order?:any}=} props
     * @returns  {Promise<{ list:Array, total:number, limit:number, offset:number }>}
     */
    getAll: ({ offset = 0, limit = 0, sortProp, order = 'asc' } = {}) => {
      limit = limit || Object.keys(db).length

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

    /**
     * @param  {any} item
     * @returns  {Promise}
     */
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

    /**
     * @param  {any} item
     * @returns  {Promise}
     */
    update: (item) => {
      return new Promise((resolve, reject) => {
        if (db[item[idKey]]) {
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

    /**
     * @param  {string} id
     * @returns  {Promise<string>}
     */
    delete: (id) => {
      return new Promise((resolve, reject) => {
        if (db[id]) {
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

    /**
     * @returns  {Promise}
     */
    clear: () => {
      Object.keys(db).forEach((key) => {
        delete db[key]
      })
      return Promise.resolve()
    },
  }
}

export default DBManager
