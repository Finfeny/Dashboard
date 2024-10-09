const express = require("express")
const app = express()
var cors = require("cors")

var mysql = require("mysql");

const connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "",
  database : "mysql"
});

app.use(express.json())
app.use(cors())

app.get("/showDatabases", (req, res) => {
  connection.query("SHOW DATABASES", (err, results) => {
    if (err) {
      throw err
    }
    console.log("fetched databases:", results)
    res.json(results)
  })
})

app.post("/changeDb", (req, res) => {
  const newDb = req.body.selectedDb
  console.log("changedb", newDb)

  connection.query(`USE \`${newDb}\``, (err) => {
    if (err) {
      console.error("Error changing database:", err)
      return res.status(500).json({ error: 'Failed to change database', err })
    }
    connection.config.database = newDb
    console.log("Switched to database:", newDb)
    res.json({ database: connection.config.database })
  });
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
  console.log("req.body: ", Object.entries(req.body)[0][1])
  table = Object.entries(req.body)[0][1] // for frontend
  
  answer = connection.query("SELECT * FROM ??", [table], (err, results) => {
    if (err) {
      console.log(err)
      res.json({answer: err})
    }
    else {
      // console.log("results: ", results)
      res.json({answer: results})
    }
  })
})

app.listen(4000, () => {
  console.log("Servu pääl portis 4000")
})