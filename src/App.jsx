import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [table, setTable] = useState(null)
  const [dashboard, setBoard] = useState({})
  const [error, setError] = useState(null)
  const [isDashLoaded, setDashLoaded] = useState(false)
  const [isTableLoaded, setTableLoaded] = useState(false)
  const [selectedTable, setSelectedTable] = useState(null)
  const [selectedDb, setSelectedDb] = useState("")
  const [newDb, setNewDb] = useState("")
  const [dbinputValue, setDbInputValue] = useState(selectedDb);

  useEffect(() => {
    console.log(JSON.stringify({selectedDb}))
    fetch("http://localhost:4000/changeDb", {
      method: "POST",
      headers: {"Content-Type": "application/json"}, //sending data in JSON object and not as a string!!!!!!!!
      body: JSON.stringify({selectedDb})})
      .then(response => {setNewDb(response.json()); console.log("newDb: ", newDb)})
      .catch(err => {console.log("error: ", err); setError(`failed changing database to ${selectedDb}. Is server on?`)})
  }, [selectedDb])

  // Fetch all tables from database 
  useEffect(() => {
    const address = "http://localhost:4000/allTables"
    fetch(address)
    .then(response => response.json())
      .then(data => {setTable(data); setTableLoaded(true); console.log("table: ", data.tables); setSelectedTable(Object.entries(data.tables[0])[0][1]);})
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

  // Iterating error options before rendering dashboard
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

  return (
    <>
      <form onSubmit={(event) => {event.preventDefault(); setSelectedDb(dbinputValue); console.log(selectedDb)}}><label>
          Database:
          <input type="text" value={dbinputValue} onChange={event => {console.log(event.target.value); setDbInputValue(event.target.value)}} /></label>
        <input type="submit" value="Submit" />
      </form>
      Change table: <select value={selectedTable || "undefined"} onChange={event => {setSelectedTable(event.target.value); setDashLoaded(false); setError(null)}}>
        {isTableLoaded && table.tables != undefined  && table.tables.map((item, index) => {
          return <option key={index} value={Object.entries(item)[0][1]}>{Object.entries(item)[0][1]}</option>
        })}
      </select>
      <div>{error}</div>
      <table>
        <thead>
          <tr>
          {isDashLoaded && Object.entries(dashboard.answer)[0] != undefined && Object.entries(dashboard.answer)[0][0] == "0" && Object.entries(dashboard.answer[0]).map((item, index) => 
              <th key={index}>
                {item[0]}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {isDashLoaded && Object.entries(dashboard.answer)[0] != undefined && Object.entries(dashboard.answer)[0][0] == "0" && dashboard.answer.map((row, index) => 
            <tr key={index}>
              {Object.entries(row).map((item, index) => 
                <td key={index}>{item[1]}</td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}
export default App

