const express = require('express')
const app = express()
const getConnection = require('./mysqlConnectionPool');

const serverPort = 8080;

app.get('/teachers', (req, res) => {
    getConnection(function (conn) {
        conn.query('SELECT * FROM teacher', function (err, rows) {
            if (err) throw err

            res.send(rows)
        })
    })
})

app.listen(serverPort, () => {
    console.log(`Start server on the port ${serverPort}`)
})
