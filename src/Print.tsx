import { useLocalStorage } from "@uidotdev/usehooks"
import { SongEntry } from "./Studio"
import { QRCodeCanvas } from "qrcode.react"



export const Print = () => {
    const [entries, _] = useLocalStorage<SongEntry[]>('entries', [])

    return(
        <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
        {entries.map((e) => <Card entry={e} key={e.id}></Card>)}
  
      </div>
    )
}


function Card({entry}: {entry: SongEntry}){
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