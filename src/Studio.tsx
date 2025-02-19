import { useLocalStorage } from '@uidotdev/usehooks';
import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';



interface Entry {
  id: string;
  url: string;
  title: string;
  artist: string;
  year: string;
}

function Studio() {

  const [savedEntries, setSavedEntries] = useLocalStorage<Entry[]>('entries', [])


  const [entries, setEntries] = useState<Entry[]>(savedEntries);
  const [printMode, setPrintMode] = useState(false)


  const [undoStack, setUndoStack] = useState<Entry[]>([])



  const addEntry = (entry: Entry) => {
    const updated = [...entries, entry]
    setEntries(updated)
    setSavedEntries(updated)
  }

  function deleteEntry(entry: Entry){
    const updated = entries.filter(e => e.id !== entry.id)
    setEntries(updated)
    setSavedEntries(updated)
    setUndoStack([...undoStack, entry])
  }

  function undoDelete(){
    if (undoStack.length > 0){
      const entry = undoStack.pop()
      
      if (entry){
        setEntries([...entries, entry])
        setSavedEntries([...savedEntries, entry])
      }
    }
  }

  function exportEntries(){
    const data = entries.map(e => ({
      id: e.id,
      url: e.url,
      title: e.title,
      artist: e.artist,
      year: e.year
    }))
    const json = JSON.stringify(data)
    const blob = new Blob([json], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'entries.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
    <label htmlFor="printMode">Print mode</label>
    <input id='printMode' type="checkbox" checked={printMode} onClick={() => setPrintMode(!printMode)}/>
    <button onClick={exportEntries}>export</button>
    <button onClick={undoDelete}>undo</button>
    
    {!printMode && <Form addEntry={addEntry} />}

    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
      {entries.map((e) => <Card deleteEntry={deleteEntry} entry={e} key={e.id}></Card>)}

    </div>
    
    </>
  )
}

function Card({entry, deleteEntry}: {entry: Entry, deleteEntry: (entry: Entry) => void}){
  const [showRemove, setShowRemove] = useState(false)
  return(
    <div onMouseEnter={() => setShowRemove(true)} onMouseLeave={() => setShowRemove(false)} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', border: '3px solid black', width: '148px', height: '286px'}}>
    <QRCodeCanvas style={{margin: '10px'}} value={entry.url}></QRCodeCanvas>
    <p style={{marginTop: '14px', marginBottom: '5px'}}>{entry.artist}</p>
    <p style={{fontSize: '30px', margin: '5px'}}>{entry.year}</p>
    <p style={{marginTop: '5px', marginBottom: '5px'}}>{entry.title}</p>
    <button style={{display: showRemove ? 'block' : 'none'}} onClick={() => deleteEntry(entry)}>remove</button>
    </div>
  )
}



function Form({addEntry}: {addEntry: (entry: Entry) => void}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget
    const entry: Entry = {
      id: uuidv4(),
      url: (form.elements.namedItem('url') as HTMLInputElement).value,
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      artist: (form.elements.namedItem('artist') as HTMLInputElement).value,
      year: (form.elements.namedItem('year') as HTMLInputElement).value
    }
    addEntry(entry)
  }
  return (
    <form id='songForm' onSubmit={handleSubmit}>
      <label htmlFor="url">url</label>
      <input type="text" id="url" required/>
      <br />
      <label htmlFor="title">title</label>
      <input type="text" id="title" required/>
      <br />
      <label htmlFor="artist">artist</label>
      <input type="text" id="artist" required/>
      <br />
      <label htmlFor="year">year</label>
      <input type="text" id="year" required/>
      <br />
      <button type="submit">Submit</button>
    </form>
  )
}



export default Studio
