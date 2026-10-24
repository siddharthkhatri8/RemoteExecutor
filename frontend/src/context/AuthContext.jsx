import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    // Make login, register, Token verification logic
    const [token, sT] = useState(localStorage.getItem("token") || "");
    const [user, sU] = useState(null);

    const logOut = () => {
        sT("");
        localStorage.removeItem("token");
        sU(null);
        localStorage.removeItem("user");
    };
    const setToken = (newToken) => {
        sT(newToken);
        localStorage.setItem("token", newToken);
    };
    const setUser = (newUser) => {
        sU(newUser);
        localStorage.setItem("user", newUser);
    };

    return (
        <AuthContext.Provider
            value={{ token, setToken, user, setUser, logOut }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};