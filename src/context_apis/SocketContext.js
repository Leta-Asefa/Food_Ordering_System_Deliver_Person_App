import React, { useEffect, useState, createContext, useContext } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:4000',{ query: {role:'customers'},withCredentials:true});
        setSocket(newSocket);

        // Handle connection and disconnection events
        newSocket.on('connect', () => {
            console.log('Connected to the server');
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from the server');
        });

        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
