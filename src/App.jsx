import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [table, setTable] = useState(null)
  const [dashboard, setBoard] = useState({})
  const [error, setError] = useState(null)
  const [isDashLoaded, setDashLoaded] = useState(false)
  const [isTableLoaded, setTableLoaded] = useState(false)
  const [selectedTable, setSelectedTable] = useState("answers")
  
  useEffect(() => {
    if (!selectedTable) {
    console.log("Selected table is empty, skipping fetch.")
    return
  }
    console.log("selected table: ", selectedTable)
    const address = "http://localhost:4000/table"
    fetch(address, {
       method: "POST",
       headers: {"Content-Type": "application/json"},
       body: JSON.stringify({selectedTable})
    })
      .then(response => response.json())
      .then(data => {console.log("dashboard", data); setBoard(data); setDashLoaded(true)})
      .catch(err => {console.log("error: ", err); setError(`failed fetching from ${address}. Is server on?`)})
  }, [selectedTable])

  useEffect(() => {
    const address = "http://localhost:4000/allTables"
    fetch(address)
    .then(response => response.json())
      .then(data => {setTable(data); setTableLoaded(true); console.log("table: ", data.tables)})
      .catch(err => {console.log("error: ", err); setError(`failed fetching from ${address}. Is server on?`)})
  }, [])
  return (
    <>
      <div>{error}</div>
        Change table: <select value={selectedTable} onChange={event => {setSelectedTable(event.target.value); setDashLoaded(false)}}>
          {isTableLoaded && table.tables.map((item, index) => {
            console.log(selectedTable);
            // console.log("ITEM: ", Object.entries(item)[0][1]);
            return <option key={index} value={Object.entries(item)[0][1]}>{Object.entries(item)[0][1]}</option>
          })}
        </select>
        <table>
          <thead>
            <tr>
            {isDashLoaded && dashboard.answer[0] && Object.entries(dashboard.answer[0]).map((item, index) => 
                <th key={index}>
                  {item[0]}
                </th>
            )}
            </tr>
          </thead>
          <tbody>
            {isDashLoaded && dashboard.answer.map((row, index) => 
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