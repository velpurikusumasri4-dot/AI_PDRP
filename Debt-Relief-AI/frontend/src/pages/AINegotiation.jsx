import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FiDownload, FiCopy } from 'react-icons/fi';

const AINegotiation = () => {
    const [loans, setLoans] = useState([]);
    const [selectedLoan, setSelectedLoan] = useState('');
    const [tone, setTone] = useState('Professional');
    const [strategy, setStrategy] = useState('Financial Hardship');
    const [letter, setLetter] = useState('');
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

    const handleGenerate = async () => {
        if (!selectedLoan) {
            toast.warn("Please select a loan");
            return;
        }
        setLoading(true);
        try {
            const res = await api.post('/generate-letter', {
                loan_id: parseInt(selectedLoan),
                tone,
                strategy
            });
            setLetter(res.data.letter);
            toast.success("Letter generated!");
        } catch (error) {
            toast.error("Failed to generate letter");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(letter);
        toast.success("Copied to clipboard!");
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        
        // Split text to fit page width
        const lines = doc.splitTextToSize(letter, 180);
        doc.text(lines, 15, 15);
        doc.save("Negotiation_Letter.pdf");
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">AI Negotiation Letter Generator</h1>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Loan</label>
                    <select 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        value={selectedLoan}
                        onChange={(e) => setSelectedLoan(e.target.value)}
                    >
                        <option value="">-- Select Loan --</option>
                        {loans.map(loan => (
                            <option key={loan.id} value={loan.id}>{loan.loan_name} (${loan.outstanding_amount})</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                    <select 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                    >
                        <option value="Professional">Professional</option>
                        <option value="Friendly">Friendly</option>
                        <option value="Firm">Firm</option>
                        <option value="Sympathetic">Sympathetic (Hardship)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Strategy</label>
                    <select 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        value={strategy}
                        onChange={(e) => setStrategy(e.target.value)}
                    >
                        <option value="Financial Hardship">Financial Hardship</option>
                        <option value="One-Time Settlement Offer">One-Time Settlement Offer</option>
                        <option value="Request for Restructuring">Request for Restructuring</option>
                        <option value="Interest Rate Reduction">Interest Rate Reduction</option>
                    </select>
                </div>
                
                <div className="col-span-full flex justify-end">
                    <button 
                        onClick={handleGenerate}
                        disabled={loading}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Generating...' : 'Generate Letter with Gemini AI'}
                    </button>
                </div>
            </div>

            {letter && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-700">Generated Result</h3>
                        <div className="space-x-2 flex">
                            <button onClick={handleCopy} className="flex items-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                <FiCopy className="mr-2" /> Copy
                            </button>
                            <button onClick={handleDownloadPDF} className="flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100">
                                <FiDownload className="mr-2" /> Download PDF
                            </button>
                        </div>
                    </div>
                    <div className="p-8" id="letter-content">
                        <textarea 
                            value={letter}
                            onChange={(e) => setLetter(e.target.value)}
                            className="w-full h-96 p-4 border-0 focus:ring-0 text-gray-800 leading-relaxed resize-none"
                            style={{ fontFamily: 'Georgia, serif' }}
                        />
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default AINegotiation;
