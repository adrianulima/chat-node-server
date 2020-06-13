import HttpStatus from 'http-status-codes'

export const getItem = (db, id, res) => {
  return db.get(id).catch((error) => {
    if (res)
      res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error })
  })
}
