const fs = require('fs');
const path = require('path');
const bcryptjs = require('bcryptjs');
const {check, validationResult, body} = require('express-validator');


function getAllUsers () {
    
    const lecturaDeArchivo = fs.readFileSync(path.join(__dirname, '/../database/users.json'), 'utf-8');

    if (lecturaDeArchivo == "") {
        return []
    } else {
        return JSON.parse(lecturaDeArchivo)
    }

}

function saveUser (user){
    let users = getAllUsers();
    users.push(user);
    fs.writeFileSync(path.join(__dirname, '/../database/users.json'), JSON.stringify(users, null, ' '))
}

function generarId() {
    const lecturaDeArchivo = fs.readFileSync(path.join(__dirname, '/../database/users.json'), 'utf-8');

    if (lecturaDeArchivo == "") {
        return 1
    } else {
        let users = JSON.parse(lecturaDeArchivo);
        return users[users.length - 1].id + 1
    }
}

module.exports = {
    showRegister: (req, res) => {
        
        res.render('user/user-register-form');
    },
    processRegister: (req, res) => {
        
        let errors = validationResult(req);
        if(errors.isEmpty()){
            let user = {
                id: generarId(),
                email: req.body.email,
                password: bcryptjs.hashSync(req.body.password, 10),
                avatar: req.files[0].filename,
            };
    
            saveUser(user);
            
            res.redirect('user/login');

        } else {
            
            res.render('user/user-register-form', {errors: errors.errors, mail: req.body.email})

        }


    },
    showLogin: (req, res) => {
        
        return res.render('user/user-login-form');
    },
    processLogin: (req, res) => {
        
        let errors = validationResult(req);

        if (!errors.isEmpty()){
            console.log(errors.errors)
            return res.render('user/user-login-form', {errors: errors.errors, mail: req.body.email});

        } else {
            const usuarios = getAllUsers();
            const usuarioALoguear = usuarios.find(usuario => usuario.email == req.body.email);

            req.session.user = usuarioALoguear;

            if (req.body.remember){
                res.cookie('user', usuarioALoguear.id, { maxAge: 1000 * 60 * 60 });
            }
    
            return res.redirect('/');
        }
        
        return res.send('');
    },
    showProfile: (req, res) => {
        return res.render('user/profile');
    },
    logout: (req, res) => {

        return res.redirect('/');
    }

}