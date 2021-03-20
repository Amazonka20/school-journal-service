const bodyParser = require('body-parser')
const cors = require('cors');
const session = require('express-session');
const express = require('express');

const getConnection = require('./mysqlConnectionPool');
const crypto = require('crypto');

const app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(cors());


app.post('/register', (request, response) => {
    let body = request.body;
    let encryptedPassword =  getEncryptedPassword(body.password);
    let teacher = [
        [body.first_name, body.last_name, body.login, encryptedPassword, body.position]
    ];

    getConnection(function (connection) {
        connection.query("INSERT INTO teacher (first_name, last_name, login, password, position) VALUES ?", [teacher],
            function (err, rows) {
                if (err) {
                    response.status(400).send(err.message);
                    return;
                }

                body.id = rows.insertId;
                response.status(200).send(body);
            });
    });
});

function getEncryptedPassword(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}

app.post('/login', (request, response) => {
    let login = request.body.login;
    let password = request.body.password;
    let encryptedPassword =  getEncryptedPassword(password);

    getConnection(function (connection) {
        connection.query("SELECT * FROM teacher WHERE login = ? AND password = ?", [login, encryptedPassword],
            function (err, rows) {
                if (rows.length > 0) {
                    request.session.isLoggedIn = true;
                    request.session.login = login;
                    response.status(200).end();
                } else {
                    response.status(401).send('Incorrect credentials');
                }
            });
    });
});

app.post('/logout', (request, response) => {
    if (request.session.isLoggedIn) {
        request.session = null;
        response.status(200).end();
    } else {
        response.status(400).end();
    }
});


const serverPort = 8080;

app.listen(serverPort, () => {
    console.log(`Start server on the port ${serverPort}`);
});
