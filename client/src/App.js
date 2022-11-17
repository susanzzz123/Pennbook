import { Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import Error from "./components/Error"

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="*" element={<Error></Error>}></Route>
      </Routes>
    </>
  );
}