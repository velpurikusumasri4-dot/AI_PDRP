import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts & Pages
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LoanManagement from './pages/LoanManagement';
import SettlementPredictor from './pages/SettlementPredictor';
import AINegotiation from './pages/AINegotiation';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Dashboard />} />
                <Route path="loans" element={<LoanManagement />} />
                <Route path="predictor" element={<SettlementPredictor />} />
                <Route path="ai-negotiation" element={<AINegotiation />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            </Router>
        </AuthProvider>
    );
}

export default App;
