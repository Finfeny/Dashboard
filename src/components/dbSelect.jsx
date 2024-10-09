export default function DbSelect(    {selectedDb, setSelectedDb, databases, setDashLoaded, setError}) {
    return (
        <select value={selectedDb} onChange={(event) => { setSelectedDb(event.target.value); setDashLoaded(false); setError("Fetching")}}>
        {databases.map((i, index) => {
          return <option key={index}>{i.Database}</option>
        })}
      </select>
    )
}