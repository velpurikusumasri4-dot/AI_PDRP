import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/dashboard');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-full">Loading...</div>;
    }

    if (!stats) return null;

    const { financial_health, loans_distribution, user_name } = stats;

    const pieData = {
        labels: loans_distribution.map(l => l.name),
        datasets: [
            {
                data: loans_distribution.map(l => l.amount),
                backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
                borderWidth: 0,
            },
        ],
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user_name}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Debt" value={`$${financial_health.total_debt.toLocaleString()}`} color="text-red-600" />
                <StatCard title="Monthly EMI" value={`$${financial_health.monthly_emi.toLocaleString()}`} color="text-yellow-600" />
                <StatCard title="Financial Score" value={`${financial_health.health_score}/100`} color="text-green-600" />
                <StatCard title="Risk Category" value={financial_health.risk_category} color="text-blue-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4">Loan Distribution</h3>
                    {loans_distribution.length > 0 ? (
                        <div className="h-64 flex justify-center">
                            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-10">No loans added yet.</p>
                    )}
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4">Health Overview</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <span className="text-gray-600">Debt-to-Income (DTI)</span>
                            <span className="font-bold text-gray-900">{financial_health.dti_ratio}%</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <span className="text-gray-600">Monthly Surplus</span>
                            <span className="font-bold text-gray-900">${financial_health.monthly_surplus.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const StatCard = ({ title, value, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
);

export default Dashboard;
