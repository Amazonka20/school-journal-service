const express = require('express')
const app = express()
var dbConnectionPool = require('./mysqlConnectionPool');

const serverPort = 8080;

app.get('/teachers', (req, res) => {
    let connection = dbConnectionPool.getConnection();

    connection.query('SELECT * FROM school_db.teacher', function (err, rows, fields) {
        if (err) throw err

        res.send(rows)
    })
    connection.release()
})


app.listen(serverPort, () => {
    console.log(`Start server on the port ${serverPort}`)
})
