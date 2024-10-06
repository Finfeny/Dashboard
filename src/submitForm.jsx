export default function SubmitForm({dbinputValue, setDbInputValue, selectedDb, setSelectedDb}) {
    return (
        <form onSubmit={(event) => {event.preventDefault(); setSelectedDb(dbinputValue); console.log(selectedDb)}}><label>
            Database:
            <input type="text" value={dbinputValue} onChange={event => {console.log(event.target.value); setDbInputValue(event.target.value)}} /></label>
        <input type="submit" value="Submit" />
        </form>
    )
}

