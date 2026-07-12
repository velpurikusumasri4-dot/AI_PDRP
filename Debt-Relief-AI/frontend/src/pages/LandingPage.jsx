import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiTrendingDown, FiMessageSquare } from 'react-icons/fi';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md fixed w-full z-50 border-b border-gray-100">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    AI Debt Relief
                </div>
                <div className="space-x-4">
                    <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Log In</Link>
                    <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6"
                >
                    Take Control of Your <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Financial Future</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
                >
                    Leverage AI to analyze your debt, predict settlement opportunities, and generate professional negotiation letters.
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link to="/register" className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                        Start Your Journey <FiArrowRight className="ml-2" />
                    </Link>
                </motion.div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <FeatureCard 
                            icon={<FiTrendingDown size={40} className="text-blue-500" />}
                            title="Settlement Predictor"
                            description="Our AI analyzes your debt profile to predict the most likely settlement percentage and amount."
                        />
                        <FeatureCard 
                            icon={<FiMessageSquare size={40} className="text-purple-500" />}
                            title="AI Negotiation"
                            description="Instantly generate professional, customized negotiation letters using Google's Gemini AI."
                        />
                        <FeatureCard 
                            icon={<FiShield size={40} className="text-green-500" />}
                            title="Financial Health"
                            description="Track your DTI ratio, monthly surplus, and overall financial risk securely."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="p-8 rounded-2xl bg-gray-50 border border-gray-100"
    >
        <div className="mb-6">{icon}</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
);

export default LandingPage;
