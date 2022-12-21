import io from "socket.io-client";

const ENDPOINT = "http://localhost:80";
export default io(ENDPOINT);
