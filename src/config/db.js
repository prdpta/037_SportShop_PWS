const mysql = require('mysql2');
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'toko_olahraga',
    port: 3007
});
module.exports = db.promise();