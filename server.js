const express = require('express')
const app = express()
const dbConnectionPool = require('./mysqlConnectionPool');

const serverPort = 8080;

app.get('/teachers', (req, res) => {
    dbConnectionPool.getConnection(function (err, conn) {
        if (err) {
            conn.release();
            throw err;
        }
        conn.query('SELECT * FROM teacher', function (err, rows, fields) {
            if (err) throw err

            res.send(rows)
        })
        conn.release();
    })
})


app.listen(serverPort, () => {
    console.log(`Start server on the port ${serverPort}`)
})
