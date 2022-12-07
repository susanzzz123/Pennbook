import io from "socket.io-client";

const ENDPOINT = "http://localhost:3000";
export default io(ENDPOINT);
