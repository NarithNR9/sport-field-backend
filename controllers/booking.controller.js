const db = require("../config/database");

exports.getAllBookings = (req, res, next) => {
  const today = new Date().toISOString().slice(0, 10);
  db.execute(`SELECT * FROM booking WHERE date >= '${today}'`)
    .then((result) => {
      result[0].map((ele) => {
        ele.date = ele.date.toISOString().slice(0, 10);
      });
      res.status(200).json(result[0]);
    })
    .catch((err) => console.log(err));
};

exports.getMyBookings = (req, res, next) => {
  const pId = req.params.playerId;
  db.execute(
    `SELECT b.booking_id,b.field_id, f.fieldName, b.date, b.time, b.pitch_number, b.status  FROM SportField.booking b join SportField.field f on b.field_id = f.field_id where b.player_id = '${pId}' order by b.date DESC;`
  )
    .then((result) => {
      res.status(200).json(result[0]);
    })
    .catch((err) => console.log(err));
};

// get owner booking
exports.getOwnerBooking = (req, res, next) => {
  const { fieldId, date, type, pitchNumber } = req.query;
  db.execute(
    `SELECT b.booking_id,f.field_id, f.fieldName,f.type, b.date, b.time, b.pitch_number, b.status, p.player_id, p.username, p.email, p.phone_number FROM SportField.booking b join SportField.field f on b.field_id = f.field_id join SportField.player p on b.player_id = p.player_id where f.field_id = '${fieldId}' AND f.type = '${type}' AND b.pitch_number = '${pitchNumber}' AND b.date LIKE '${date}%' order by b.time DESC;`
  )
    .then((result) => {
      res.status(200).json(result[0]);
    })
    .catch((err) => console.log(err));
};

exports.createBooking = async (req, res, next) => {
  const fieldId = req.body.fieldId;
  const playerId = req.body.playerId;
  const date = req.body.date;
  const status = req.body.status;
  const bookedTimestamp = "2023-02-21 11:00:02";
  const pitchNumber = req.body.pitchNumber;
  const time = req.body.time;

  db.execute(
    `INSERT INTO booking (field_id, player_id, date, status, booked_timestamp, pitch_number, time) VALUES ('${fieldId}',${playerId},'${date}','${status}','${bookedTimestamp}','${pitchNumber}','${time}')`
  )
    .then(
      res.status(201).json({
        message: "Field Booked Successfully",
      })
    )
    .catch((err) => console.log(err));
};

exports.cancelBooking = async (req, res) => {
  const bookingId = req.params.bookingId;
  db.execute(`UPDATE booking SET status = "Cancel" WHERE booking_id = ${bookingId}`)
    .then(
      res.status(201).json({
        message: "Booking canceled Successfully",
      })
    )
    .catch((err) => console.log(err));
};