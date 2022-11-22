import { Routes, Route } from "react-router-dom"
import Landing from "./components/Landing"
import Error from "./components/Error"
import Signup from "./components/Signup"

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing></Landing>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route path="*" element={<Error></Error>}></Route>
      </Routes>
    </>
  )
}
