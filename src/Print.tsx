import { useLocalStorage } from "@uidotdev/usehooks"
import { SongEntry } from "./Studio"
import { QRCodeCanvas } from "qrcode.react"

export type PrintableSong = SongEntry

export const Print = () => {
    const [entries, ] = useLocalStorage<SongEntry[]>('entries', [])

    // Ensure that all entries have unique URLs (which in turn means the entry is unique)
    const deduplicatedEntries = Object.values(Object.fromEntries(
      entries.map(e => ([e.url, e]))
    ))

    return(
      <PrintPage entries={deduplicatedEntries} />
    )
}


export const PrintPage = ({entries}: {entries: PrintableSong[]}) => {
  return <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
    {entries.map((e) => <Card entry={e} key={e.url}></Card>)}
  </div>
}


function Card({entry}: {entry: PrintableSong}){
    return(
      <div id="songCard" style={{display: 'flex', flexDirection: 'column', margin: '1px', alignItems: 'center', border: '3px solid black', width: '250px', height: '490px'}}>
      <QRCodeCanvas size={240} style={{margin: '10px'}} value={entry.url}></QRCodeCanvas>
      <div style={{fontSize: '25px', textAlign: 'center'}}>
        <p style={{margin: '14px'}}>{entry.artist}</p>
        <p style={{fontSize: '60px', margin: '10px'}}>{entry.year}</p>
        <p style={{margin: '10px'}}>{entry.title}</p>

      </div>
      </div>
    )
  }