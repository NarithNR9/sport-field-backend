const db = require('../config/database')
const bcrypt = require('bcryptjs')

exports.getPlayers = (req, res, next) => {
  console.log(req.body)
  db.execute('SELECT * FROM player')
    .then((result) => {
      res.status(200).json(result[0])
    })
    .catch((err) => console.log(err))
}

exports.createPlayer = async (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  const email = req.body.email
  const phoneNumber = req.body.phoneNumber
  const district = req.body.district
  const lat = req.body.lat
  const lng = req.body.lng

  const hashedPassword = await bcrypt
    .hash(password, 12)
    .then((hashed) => {
      console.log(hashed)
      return hashed
    })
    .catch((err) => console.log(err))

  const [[emailExists, sth]] = await db.execute(
    `Select * FROM player WHERE email = '${email}'`
  )

  if (emailExists) {
    res.status(400).json({
      message: 'Email is already exist',
    })
  } else {
    db.execute(
      `INSERT INTO player (username, password, email, phone_number, district, lat, lng) VALUES ('${username}','${hashedPassword}','${email}','${phoneNumber}','${district}',${lat},${lng})`
    )
      .then(
        res.status(201).json({
          message: 'Created successfully',
          post: {
            username: username,
            password: hashedPassword,
            email: email,
            phoneNumber: phoneNumber,
            district: district,
            lat: lat,
            lng: lng,
          },
        })
      )
      .catch((err) => console.log(err))
  }
}

exports.loginPlayer = async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  const [[player, sth]] = await db.execute(
    `SELECT * from player where email = '${email}'`
  )
  if (player) {
    bcrypt
      .compare(password, player.password)
      .then((match) => {
        if (match) {
          res.status(200).json({
            id: player.player_id,
            name: player.username,
            email: player.email,
            role: player.role,
          })
        } else {
          res.status(401).json({
            message: 'Invalid email or password',
          })
        }
      })
      .catch((err) => console.log(err))
  } else {
    res.status(401).json({
      message: 'Invalid email or password',
    })
  }
}
