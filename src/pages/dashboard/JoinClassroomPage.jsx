import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { joinClassroom } from '../../api/classroom.api';
import { Loader2, Lock } from 'lucide-react';

const JoinClassroomPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [needsPassword, setNeedsPassword] = useState(false);

    const handleJoin = async (e) => {
        if(e) e.preventDefault();
        try {
            setIsLoading(true);
            setError('');
            await joinClassroom(token, password);
            navigate('/dashboard');
        } catch (err) {
            const message = err.response?.data?.message || err.message;
            if (message && message.toLowerCase().includes('password')) {
                setNeedsPassword(true);
            }
            setError(message || 'Failed to join classroom. Please check your token or password.');
        } finally {
            setIsLoading(false);
        }
    };

    const hasAttemptedJoin = useRef(false);

    useEffect(() => {
        if (!hasAttemptedJoin.current) {
            hasAttemptedJoin.current = true;
            handleJoin();
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#f0f5f1] dark:bg-[#121612] flex flex-col items-center justify-center p-4 transition-colors duration-200">
            <div className="bg-white dark:bg-[#1A211A] rounded-2xl shadow-xl max-w-md w-full p-8 border border-[#517559]/20 dark:border-white/10 transition-colors duration-200">
                <div className="w-16 h-16 bg-[#517559]/10 dark:bg-[#5D7C59]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Lock size={32} className="text-[#517559] dark:text-[#7A9A7B]" />
                </div>
                <h1 className="text-2xl font-bold text-center text-[#2d3a2e] dark:text-white mb-2">Join Classroom</h1>
                <p className="text-center text-[#6b7c6e] dark:text-gray-400 mb-8">You have been invited to join a classroom.</p>

                {error && (
                    <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm border border-red-100 dark:border-red-500/20">
                        {error}
                    </div>
                )}

                {needsPassword && (
                    <form onSubmit={handleJoin} className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-semibold text-[#517559] dark:text-[#7A9A7B] uppercase tracking-wider mb-2 block">Classroom Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter classroom password"
                                className="w-full px-4 py-3 bg-[#FAFCFA] dark:bg-[#232B23] rounded-xl border-2 border-[#517559]/20 dark:border-white/10 focus:border-[#517559] dark:focus:border-[#7A9A7B] outline-none transition-all text-[#2d3a2e] dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#517559] hover:bg-[#3d5e43] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 border-none cursor-pointer"
                        >
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Join Room'}
                        </button>
                    </form>
                )}

                {!needsPassword && isLoading && (
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                        <Loader2 size={32} className="animate-spin text-[#517559] dark:text-[#7A9A7B]" />
                        <p className="text-[#6b7c6e] dark:text-gray-400 font-medium">Joining classroom...</p>
                    </div>
                )}
                
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full mt-4 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-[#6b7c6e] dark:text-gray-400 font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer border-none"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default JoinClassroomPage;
