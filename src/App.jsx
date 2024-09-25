import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [value, setValue] = useState({})
  const [error, setError] = useState(null)
  const [isLoaded, setLoaded] = useState(false)
  
  useEffect(() => {
    fetch("http://localhost:4000/answers")
      .then(response => response.json())
      .then(data => {setValue(data); setLoaded(true)})
      .catch(err => {console.log("error: ", err); setError("failed fetching")})
  }, [])
  return (
    <>
      <div>{error}</div>
      <table style={{ margin: "0 auto", paddingInline:"2%"}}>
        <thead>
          <tr>
          {isLoaded && Object.entries(value.answers[0]).map((item) =>
              <th style={{backgroundColor: "rgb(64, 64, 64)"}}>
                {item[0]}
              </th>
          )}
          </tr>
        </thead>
        <tbody style={{backgroundColor: "#313131"}}>
          {isLoaded && value.answers.map((row, index) =>
            <tr>
              {Object.entries(row).map((item, index) => 
                <td>{item[1]}</td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}
export default App