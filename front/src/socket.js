import io from 'socket.io-client';
const SOCKET_URL = window.location.origin
const socket = io.connect(process.env.SOCKET_URL);

export default socket;