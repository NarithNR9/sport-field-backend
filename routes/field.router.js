const express = require('express')

const fieldController = require('../controllers/field.controller')

const router = express.Router()

// GET requset
router.get('/', fieldController.getAllFields)

// GET requset
router.get('/ownerFields/:ownerId', fieldController.getOwnerFields)

// GET requset
router.get('/:fieldId', fieldController.getField)

// GET requset
router.get('/type/:type', fieldController.getFieldByType)

// GET requset
router.get('/rate/rating', fieldController.getFieldByRate)

// GET requset
router.get('/search/:fieldName', fieldController.searchField)

// GET requset
router.get('/stars/:fieldId', fieldController.getFieldStars)

// POST requset
router.post('/rate', fieldController.updateStar)

//GEt
router.get('/playerRate/:playerId/:fieldId', fieldController.playerRate)
 
// POST request 
router.post('/create', fieldController.createField)

// PUT request
router.put('/update/:fieldId', fieldController.updateField)

// login request
router.delete('/remove/:fieldId', fieldController.deleteField)

module.exports = router   