import { Print } from './Print'
import { Scanner } from './Scanner'
import {Spotify} from './Spotify'
import Studio from './Studio'


export enum Routes {
  scan = '/scan',
  studio = '/studio',
  print = '/print',
  spotify = '/spotify'
}


function App() {
  const route = window.location.pathname
  if (route === Routes.scan) {
    return <Scanner />
  }
  if (route === Routes.studio) {
    return <Studio />
  }
  if (route === Routes.print) {
    return <Print />
  }
  if (route === Routes.spotify) {
    return <Spotify />
  }

  return (
    <div>
      Go to <a href={Routes.scan}>{Routes.scan}</a> to scan QR codes
      <br />
      Go to <a href={Routes.studio}>{Routes.studio}</a> to add new songs
      <br />
      Go to <a href={Routes.print}>{Routes.print}</a> to print songs from studio
      <br />
      Go to <a href={Routes.spotify}>{Routes.spotify}</a> to import songs from Spotify
    </div>
  )
}

export default App
