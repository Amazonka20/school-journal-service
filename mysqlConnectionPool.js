var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.SCHOOL_JOURNAL_DB_URL,
    user: process.env.SCHOOL_JOURNAL_DB_USER,
    password: process.env.SCHOOL_JOURNAL_DB_PASSWORD,
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