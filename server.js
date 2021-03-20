const mysql = require('mysql')
const express = require('express')
const app = express()

const serverPort = 8080;

var connection = mysql.createConnection({
    host: `${SCHOOL_JOURNAL_DB_URL}`,
    user: `${SCHOOL_JOURNAL_DB_USER}`,
    password: `${SCHOOL_JOURNAL_DB_PASSWORD}`,
    database: 'school_db'
})


app.get('/teachers', (req, res) => {
    connection.connect()

    connection.query('SELECT * FROM school_db.teacher', function (err, rows, fields) {
        if (err) throw err

        res.send(rows)
    })
    connection.end()
})


app.listen(serverPort, () => {
    console.log(`Start server on the port ${serverPort}`)
})
