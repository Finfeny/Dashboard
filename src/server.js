const express = require("express")
const app = express()
var cors = require("cors")

var mysql = require("mysql");

var connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "",
  database : "kysely"
});

app.use(express.json())
app.use(cors())

app.get("/answers", (req, res) => {
  answers = connection.query("SELECT * FROM answers", (err, results) => {
    res.json({
      answers: results
    })
  })
});

app.get("/allTables", (req, res) => {
  answers = connection.query("SHOW TABLES", (err, results) => {
    console.log(results)
    res.json({
      answers: results
    })
  })
});

app.post("/post", (req, res) => {
  console.log(req.id)

  answer = connection.query("SELECT answer_title FROM `answers` WHERE id = ?", [req.body.id], (err, results) => {
    console.log(results)
    res.json(results)
  })
})

app.listen(4000, () => {
  console.log("Servu pääl portis 4000")
})