import { Server } from 'socket.io';
import { eventBus } from './eventBus';

let io: Server;

export const initSocket = (server: any) => {
    io = new Server(server, { cors: { origin: '*' } });

    eventBus.onMessage((msg) => {
        io.emit('message', msg);
    });

    io.on('connection', (socket) => {
        console.log('Client connected via WebSocket');
        socket.on('disconnect', () => console.log('Client disconnected'));
    });
};

export const getIo = () => io;