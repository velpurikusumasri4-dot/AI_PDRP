import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        phone: '' 
    });

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            toast.success('Registration successful!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create an account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Start your journey towards financial freedom
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="John Doe"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Email address"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Password"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
                            <input
                                type="text"
                                name="phone"
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Phone number"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Sign up
                        </button>
                    </div>
                    
                    <div className="text-center text-sm">
                        <span className="text-gray-600">Already have an account? </span>
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign in
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
