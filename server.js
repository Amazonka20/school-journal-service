const bodyParser = require('body-parser')
const cors = require('cors');
const session = require('express-session');
const express = require('express');

const getConnection = require('./mysqlConnectionPool');
const crypto = require('crypto');

const app = express();
app.use(session({secret: 'keyboard cat', cookie: {maxAge: 60000}}))
app.use(bodyParser.json());
app.use(cors());


app.post('/register', (request, response) => {
    let body = request.body;
    let encryptedPassword = getEncryptedPassword(body.password);
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
    let encryptedPassword = getEncryptedPassword(password);

    getConnection(function (connection) {
        connection.query("SELECT * FROM teacher WHERE login = ? AND password = ?", [login, encryptedPassword],
            function (err, rows) {
                if (rows.length > 0) {
                    request.session.isLoggedIn = true;
                    request.session.login = login;

                    response.setHeader("sessionId", request.session.id);
                    response.status(200).send();
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


app.get('/students', (request, response) => {
    getConnection(function (connection) {
        connection.query("SELECT * FROM student",
            function (err, rows) {
                if (err) {
                    response.status(400).send(err.message);
                    return;
                }
                response.status(200).send(rows);
            });
    });
});


app.get('/journal', (request, response) => {
    getConnection(function (connection) {
        connection.query("SELECT sb.name as subject, s.last_name as student, " +
            "g.name as 'group', j.mark, j.date FROM journal as j " +
            "LEFT JOIN student as s ON j.student_id = s.id " +
            "LEFT JOIN subject as sb ON j.subject_id = sb.id " +
            "LEFT JOIN school_journal_db.group as g ON s.group_id = g.id",
            function (err, rows) {
                if (err) {
                    response.status(400).send(err.message);
                    return;
                }
                response.status(200).send(rows);
            });
    });
});

const serverPort = 8080;

app.listen(serverPort, () => {
    console.log(`Start server on the port ${serverPort}`);
});
