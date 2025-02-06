import { io } from 'socket.io-client';

const socket = io('ws://localhost:8000'); // Replace with the WebSocket server URL if different

export default socket;

