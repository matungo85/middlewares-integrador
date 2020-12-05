const { body } = require('express-validator');
const fs = require('fs')
const path = require('path')
const accesoAArchivos = require('../helpers/accesoAArchivos')
const bcryptjs = require('bcryptjs')

const validators = {
    register: [
            body('email').isEmail().withMessage('debe consignarse un email')
                .isLength({min:1}).withMessage('campo obligatorio')
                .custom( (value) => {
                    
                    const lecturaDeArchivo = fs.readFileSync(path.join(__dirname, '/../database/users.json'), 'utf-8');

                    if (lecturaDeArchivo == "") {
                        return true
                    } else {
                        let users = JSON.parse(lecturaDeArchivo);
                        if (users.find(user => user.email == value)) {
                            return false
                        } else {
                            return true
                        }
                    }

                }).withMessage('mail ya registrado'),
            body('password').isLength({min: 6}).withMessage('el password debe tener como minimo 6 caracteres')
                .custom((value, {req}) => { return value == req.body.retype}).withMessage('las contraseñas deben ser iguales'),
            body('retype').isLength({min: 1}).withMessage('debe completar este campo'),
            body('avatar').custom((value, {req}) => req.files[0]).withMessage('La imagen es obligatoria').bail()
                .custom((value, {req}) => {
                    const auxi = ['.jpg', '.png', '.jpeg'];
                    extention = path.extname(req.files[0].originalname)
                    return auxi.includes(extention)
                }).withMessage('extension invalida')
    ],

    login: [
            body('email').notEmpty().withMessage('el campo email es obligatorio').bail()
                .isEmail().withMessage('El campo debe ser un email').bail()
                .custom((value, {req}) => {
                    
                    const usuarios = accesoAArchivos.getAllUsers();
                    const usuario = usuarios.find(user => user.email == value);
  
                    if (!usuario){
                        
                        return false
                    } else {
                        return bcryptjs.compareSync(req.body.password, usuario.password);
                    }
                    
                }).withMessage('el usuario y contraseña no coinciden')
    ]


}

module.exports = validators;