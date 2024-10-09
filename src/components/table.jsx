export default function Table({isDashLoaded, dashboard}) {
    return (
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
    )
}