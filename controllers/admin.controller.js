const db = require('../config/database')
const bcrypt = require('bcryptjs')

exports.getAdmin = (req, res, next) => {
  console.log(req.body)
  db.execute('SELECT * FROM admin')
    .then((result) => {
      res.status(200).json(result[0])
    })
    .catch((err) => console.log(err))
}

exports.createAdmin = async (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  const email = req.body.email

  const hashedPassword = await bcrypt
    .hash(password, 12)
    .then((hashed) => {
      console.log(hashed)
      return hashed
    })

    .catch((err) => console.log(err))

  db.execute(
    `INSERT INTO admin (username, password, email) VALUES ('${username}','${hashedPassword}','${email}')`
  )
    .then(
      res.status(201).json({
        message: 'Created successfully',
        post: { username: username, password: hashedPassword, email: email },
      })
    )
    .catch((err) => console.log(err))
}

exports.loginAdmin = async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  const [[user, sth]] = await db.execute(
    `SELECT * from admin where email = '${email}'`
  )
  if (user) {
    bcrypt
      .compare(password, user.password)
      .then((match) => {
        if (match) {
          res.status(200).json({
            message: 'Login successfully',
          })
        }
        else {
          res.status(401).json({
            message: 'Invalid email or password'
          })
        }
      })
      .catch((err) => console.log(err))
  }
  else {
    res.status(401).json({
      message: 'Invalid email or password'
    })
  }

}
