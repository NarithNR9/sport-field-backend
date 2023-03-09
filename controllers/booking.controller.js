const db = require('../config/database')

exports.getAllBookings = (req, res, next) => {
  const today = new Date().toISOString().slice(0, 10)
  console.log(today)
  db.execute(`SELECT * FROM booking WHERE date >= '${today}'`)
    .then((result) => {
      result[0].map((ele) => {
        ele.date = ele.date.toISOString().slice(0, 10)
      })
      res.status(200).json(result[0])
    })
    .catch((err) => console.log(err))
}

exports.createBooking = async (req, res, next) => {
  const fieldId = req.body.fieldId
  const playerId = req.body.playerId
  const date = req.body.date
  const status = req.body.status
  const bookedTimestamp = '2023-02-21 11:00:02'
  const pitchNumber = req.body.pitchNumber
  const time = req.body.time

  db.execute(
    `INSERT INTO booking (field_id, player_id, date, status, booked_timestamp, pitch_number, time) VALUES ('${fieldId}',${playerId},'${date}','${status}','${bookedTimestamp}','${pitchNumber}','${time}')`
  )
    .then(
      res.status(201).json({
        message: 'Field Booked Successfully',
      })
    )
    .catch((err) => console.log(err))
}

exports.createBooking = async (req, res, next) => {
  const fieldId = req.body.fieldId
  const playerId = req.body.playerId
  const date = req.body.date
  const status = req.body.status
  const bookedTimestamp = req.body.bookedTimestamp
  const pitchNumber = req.body.pitchNumber
  const time = req.body.time

  db.execute(
    `INSERT INTO booking (field_id, player_id, date, status, booked_timestamp, pitch_number, time) VALUES ('${fieldId}',${playerId},'${date}','${status}','${bookedTimestamp}','${pitchNumber}','${time}')`
  )
    .then(
      res.status(201).json({
        message: 'Field Booked Successfully',
      })
    )
    .catch((err) => console.log(err))
}  