import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('user'));

    const login = (userData) => {
        const userToStore = {
            ...userData.user,
            token: userData.token
        };
        setUser(userToStore);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userToStore));
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useAuth = () => useContext(AuthContext);