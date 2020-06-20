import { values, orderBy, filter as _filter } from 'lodash'
import {
  ItemNotFoundError,
  MissingParamError,
  InternalServerError,
} from './ErrorHandler'

const generateId = () => Math.random().toString(36).substr(2, 6).toUpperCase()

// eslint-disable-next-line jsdoc/require-returns
/**
 * @param  {{ name:string, idKey?:string}} props
 */
const DBManager = ({ name, idKey }) => {
  if (!name) throw new MissingParamError('Name')
  idKey = idKey || `${name.toLowerCase()}Id`
  const db = {}

  return {
    /**
     * @param  {string} id
     * @returns  {Promise}
     */
    get: (id) =>
      new Promise((resolve, reject) => {
        if (db[id]) resolve(db[id])
        else reject(new ItemNotFoundError(name))
      }),

    /**
     * @param  {{
     *   offset?: number,
     *   limit?: number,
     *   filter?: Function,
     *   sort?: (Array[]|Function[]|object[]|string[]|string),
     *   order?: any
     * }=} props
     * @returns  {Promise<{ list:Array, total:number, limit:number, offset:number }>}
     */
    getAll: ({ offset = 0, limit = 0, filter, sort, order = 'asc' } = {}) => {
      limit = limit || Object.keys(db).length

      const list = orderBy(_filter(values(db), filter), sort, order).slice(
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
    insert: (item) =>
      new Promise((resolve, reject) => {
        const id = generateId()
        if (!db[id]) {
          db[id] = { ...item, [idKey]: id }
          resolve(db[id])
        } else reject(new InternalServerError())
      }),

    /**
     * @param  {any} item
     * @returns  {Promise}
     */
    update: (item) =>
      new Promise((resolve, reject) => {
        if (db[item[idKey]]) {
          db[item[idKey]] = { ...db[item[idKey]], ...item }
          resolve(db[item[idKey]])
        } else reject(new ItemNotFoundError(name))
      }),

    /**
     * @param  {string} id
     * @returns  {Promise<string>}
     */
    delete: (id) =>
      new Promise((resolve, reject) => {
        if (db[id]) {
          delete db[id]
          resolve(id)
        } else reject(new ItemNotFoundError(name))
      }),

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
