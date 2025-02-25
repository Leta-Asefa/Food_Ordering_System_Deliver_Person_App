import React from 'react';
import Navigation from './src/Navigation';
import { AuthUserContextProvider } from './src/context_apis/AuthUserContext';
import { LocationContextProvider } from './src/context_apis/Location';
import { SocketContextProvider } from './src/context_apis/SocketContext';


const App = () => {

  return (
    <AuthUserContextProvider>
      <SocketContextProvider>
        <LocationContextProvider>
          <Navigation />
        </LocationContextProvider>
      </SocketContextProvider>
    </AuthUserContextProvider>
  );
};

export default App;
