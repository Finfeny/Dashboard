import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [table, setTable] = useState(null)
  const [dashboard, setBoard] = useState({})
  const [error, setError] = useState(null)
  const [isDashLoaded, setDashLoaded] = useState(false)
  const [isTableLoaded, setTableLoaded] = useState(false)
  const [selectedTable, setSelectedTable] = useState(null)
  
    useEffect(() => {
      const address = "http://localhost:4000/allTables"
      fetch(address)
      .then(response => response.json())
        .then(data => {setTable(data); setTableLoaded(true); console.log("table: ", data.tables); setSelectedTable(Object.entries(data.tables[0])[0][1]); /*setSelectedTable(Object.entries(data.tables[0])[0][1])*/})
        .catch(err => {console.log("error: ", err); setError(`failed fetching from ${address}. Is server on?`)})
    }, [])
  
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
      .then(data => {console.log("dashboard", Object.entries(data.answer)[0]); setBoard(data); setDashLoaded(true)})
      .catch(err => {console.log("error: ", err); setError(`failed fetching from ${address}. Is server on?`)})
  }, [selectedTable])

  useEffect(() => {
    if (isDashLoaded && Object.entries(dashboard.answer)[0] === undefined) {
      setError("Current table is empty");
    } else if (Object.entries(dashboard.answer)[0][0] != "0") {
      console.log("error fetching")
    } else {
      setError(null);
    }
  }, [isDashLoaded, dashboard]);

  return (
    <>
      <div>{error}</div>
      {/* <div>{isDashLoaded && JSON.stringify(Object.entries(dashboard.answer)[0])}</div> */}
      
        Change table: <select value={selectedTable} onChange={event => {setSelectedTable(event.target.value); setDashLoaded(false); setError(null)}}>
          {isTableLoaded && table.tables.map((item, index) => {
            console.log(selectedTable);
            // console.log("ITEM: ", Object.entries(item)[0][1]);
            return <option key={index} value={Object.entries(item)[0][1]}>{Object.entries(item)[0][1]}</option>
          })}
        </select>
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

