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

// POST request
router.post('/create', fieldController.createField)

// PUT request
router.put('/update/:fieldId', fieldController.updateField)

// login request
router.delete('/remove/:fieldId', fieldController.deleteField)

module.exports = router  