import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Navbar from "./components/Navbar.jsx"
import About from "./pages/About.jsx"
import Home from "./pages/Home.jsx"

export default function App(){
  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        {/* <Route path="/about" element={<About/>}/> */}
      </Routes>
    </Router>
  )
}
