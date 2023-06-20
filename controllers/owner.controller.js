const db = require("../config/database");
const bcrypt = require("bcryptjs");

exports.getOwners = (req, res, next) => {
  db.execute("SELECT * FROM owner")
    .then((result) => {
      res.status(200).json(result[0]);
    })
    .catch((err) => console.log(err));
};

exports.createOwner = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const district = req.body.district;
  const lat = req.body.lat;
  const lng = req.body.lng;

  const hashedPassword = await bcrypt
    .hash(password, 12)
    .then((hashed) => {
      return hashed;
    })

    .catch((err) => console.log(err));

  const [[emailExists, sth]] = await db.execute(
    `Select * FROM player WHERE email = '${email}'`
  );

  if (emailExists) {
    res.status(400).json({
      message: "Email is already exist",
    });
  } else {
    db.execute(
      `INSERT INTO player (username, password, email, phone_number, district, lat, lng) VALUES ('${username}','${hashedPassword}','${email}','${phoneNumber}','${district}',${lat},${lng})`
    )
      .then(
        res.status(201).json({
          message: "Created successfully",
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
      .catch((err) => console.log(err));
  }
};

exports.loginOwner = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const [[owner, sth]] = await db.execute(
    `SELECT * from owner where email = '${email}'`
  );
  if (owner) {
    bcrypt
      .compare(password, owner.password)
      .then((match) => {
        if (match) {
          res.status(200).json({
            id: owner.owner_id,
            name: owner.username,
            email: owner.email,
            phone_number: owner.phone_number,
            role: owner.role,
          });
        } else {
          res.status(401).json({
            message: "Invalid email or password",
          });
        }
      })
      .catch((err) => console.log(err));
  } else {
    res.status(401).json({
      message: "Invalid email or password",
    });
  }
};

/***** 
Ban player to blacklist
*****/

exports.getBanPlayers = (req, res, next) => {
  const field_id = req.params.field_id;

  db.execute(
    `SELECT b.id,p.player_id, p.username, p.email, p.phone_number, f.fieldName, f.type, b.reason FROM SportField.blacklist b JOIN SportField.player p ON b.player_id = p.player_id JOIN SportField.field f ON b.field_id = f.field_id WHERE b.field_id = '${field_id}';`
  )
    .then((result) => {
      res.status(200).json(result[0]);
    })
    .catch((err) => console.log(err));
};

exports.banPlayer = async (req, res, next) => {
  const player_id = req.body.player_id;
  const field_id = req.body.field_id;
  const reason = req.body.reason || "";

  const [[banExists, sth]] = await db.execute(
    `Select * FROM blacklist WHERE player_id = '${player_id}' && field_id = '${field_id}'`
  );

  if (banExists) {
    res.status(400).json({
      message: "Player is already banned.",
    });
  } else {
    db.execute(
      `INSERT INTO blacklist (player_id, field_id, reason) VALUES ('${player_id}','${field_id}','${reason}')`
    )
      .then(
        res.status(201).json({
          message: "Banned successfully",
        })
      )
      .catch((err) => console.log(err));
  }
};

exports.unbanPlayers = (req, res, next) => {
  const player_id = req.query.player_id;
  const field_id = req.query.field_id;

  db.execute(
    `DELETE FROM blacklist WHERE player_id = ${player_id} AND field_id = '${field_id}';`
  )
    .then((result) => {
      res.status(200).json({
        message: "Player unbanned from the field successfully.",
      });
    })
    .catch((err) => console.log(err));
};
