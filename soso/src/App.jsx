import { BrowserRouter } from "react-router-dom"
import './App.css'
import Menu from "./component/Menu"
import Content from "./component/Content"
import Footer from "./component/Footer"

function App() {

  return (
    <>
    <BrowserRouter>
      <Menu />
        <div className="container-fluid my-5 pt-5">
          <Content />

          <hr />
          <Footer />
        </div>
    </BrowserRouter>
    </>
  )
}

export default App
