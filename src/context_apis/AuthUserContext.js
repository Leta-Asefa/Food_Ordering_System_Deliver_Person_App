import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState, useEffect } from "react";

// Create the context
export const AuthUserContext = createContext();

// Custom hook to use the AuthContext
export const useAuthUserContext = () => {
  return useContext(AuthUserContext);
};

// Provider component to wrap your application and provide the auth state
export const AuthUserContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  return (
    <AuthUserContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthUserContext.Provider>
  );
};
