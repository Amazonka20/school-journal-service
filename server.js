const bodyParser = require('body-parser')
const cors = require('cors');
const express = require('express');

const getConnection = require('./mysqlConnectionPool');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/teachers', (req, res) => {
    getConnection(function (conn) {
        conn.query('SELECT * FROM teacher', function (err, rows) {
            if (err) throw err;

            res.send(rows);
        });
    });
});


app.post('/teachers/register', (req, res) => {
    let body = req.body;
    let encryptedPassword =  crypto.createHash('md5').update(body.password).digest('hex');
    let teacher = [
        [body.first_name, body.last_name, body.login, encryptedPassword, body.position]
    ];

    getConnection(function (conn) {
        conn.query("INSERT INTO teacher (first_name, last_name, login, password, position) VALUES ?", [teacher],
            function (err, rows) {
                if (err) {
                    res.status(400).send(err.message);
                    return;
                }

                body.id = rows.insertId;
                res.status(200).send(body);
            });
    });
});


const serverPort = 8080;

app.listen(serverPort, () => {
    console.log(`Start server on the port ${serverPort}`);
});
