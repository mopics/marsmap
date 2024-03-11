import { useState } from 'react'
import Marsmap from './MarsMap'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Marsmap />
    </>
  )
}

export default App
