import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const SettlementPredictor = () => {
    const [loans, setLoans] = useState([]);
    const [selectedLoan, setSelectedLoan] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const res = await api.get('/loans');
                setLoans(res.data);
            } catch (error) {
                toast.error("Failed to load loans");
            }
        };
        fetchLoans();
    }, []);

    const handlePredict = async () => {
        if (!selectedLoan) {
            toast.warn("Please select a loan first");
            return;
        }
        setLoading(true);
        try {
            const res = await api.post(`/settlement-predict?loan_id=${selectedLoan}`);
            setPrediction(res.data);
            toast.success("Prediction generated successfully!");
        } catch (error) {
            toast.error("Failed to generate prediction");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Settlement Predictor</h1>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select a Loan to Predict Settlement</label>
                <div className="flex gap-4">
                    <select 
                        className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={selectedLoan}
                        onChange={(e) => setSelectedLoan(e.target.value)}
                    >
                        <option value="">-- Choose a Loan --</option>
                        {loans.map(loan => (
                            <option key={loan.id} value={loan.id}>
                                {loan.loan_name} - ${loan.outstanding_amount} (Overdue: {loan.overdue_months} mos)
                            </option>
                        ))}
                    </select>
                    <button 
                        onClick={handlePredict}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Analyzing...' : 'Predict'}
                    </button>
                </div>
            </div>

            {prediction && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold mb-6 border-b pb-4">Prediction Results</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-blue-50 p-6 rounded-xl">
                            <p className="text-sm text-blue-600 font-medium">Recommended Settlement</p>
                            <p className="text-3xl font-bold text-blue-900 mt-2">${prediction.recommended_amount.toLocaleString()}</p>
                            <p className="text-sm text-blue-700 mt-1">({prediction.settlement_percentage}% of outstanding)</p>
                        </div>
                        <div className={`p-6 rounded-xl ${prediction.priority === 'Critical' ? 'bg-red-50' : prediction.priority === 'High' ? 'bg-orange-50' : 'bg-green-50'}`}>
                            <p className={`text-sm font-medium ${prediction.priority === 'Critical' ? 'text-red-600' : prediction.priority === 'High' ? 'text-orange-600' : 'text-green-600'}`}>Priority Level</p>
                            <p className={`text-2xl font-bold mt-2 ${prediction.priority === 'Critical' ? 'text-red-900' : prediction.priority === 'High' ? 'text-orange-900' : 'text-green-900'}`}>{prediction.priority}</p>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">AI Advice</h3>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-xl leading-relaxed">{prediction.advice}</p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default SettlementPredictor;
