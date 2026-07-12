import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';

const LoanManagement = () => {
    const [loans, setLoans] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        loan_name: '', lender_name: '', loan_type: '', 
        loan_amount: '', outstanding_amount: '', interest_rate: '', 
        emi: '', monthly_income: '', overdue_months: 0
    });

    const fetchLoans = async () => {
        try {
            const res = await api.get('/loans');
            setLoans(res.data);
        } catch (error) {
            toast.error("Failed to load loans");
        }
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/add-loan', formData);
            toast.success("Loan added successfully");
            setIsModalOpen(false);
            fetchLoans();
        } catch (error) {
            toast.error("Failed to add loan");
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this loan?')) {
            try {
                await api.delete(`/delete-loan/${id}`);
                toast.success("Loan deleted");
                fetchLoans();
            } catch (error) {
                toast.error("Failed to delete loan");
            }
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Loan Management</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <FiPlus className="mr-2" /> Add Loan
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                                <th className="p-4 font-medium">Loan Name</th>
                                <th className="p-4 font-medium">Lender</th>
                                <th className="p-4 font-medium">Outstanding</th>
                                <th className="p-4 font-medium">EMI</th>
                                <th className="p-4 font-medium">Overdue (Mos)</th>
                                <th className="p-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loans.map(loan => (
                                <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-sm text-gray-900 font-medium">{loan.loan_name}</td>
                                    <td className="p-4 text-sm text-gray-600">{loan.lender_name}</td>
                                    <td className="p-4 text-sm text-gray-900">${loan.outstanding_amount}</td>
                                    <td className="p-4 text-sm text-gray-600">${loan.emi}</td>
                                    <td className="p-4 text-sm text-gray-600">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${loan.overdue_months > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {loan.overdue_months}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button onClick={() => handleDelete(loan.id)} className="text-red-500 hover:text-red-700">
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {loans.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">No loans found. Add one to get started.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Add New Loan</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" name="loan_name" placeholder="Loan Name" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <input type="text" name="lender_name" placeholder="Lender Name" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <input type="text" name="loan_type" placeholder="Loan Type (e.g. Credit Card)" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <input type="number" name="loan_amount" placeholder="Total Loan Amount" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <input type="number" name="outstanding_amount" placeholder="Outstanding Amount" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <input type="number" step="0.01" name="interest_rate" placeholder="Interest Rate (%)" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <input type="number" name="emi" placeholder="Monthly EMI" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <input type="number" name="monthly_income" placeholder="Your Monthly Income" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            <input type="number" name="overdue_months" placeholder="Overdue Months (0 if none)" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            
                            <div className="col-span-full flex justify-end space-x-3 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Loan</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default LoanManagement;
