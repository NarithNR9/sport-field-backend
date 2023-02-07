const db = require('../config/database')
const bcrypt = require('bcryptjs')
const cloudinary = require('../utils/cloudinary')

exports.getAllFields = (req, res, next) => {
  db.execute(`SELECT * FROM field`)
    .then((result) => {
      res.status(200).json(result[0])
    })
    .catch((err) => console.log(err))
}

exports.getOwnerFields = (req, res, next) => {
  const ownerId = req.params.ownerId
  db.execute(`SELECT * FROM field WHERE owner_id = ${ownerId}`)
    .then((result) => {
      res.status(200).json(result[0])
    })
    .catch((err) => console.log(err))
}

exports.getField = (req, res, next) => {
  const fieldId = req.params.fieldId
  db.execute(`SELECT * FROM field WHERE field_id = ${fieldId}`)
    .then((result) => {
      res.status(200).json(result[0])
    })
    .catch((err) => console.log(err))
}

exports.getFieldByType = (req, res, next) => {
  const type = req.params.type
  db.execute(`SELECT * FROM field WHERE type = '${type}'`)
    .then((result) => {
      res.status(200).json(result[0])
    })
    .catch((err) => console.log(err))
}

exports.createField = async (req, res, next) => {
  const fieldName = req.body.fieldName
  const type = req.body.type
  const location = req.body.location
  const averagePrice = req.body.averagePrice
  const totalPitch = req.body.totalPitch
  const parking = req.body.parking
  const onlinePayment = req.body.onlinePayment
  const freeWifi = req.body.freeWifi
  const description = req.body.description
  const imageUrl = req.body.imageUrl
  const ownerId = req.body.ownerId
  const lat = req.body.lat
  const lng = req.body.lng
  const mapLink = req.body.mapLink

  db.execute(
    `INSERT INTO field (fieldName, parking, free_wifi, online_payment, owner_id, type, location, lat, lng, map_link, total_pitch, average_price, image_url, description) VALUES ('${fieldName}',${parking},${freeWifi},${onlinePayment},${ownerId},'${type}','${location}',${lat},${lng},'${mapLink}',${totalPitch},${averagePrice},'${imageUrl}','${description}')`
  )
    .then(
      res.status(201).json({
        message: 'Field Created Successfully',
        post: {},
      })
    )
    .catch((err) => console.log(err))
}

exports.updateField = async (req, res, next) => {
  const fieldId = req.params.fieldId
  const fieldName = req.body.fieldName
  const type = req.body.type
  const location = req.body.location
  const averagePrice = req.body.averagePrice
  const totalPitch = req.body.totalPitch
  const parking = req.body.parking
  const onlinePayment = req.body.onlinePayment
  const freeWifi = req.body.freeWifi
  const description = req.body.description
  const imageUrl = req.body.imageUrl
  const ownerId = req.body.ownerId
  const lat = req.body.lat
  const lng = req.body.lng
  const mapLink = req.body.mapLink

  // if the user change new field img then delete the old one
  const [[imgUrl, sth]] = await db.execute(
    `SELECT image_url from field where field_id = '${fieldId}'`
  )
  const prevImg = imgUrl.image_url
  if (prevImg !== imageUrl) {
    const imgId = prevImg.slice(
      prevImg.indexOf('fields'),
      prevImg.lastIndexOf('.')
    )
    try {
      await cloudinary.uploader.destroy(imgId)
    } catch (err) {
      console.log(err)
    }
  }

  db.execute(
    `UPDATE field SET fieldName = '${fieldName}', type = '${type}', location = '${location}', average_price = '${averagePrice}', total_pitch = '${totalPitch}', description = 
    '${description}', image_url = '${imageUrl}' WHERE field_id = ${fieldId}`
  )
    .then(
      res.status(201).json({
        message: 'Field Updated Successfully',
        post: {},
      })
    )
    .catch((err) => console.log(err))
}

exports.deleteField = async (req, res, next) => {
  const fieldId = req.params.fieldId

  const [[field, sth]] = await db.execute(
    `SELECT * from field where field_id = '${fieldId}'`
  )
  if (field) {
    const imgId = field.image_url.slice(
      field.image_url.indexOf('fields'),
      field.image_url.lastIndexOf('.')
    )
    try {
      await cloudinary.uploader.destroy(imgId)
    } catch (err) {
      console.log(err)
    }
    db.execute(`DELETE from field where field_id = '${fieldId}'`)
      .then(() => {
        res.status(200).json({
          message: 'Field Delete Successfully',
        })
      })
      .catch((err) => {
        res.status(404).json({
          message: err,
        })
      })
  } else {
    res.status(404).json({
      message: 'Field not found',
    })
  }
}
