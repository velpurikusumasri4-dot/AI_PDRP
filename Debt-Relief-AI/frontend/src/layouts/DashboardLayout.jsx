import React, { useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiHome, FiCreditCard, FiPieChart, FiMessageSquare, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const DashboardLayout = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <FiHome className="mr-3" /> },
        { path: '/dashboard/loans', label: 'Loan Management', icon: <FiCreditCard className="mr-3" /> },
        { path: '/dashboard/predictor', label: 'Settlement Predictor', icon: <FiPieChart className="mr-3" /> },
        { path: '/dashboard/ai-negotiation', label: 'AI Negotiation', icon: <FiMessageSquare className="mr-3" /> },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex lg:flex-col transition-transform duration-300 ease-in-out`}>
                <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">AI Debt Relief</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
                        <FiX size={24} />
                    </button>
                </div>
                
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                                location.pathname === item.path
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center mb-4 px-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                    >
                        <FiLogOut className="mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between h-20 px-6 bg-white border-b border-gray-100 lg:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-gray-500 hover:text-gray-700">
                        <FiMenu size={24} />
                    </button>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">AI Debt Relief</span>
                    <div className="w-8"></div> {/* Spacer for centering */}
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
