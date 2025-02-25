const db = require("../config/database");
const khan = require("../data/districtPP");
const getDistanceFromLatLonInKm = require('../function/twoDistance')
const cloudinary = require("../utils/cloudinary");

exports.getAllFields = (req, res, next) => {
  db.execute(`SELECT * FROM field ORDER BY field_id DESC`)
    .then((result) => {
      res.status(200).json(result[0]);
    })
    .catch((err) => console.log(err));
};

exports.getOwnerFields = (req, res, next) => {
  const ownerId = req.params.ownerId;
  db.execute(`SELECT * FROM field WHERE owner_id = ${ownerId}`)
    .then((result) => {
      res.status(200).json(result[0]);
    })
    .catch((err) => console.log(err));
};

exports.getField = (req, res, next) => {
  const fieldId = req.params.fieldId;
  db.execute(`SELECT * FROM field WHERE field_id = ${fieldId}`)
    .then((result) => {
      res.status(200).json(result[0]);
    })
    .catch((err) => console.log(err));
};

exports.getFieldByType = (req, res, next) => {
  const type = req.params.type;
  db.execute(
    `SELECT * FROM field WHERE type = '${type}' ORDER BY field_id DESC`
  )
    .then((result) => {
      res.status(200).json(result[0]);
    })
    .catch((err) => console.log(err));
};

exports.getFieldByRate = (req, res, next) => {
  db.execute(
    `SELECT f.field_id, f.fieldName, avg(stars) as stars, f.parking, f.free_wifi, f.online_payment, f.owner_id, f.type, f.district, f.city, f.lat, f.lng, f.map_link, f.total_pitch, f.average_price, f.image_url, f.description  FROM SportField.field f join SportField.rating r on r.field_id = f.field_id group by f.field_id order by avg(stars) DESC;`
  )
    .then((result) => {
      res.status(200).json(result[0]);
    })
    .catch((err) => console.log(err));
};

exports.getFieldByDistance = async (req, res, next) => {
  const playerId = req.params.id;
  const player = (await db.execute(
    `SELECT * FROM player WHERE player_id = ${playerId}`
  ))[0][0];
  const fields = (await db.execute("SELECT * FROM field"))[0];
  fields.map((field) => {
    // assign distance from player khan to each field khan
    field.distance = getDistanceFromLatLonInKm(player.lat,player.lng,field.lat,field.lng)
  });
  fields.sort((a,b) => a.distance - b.distance)
  return res.status(200).json(fields)
};

exports.searchField = async (req, res) => {
  const fieldName = req.params.fieldName;

  db.execute(`SELECT * FROM field WHERE fieldName LIKE '%${fieldName}%'`)
    .then((result) => {
      res.status(200).json(result[0]);
    })
    .catch((err) => console.log(err));
};

exports.getFieldStars = async (req, res) => {
  const fieldId = req.params.fieldId;

  db.execute(
    `SELECT sum(stars)/count(stars) as avgStars FROM rating WHERE field_id = ${fieldId}`
  )
    .then((result) => {
      res.status(200).json(result[0]);
    })
    .catch((err) => console.log(err));
};

exports.addStar = async (req, res) => {
  const { fieldId, playerId, stars } = req.body;

  db.execute(
    `INSERT INTO rating (player_id, stars, field_id) VALUES('${playerId}', '${stars}', '${fieldId}')`
  )
    .then((result) => {
      res.status(200).json({
        message: "Rated Successfully",
      });
    })
    .catch((err) => console.log(err));
};

exports.updateStar = async (req, res) => {
  const { fieldId, playerId, stars } = req.body;

  const [[alreadyRated, sth]] = await db.execute(
    `Select * FROM rating WHERE player_id = '${playerId}' AND field_id = '${fieldId}'`
  );

  if (alreadyRated) {
    db.execute(
      `UPDATE rating SET stars = '${stars}' WHERE player_id = '${playerId}' AND field_id = '${fieldId}' `
    )
      .then((result) => {
        res.status(200).json({
          message: "Updated Rated Successfully",
        });
      })
      .catch((err) => console.log(err));
  } else {
    db.execute(
      `INSERT INTO rating (player_id, stars, field_id) VALUES('${playerId}', '${stars}', '${fieldId}')`
    )
      .then((result) => {
        res.status(200).json({
          message: "Rated Successfully",
        });
      })
      .catch((err) => console.log(err));
  }
};

exports.playerRate = async (req, res) => {
  const { fieldId, playerId } = req.params;

  db.execute(
    `SELECT stars FROM rating WHERE player_id = ${playerId} AND field_id = ${fieldId} `
  )
    .then((result) => {
      res.status(200).json(result[0]);
    })
    .catch((err) => console.log(err));
};

exports.createField = async (req, res, next) => {
  const fieldName = req.body.fieldName;
  const type = req.body.type;
  const location = req.body.location;
  const averagePrice = req.body.averagePrice;
  const totalPitch = req.body.totalPitch;
  const parking = req.body.parking;
  const onlinePayment = req.body.onlinePayment;
  const freeWifi = req.body.freeWifi;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const ownerId = req.body.ownerId;
  const lat = khan[khan.findIndex((e) => e.name === location)].lat;
  const lng = khan[khan.findIndex((e) => e.name === location)].lng;
  const mapLink = req.body.mapLink;

  db.execute(
    `INSERT INTO field (fieldName, parking, free_wifi, online_payment, owner_id, type, district, lat, lng, map_link, total_pitch, average_price, image_url, description) VALUES ('${fieldName}',${parking},${freeWifi},${onlinePayment},${ownerId},'${type}','${location}',${lat},${lng},'${mapLink}',${totalPitch},${averagePrice},'${imageUrl}','${description}')`
  )
    .then(
      res.status(201).json({
        message: "Field Created Successfully",
        post: {},
      })
    )
    .catch((err) => console.log(err));
};

exports.updateField = async (req, res, next) => {
  const fieldId = req.params.fieldId;
  const fieldName = req.body.fieldName;
  const type = req.body.type;
  const location = req.body.location;
  const averagePrice = req.body.averagePrice;
  const totalPitch = req.body.totalPitch;
  const parking = req.body.parking;
  const onlinePayment = req.body.onlinePayment;
  const freeWifi = req.body.freeWifi;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const ownerId = req.body.ownerId;
  const lat = req.body.lat;
  const lng = req.body.lng;
  const mapLink = req.body.mapLink;

  // if the user change new field img then delete the old one
  const [[imgUrl, sth]] = await db.execute(
    `SELECT image_url from field where field_id = '${fieldId}'`
  );
  const prevImg = imgUrl.image_url;
  if (prevImg !== imageUrl) {
    const imgId = prevImg.slice(
      prevImg.indexOf("fields"),
      prevImg.lastIndexOf(".")
    );
    try {
      await cloudinary.uploader.destroy(imgId);
    } catch (err) {
      console.log(err);
    }
  }

  db.execute(
    `UPDATE field SET fieldName = '${fieldName}', type = '${type}', district = '${location}', average_price = '${averagePrice}', total_pitch = '${totalPitch}', description = 
    '${description}', image_url = '${imageUrl}' WHERE field_id = ${fieldId}`
  )
    .then(
      res.status(201).json({
        message: "Field Updated Successfully",
        post: {},
      })
    )
    .catch((err) => console.log(err));
};

exports.deleteField = async (req, res, next) => {
  const fieldId = req.params.fieldId;

  const [[field, sth]] = await db.execute(
    `SELECT * from field where field_id = '${fieldId}'`
  );
  if (field) {
    const imgId = field.image_url.slice(
      field.image_url.indexOf("fields"),
      field.image_url.lastIndexOf(".")
    );
    try {
      await cloudinary.uploader.destroy(imgId);
    } catch (err) {
      console.log(err);
    }
    db.execute(`DELETE from field where field_id = '${fieldId}'`)
      .then(() => {
        res.status(200).json({
          message: "Field Delete Successfully",
        });
      })
      .catch((err) => {
        res.status(404).json({
          message: err,
        });
      });
  } else {
    res.status(404).json({
      message: "Field not found",
    });
  }
};
