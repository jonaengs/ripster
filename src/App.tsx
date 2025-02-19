import { Scanner } from './Scanner'
import Studio from './Studio'

function App() {
  const route = window.location.pathname
  if (route === '/scan') {
    return <Scanner />
  }
  if (route === '/studio') {
    return <Studio />
  }


  return <div>
    Go to <a href="/scan">/scan</a> to scan QR codes
    <br />
    Go to <a href="/studio">/studio</a> to add new songs
  </div>
}

export default App
