import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const PaymentPage = () => {
    const [schoolId, setSchoolId] = useState('');
    const [amount, setAmount] = useState('');
    const [callbackUrl, setCallbackUrl] = useState('');
    const [loading, setLoading] = useState(false);


    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
      
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/create-payment`,
                { school_id: schoolId, amount, callback_url: callbackUrl },
                { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
            );
            const { collect_request_url } = response.data;
            toast.success('Payment request created successfully! Redirecting...');
            window.location.href = collect_request_url;
        } catch (err: unknown) {
            console.error('Error creating payment:', err);
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error('Failed to create payment. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm scale-105"
                style={{
                    backgroundImage:
                        `url('https://s3.ap-south-1.amazonaws.com/prod-easebuzz-static/static/base/assets_aug_2021/img/easebuzz/easebuzz-explainer/explainers-features-and-updates/electronic-payment/electronic-payment.png')`,
                }}
            ></div>

            {/* Optional Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#05011b]/80 to-[#0a1440]/80 mix-blend-multiply" />

            {/* Dark Mode Toggle and Dashboard Link */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-4">
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="px-3 py-2 rounded-full hover:cursor-pointer bg-white/20 text-white hover:bg-white/40 text-sm font-medium shadow backdrop-blur-md"
                >
                    {darkMode ? '🌞' : '🌙'}
                </button>
                <a
                    href="/dashboard"
                    className="px-3 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 text-sm font-medium shadow"
                >
                    ⬅️ Dashboard
                </a>
            </div>

            {/* Payment Card */}
            <div
                className={`relative z-10 w-full max-w-md p-10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.6)] border transition-colors duration-300 ${
                    darkMode
                        ? 'bg-white/10 border-white/30 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                }`}
            >
                <h1
                    className={`text-3xl font-bold text-center mb-6 ${
                        darkMode ? 'text-white' : 'text-gray-800'
                    }`}
                >
                    💳 Secure Payment
                </h1>

                <form onSubmit={handlePayment} className="space-y-5">
                    {[
                        { id: 'schoolId', value: schoolId, setter: setSchoolId, label: 'School ID', icon: '🏫' },
                        { id: 'amount', value: amount, setter: setAmount, label: 'Amount', icon: '💰' },
                        { id: 'callbackUrl', value: callbackUrl, setter: setCallbackUrl, label: 'Callback URL', icon: '🔗' }
                    ].map(({ id, value, setter, label, icon }) => (
                        <div key={id} className="relative">
                            <input
                                id={id}
                                type={id === 'amount' ? 'number' : id === 'callbackUrl' ? 'url' : 'text'}
                                value={value}
                                onChange={(e) => setter(e.target.value)}
                                required
                                placeholder=""
                                className={`w-full px-4 pt-6 pb-2 text-sm rounded-md border peer transition-colors ${
                                    darkMode
                                        ? 'bg-white/10 border-white/30 text-white placeholder-transparent focus:ring-indigo-500'
                                        : 'bg-white border-gray-300 text-gray-800 placeholder-transparent focus:ring-indigo-500'
                                } focus:outline-none focus:ring-2`}
                            />
                            <label
                                htmlFor={id}
                                className={`absolute left-4 top-2 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm ${
                                    darkMode ? 'text-gray-600 peer-focus:text-white' : 'text-gray-600 peer-focus:text-indigo-600'
                                }`}
                            >
                                {icon} {label}
                            </label>
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-6 hover:cursor-pointer font-semibold rounded-full shadow-lg transition-all flex items-center justify-center gap-2 ${
                            loading
                                ? 'bg-indigo-300 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z" />
                                </svg>
                                Processing...
                            </>
                        ) : (
                            'Pay Now'
                        )}
                    </button>
                </form>

              
                
            </div>
        </div>
    );
};

export default PaymentPage;
