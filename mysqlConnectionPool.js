var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'school_journal_db',
    debug: false
});

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            throw err;
        }
        callback(connection);
        connection.release();
    });
};

module.exports = getConnection;