const accesoAArchivos = require('../helpers/accesoAArchivos')

module.exports = (req, res, next) => {
    if (req.cookies.user && !req.session.user){
        const usuarios = accesoAArchivos.getAllUsers();
        req.session.user = usuarios.find(user => user.id == req.cookies.user);
    }
    return next();
}