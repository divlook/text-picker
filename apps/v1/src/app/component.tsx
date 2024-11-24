import '@/app/style.css'
import { hi } from '@text-picker/core'

const App = () => {
  console.log(hi())

  return (
    <>
      <div className="flex flex-1 bg-white">
        <h1>App</h1>
        <p>React App</p>
      </div>
    </>
  )
}

export default App
