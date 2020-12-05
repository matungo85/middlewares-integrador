const fs = require('fs');
const path = require('path');

module.exports = {
    getAllUsers: () => { 
        const lecturaDeArchivo = fs.readFileSync(path.join(__dirname, '/../database/users.json'), 'utf-8');
        if (lecturaDeArchivo == ''){
            return []
        } else {
            return JSON.parse(lecturaDeArchivo);
        }
    }
}