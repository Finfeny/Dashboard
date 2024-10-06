export default function TableSelect({table, selectedTable, setSelectedTable, setDashLoaded, isTableLoaded, setError}) {
    return (
        <div>
            Change table: <select value={selectedTable || "undefined"} onChange={event => {setSelectedTable(event.target.value); setDashLoaded(false); setError(null)}}>
                {isTableLoaded && table.tables != undefined  && table.tables.map((item, index) => {
                  return <option key={index} value={Object.entries(item)[0][1]}>{Object.entries(item)[0][1]}</option>
                })}
            </select>
        </div>
    )
}