import { useLocalStorage } from '@uidotdev/usehooks';
import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';


export interface Entry {
  id: string;
  url: string;
  title: string;
  artist: string;
  year: string;
}

function Studio() {

  const [entries, setEntries] = useLocalStorage<Entry[]>('entries', [])
  const [printMode, setPrintMode] = useState(false)
  const [showSongInfo, setShowSongInfo] = useState(false)

  const [undoStack, setUndoStack] = useState<Entry[]>([])

  const addEntry = (entry: Entry) => {
    const updated = [...entries, entry]
    setEntries(updated)
  }

  function deleteEntry(entry: Entry){
    const updated = entries.filter(e => e.id !== entry.id)
    setEntries(updated)
    setUndoStack([...undoStack, entry])
  }

  function undoDelete(){
    if (undoStack.length > 0){
      const entry = undoStack.pop()
      
      if (entry){
        setEntries([...entries, entry])
      }
    }
  }

  function exportEntries(){
    const json = JSON.stringify(entries)
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


    <br />
    <button onClick={() => setShowSongInfo(!showSongInfo)}>Show/hide song info</button>
    {entries.map((e) => <ListInfo deleteEntry={deleteEntry} showAllInfo={showSongInfo} entry={e} key={e.id}></ListInfo>)}

    
    </>
  )
}


function ListInfo({entry, deleteEntry, showAllInfo} :{entry: Entry, deleteEntry: (entry: Entry) => void, showAllInfo: boolean}){
  
  return(
    <div>
      <p>{entry.title}</p>
      {showAllInfo &&
      <p> {entry.artist} | {entry.year} | <a href={entry.url} >spotify link</a> </p>
      }
      <button onClick={() => deleteEntry(entry)}>remove</button>

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
