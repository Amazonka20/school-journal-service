const bodyParser = require('body-parser')
const cors = require('cors');
const express = require('express');

const getConnection = require('./mysqlConnectionPool');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());
app.use(cors());


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, "process.env.ACCESS_TOKEN_SECRET", (err, user) => {
        if (err) {
            console.log(err)
            return res.sendStatus(403)
        }
        req.user = user
        next()
    });
}


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

function generateAccessToken(username) {
    return jwt.sign(username, "process.env.ACCESS_TOKEN_SECRET", { expiresIn: '1800s' });
}

app.post('/login', (request, response) => {
    let login = request.body.login;
    let password = request.body.password;
    let encryptedPassword = getEncryptedPassword(password);

    getConnection(function (connection) {
        connection.query("SELECT * FROM teacher WHERE login = ? AND password = ?", [login, encryptedPassword],
            function (err, rows) {
                if (rows.length > 0) {
                    const token = generateAccessToken({ login: rows[0].login });
                    response.status(200).send({"token" : token});
                } else {
                    response.status(401).send('Incorrect credentials');
                }
            });
    });
});


app.get('/students', (request, response) => {
    getConnection(function (connection) {
        let groupId = request.query.groupId;

        let allStudents = "SELECT s.id, s.first_name, s.last_name, g.id as group_id, g.name as group_name, s.birth_year " +
            "FROM student as s LEFT JOIN school_journal_db.group as g ON s.group_id = g.id";

        let studentsByGroup = "SELECT s.id, s.first_name, s.last_name, g.id as group_id, g.name as group_name, s.birth_year " +
            "FROM student as s LEFT JOIN school_journal_db.group as g ON s.group_id = g.id WHERE s.group_id = ?";
        connection.query(groupId ? studentsByGroup : allStudents, [groupId],
            function (err, rows) {
                if (err) {
                    response.status(400).send(err.message);
                    return;
                }
                response.status(200).send(rows);
            });
    });
});


app.get('/groups', authenticateToken, (request, response) => {
    getConnection(function (connection) {
        connection.query("SELECT * FROM school_journal_db.group",
            function (err, rows) {
                if (err) {
                    response.status(400).send(err.message);
                    return;
                }
                response.status(200).send(rows);
            });
    });
});


app.get('/subjects', authenticateToken, (request, response) => {
    getConnection(function (connection) {
        connection.query("SELECT * FROM subject",
            function (err, rows) {
                if (err) {
                    response.status(400).send(err.message);
                    return;
                }
                response.status(200).send(rows);
            });
    });
});


app.get('/journal', authenticateToken, (request, response) => {
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

app.post('/journal', authenticateToken, (request, response) => {
    let body = request.body;
    let journalEntry = [
        [body.subject_id, body.student_id, body.mark, new Date().toISOString().slice(0, 19).replace('T', ' ')]
    ];
    getConnection(function (connection) {
        connection.query("INSERT INTO journal (subject_id, student_id, mark, date) VALUES (?)", journalEntry,
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
