import { useEffect, useState } from 'react'
import './App.css'
import Table from './components/table'
import TableSelect from './components/tableSelect'
import SubmitForm from './components/submitForm.jsx'
import DbSelect from './components/dbSelect.jsx'


function App() {

  const [databases, setDatabases] = useState([])
  const [table, setTable] = useState(null)
  const [dashboard, setBoard] = useState({})
  const [error, setError] = useState(null)
  const [isDashLoaded, setDashLoaded] = useState(false)
  const [isTableLoaded, setTableLoaded] = useState(false)
  const [selectedTable, setSelectedTable] = useState(null)
  const [selectedDb, setSelectedDb] = useState("mysql")
  const [newDb, setNewDb] = useState("")
  const [dbinputValue, setDbInputValue] = useState(selectedDb);


// Iterating error options
useEffect(() => {
  if (selectedDb == "") {
    setError("No database selected or empty")
  } else if (table == null) {
    setError("No tables found in database")
  } else if (isDashLoaded && Object.entries(dashboard.answer)[0] === undefined) {
    setError("Current table is empty")
  } else if (isDashLoaded && Object.entries(dashboard.answer)[0][0] != "0") {
    setError("Error fetching: ", JSON.stringify(Object.entries(dashboard.answer)))
  } else {
    setError(null);
  }
}, [isDashLoaded, dashboard]);

  useEffect(() => {
    const address = "http://localhost:4000/showDatabases"
    fetch(address)
      .then(response => response.json())
      .then(data => {setDatabases(data)})
      .catch(err => console.log(err))
  }, [])

  // Change database
  useEffect(() => {
    console.log(JSON.stringify({selectedDb}))
    fetch("http://localhost:4000/changeDb", {
      method: "POST",
      headers: {"Content-Type": "application/json"}, //sending data in JSON object and not as a string!!!!!!!!
      body: JSON.stringify({selectedDb})})
      .then(response => response.json())
      .then(data => {
        if (data.database != undefined)
          setNewDb(data)
        console.log("test", data.error)})
      .catch(err => {console.log("error: ", err); setError(`failed changing database to ${selectedDb}. Is server on?`)})
  }, [selectedDb])


  // Fetch all tables from database 
  useEffect(() => {
    console.log("newDb: ", newDb) 
    const address = "http://localhost:4000/allTables"
    fetch(address)
    .then(response => response.json())
      .then(data => {setTable(data); setTableLoaded(true); /*console.log("table: ", data.tables);*/ setSelectedTable(Object.entries(data.tables[0])[0][1]);})
      .catch(err => {console.log(`failed fetching tables from database ${selectedDb} from address ${address}. Is server on?`); console.log("error: ", err)})
  }, [selectedDb, newDb])
  

  // Fetch selected table from database
  useEffect(() => {
    if (!selectedTable) {
    console.log("Selected table is empty, skipping fetch.")
    return
    }
    const address = "http://localhost:4000/table"
    fetch(address, {
       method: "POST",
       headers: {"Content-Type": "application/json"},
       body: JSON.stringify({selectedTable})
    })
      .then(response => response.json())
      .then(data => {console.log("dashboard", Object.entries(data.answer)[0]); setBoard(data); setDashLoaded(true)})
      .catch(err => {console.log("error: ", err); setError(`failed fetching dashboard from ${address}. Is server on?`)})
  }, [selectedTable])



  // Table rendering
  return (
    <div className='content'>

      Database
      <DbSelect
        selectedDb={selectedDb} setSelectedDb={setSelectedDb}
        databases={databases}
        setDashLoaded={setDashLoaded} setError={setError}/>

      Table
      <TableSelect
        table={table}
        selectedTable={selectedTable} setSelectedTable={setSelectedTable}
        setDashLoaded={setDashLoaded}
        isTableLoaded={isTableLoaded}
        setError={setError}/>

      <div>{error}</div>
      
      <Table isDashLoaded={isDashLoaded} dashboard={dashboard}/>
    </div>
  )
}
export default App