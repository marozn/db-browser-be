import bcrypt from "bcrypt";
import pgPromise from 'pg-promise'
import express from 'express'
import cors from "cors";
import jwt from 'jsonwebtoken';
import auth from './lib/auth.js'

const port = 8080;
const pgp = pgPromise({});
const db = pgp('postgres://postgres:123@localhost:5432/projectpractice')

const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
  }));

app.use(express.json());

app.post("/login/:username/:password", (req, res) => {
   db.one(`SELECT hashedpassword, id FROM users WHERE username = '${req.params.username}'`)
  .then((data) => {
    bcrypt.compare(req.params.password, data.hashedpassword, function (err, result) {
    if (result) {
        const token = jwt.sign({ id: data.id }, "superbigsecretasdfasdfasdfasf");
        res.send({ token })
        }
        else
        {
            res.send("error-auth")     
        }
    })
  })
  .catch((error) => {
    res.send("error-auth")
  })
})

app.post("/create",auth, (req, res) => {
    db.query(`INSERT INTO data (str, num, boo) VALUES ($1, $2, $3)`, [req.body.str, req.body.num, req.body.boo])
    res.send('ok')
})

app.get("/read",auth, (req, res) => {
    db.query('SELECT * FROM data ORDER BY id ASC')
    .then((data) => {
        res.send(data)
    })
})

app.put("/update/:id",auth, (req, res) => {
    db.query(`UPDATE data SET str = $1, num = $2, boo = $3 WHERE id = $4`, [req.body.str, req.body.num, req.body.boo, req.params.id])
    res.send('ok')
})

app.delete("/delete/:id",auth, (req, res) => {
    db.query(`DELETE FROM data WHERE id = $1`, [req.params.id])
    res.send('ok')
})

app.listen(port, () => console.log(`App listening on port ${port}!`))