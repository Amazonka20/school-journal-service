var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: `${SCHOOL_JOURNAL_DB_URL}`,
    user: `${SCHOOL_JOURNAL_DB_USER}`,
    password: `${SCHOOL_JOURNAL_DB_PASSWORD}`,
    database: 'school_db',
    debug: false
});

module.exports = pool;