import { useLocalStorage } from '@uidotdev/usehooks';
import { useState } from 'react';


export interface SongEntry {
  /** url is used to uniquely identify a song */
  url: string;
  title: string;
  artist: string;
  year: string;
}

function Studio() {
  const [entries, setEntries] = useLocalStorage<SongEntry[]>('entries', [])
  const [showSongInfo, setShowSongInfo] = useState(false)

  const [undoStack, setUndoStack] = useState<SongEntry[]>([])


  const addEntry = (entry: SongEntry) => {
    setEntries(entries => [...entries, entry])
  }


  function deleteEntry(entry: SongEntry){
    const updated = entries.filter(e => e.url !== entry.url)
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

  function readData(uploadedFile: Blob) : Promise<SongEntry[]> {
    return new Promise((resolve, reject) => {
      const fr = new FileReader()
      fr.onload = () => {
        resolve(JSON.parse(fr.result as string))
      }
      fr.onerror = reject
  
      fr.readAsText(uploadedFile)
    })
  }

  return (
    <div id='studio'>
    <button onClick={exportEntries}>export</button>
    <br />
    <label htmlFor='import'>import</label>
    <input type="file" name='import' onChange={(e) => { 
      const files = e.target.files
      if (files){
        readData(files[0]).then(newEntries => {
          const urls = new Set(entries.map(e => e.url))
          newEntries = newEntries.filter(entry => !urls.has(entry.url))
          setEntries([...entries, ...newEntries])
        })
      }
      }}/>
    
    <Form addEntry={addEntry} />


    <br />
    <button onClick={() => setShowSongInfo(!showSongInfo)}>Show/hide song info</button>
    {undoStack.length > 0 && <button onClick={undoDelete}>undo deletion</button>}
    <br />
    <br />
    {entries.map((e) => <SongItem deleteEntry={deleteEntry} showAllInfo={showSongInfo} entry={e} key={e.url}></SongItem>)}

    
    </div>
  )
}


function SongItem({entry, deleteEntry, showAllInfo} :{entry: SongEntry, deleteEntry: (entry: SongEntry) => void, showAllInfo: boolean}){
  
  return(
    <div style={{ margin: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <p style={{ margin: 0 }}>{entry.title}</p>

      {showAllInfo &&
        <span> | {entry.artist} | {entry.year} | <a href={entry.url} >spotify link</a> </span>}

        <button className="studio-button" onClick={() => deleteEntry(entry)}>delete</button>
      </div>
      
      
    </div>
  )
}



function Form({addEntry}: {addEntry: (entry: SongEntry) => void}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget
    const entry: SongEntry = {
      url: (form.elements.namedItem('url') as HTMLInputElement).value,
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      artist: (form.elements.namedItem('artist') as HTMLInputElement).value,
      year: (form.elements.namedItem('year') as HTMLInputElement).value
    }
    addEntry(entry)
    form.reset()
  }
  return (
    <form id='songForm' onSubmit={handleSubmit}>
      <label htmlFor="url">url</label>
      <input type="text" name="url" required/>
      <br />
      <label htmlFor="title">title</label>
      <input type="text" name="title" required/>
      <br />
      <label htmlFor="artist">artist</label>
      <input type="text" name="artist" required/>
      <br />
      <label htmlFor="year">year</label>
      <input type="text" name="year" required/>
      <br />
      <button type="submit">Submit</button>
    </form>
  )
}



export default Studio
