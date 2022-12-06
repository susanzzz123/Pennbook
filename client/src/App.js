import { Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Error from "./components/Error";
import Home from "./components/Home";
import Wall from "./components/Wall";
import Signup from "./components/Signup";
import Chat from "./components/Chat";

export function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Landing></Landing>}></Route>
				<Route path="/home" element={<Home></Home>}></Route>
				<Route path="/wall" element={<Wall></Wall>}></Route>
				<Route path="/signup" element={<Signup></Signup>}></Route>
				<Route path="/chat" element={<Chat></Chat>}></Route>
				<Route path="*" element={<Error></Error>}></Route>
			</Routes>
		</>
	);
}
