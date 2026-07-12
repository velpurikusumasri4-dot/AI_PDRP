import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/profile');
                    setUser(response.data);
                } catch (error) {
                    console.error('Error fetching user profile', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = async (email, password) => {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const response = await api.post('/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        
        const userRes = await api.get('/profile');
        setUser(userRes.data);
    };

    const register = async (userData) => {
        await api.post('/register', userData);
        await login(userData.email, userData.password);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
