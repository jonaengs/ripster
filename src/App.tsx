import { Scanner } from './Scanner'

function App() {
  const route = window.location.pathname
  if (route === '/scan') {
    return <Scanner />
  }

  return <div>
    Go to <a href="/scan">/scan</a> to scan QR codes
  </div>
}

export default App
