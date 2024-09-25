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
  answer = connection.query("SELECT * FROM answers", (err, results) => {
    res.json({
      answer: results
    })
  })
});

app.get("/questions", (req, res) => {
  answer = connection.query("SELECT * FROM questions", (err, results) => {
    res.json({
      answer: results
    })
  })
});

app.get("/allTables", (req, res) => {
  tables = connection.query("SHOW TABLES", (err, results) => {
    console.log(results)
    if (err) {
      console.log(err, "Xampp might be off")
    }
    res.json({
      tables: results
    })
  })
});


app.post("/table", (req, res) => {
  // table = Object.entries(req.body)[1][1] for thuderclient
  console.log("req.body: ", Object.entries(req.body)[0][1])
  table = Object.entries(req.body)[0][1] // for frontend
  
  answer = connection.query("SELECT * FROM ??", [table], (err, results) => {
    if (err)
      console.log(err)
    // console.log("results: ", results)
    res.json({answer: results})
  })
})

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