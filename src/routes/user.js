const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const validators = require('../middlewares/validator')
const userController = require('../controllers/userController');
const {check, validationResult, body} = require('express-validator');
const fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + '/../../public/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname) )
    }
  })
   
  var upload = multer({ storage: storage })

// Muestra la vista de registro
router.get('/register', userController.showRegister);

// Procesa la vista de registro
router.post('/register', upload.any(), validators.register, userController.processRegister);

// Muestra la vista de login
router.get('/login', userController.showLogin);

// Procesa la vista de login
router.post('/login', validators.login, userController.processLogin);

// Muestra el perfil del usuario
router.get('/profile', userController.showProfile);

// Cierra la sesión
router.get('/logout', userController.logout);

module.exports = router;