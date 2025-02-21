import { useLocalStorage } from "@uidotdev/usehooks"
import { Entry } from "./Studio"
import { QRCodeCanvas } from "qrcode.react"



export const Print = () => {
    const [entries, _] = useLocalStorage<Entry[]>('entries', [])

    return(
        <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
        {entries.map((e) => <Card entry={e} key={e.id}></Card>)}
  
      </div>
    )
}


function Card({entry}: {entry: Entry}){
    return(
      <div style={{display: 'flex', flexDirection: 'column', margin: '1px', alignItems: 'center', border: '3px solid black', width: '250px', height: '490px'}}>
      <QRCodeCanvas size={240} style={{margin: '10px'}} value={entry.url}></QRCodeCanvas>
      <p style={{ fontSize: '25px', marginTop: '14px', marginBottom: '5px'}}>{entry.artist}</p>
      <p style={{fontSize: '60px', margin: '5px'}}>{entry.year}</p>
      <p style={{ fontSize: '25px',marginTop: '5px', marginBottom: '5px'}}>{entry.title}</p>
      </div>
    )
  }