const pool = require('../config/database')

module.exports = {
  create: (data, callBack) => {
    pool.query(
      `INSERT INTO admin (username, email, password) value(?,?,?)`,
      [
        data.username,
        data.email,
        data.password,
      ],
      (error, result, fields) => {
        if (error) {
          return callBack(error)
        }
        return callBack(null, result)
      }
    )
  },
}
