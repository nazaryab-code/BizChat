import SocketIO from 'socket.io-client';
const SOCKET_URL = 'http://192.168.1.50:1234/';

let socket = SocketIO(SOCKET_URL, { transports: ['websocket'] });

export default socket;