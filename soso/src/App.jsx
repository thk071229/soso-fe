import { BrowserRouter } from "react-router-dom"
import './App.css'
import Content from "./component/Content"
import Footer from "./component/Footer"
import Header from "./component/Header"

function App() {

  return (
    <>
    <BrowserRouter>
      <Header />
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
