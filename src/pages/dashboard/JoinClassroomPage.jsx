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
        <div className="min-h-screen bg-[#f0f5f1] flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 border border-[#517559]/20">
                <div className="w-16 h-16 bg-[#517559]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Lock size={32} className="text-[#517559]" />
                </div>
                <h1 className="text-2xl font-bold text-center text-[#2d3a2e] mb-2">Join Classroom</h1>
                <p className="text-center text-[#6b7c6e] mb-8">You have been invited to join a classroom.</p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100">
                        {error}
                    </div>
                )}

                {needsPassword && (
                    <form onSubmit={handleJoin} className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-semibold text-[#517559] uppercase tracking-wider mb-2 block">Classroom Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter classroom password"
                                className="w-full px-4 py-3 rounded-xl border-2 border-[#517559]/20 focus:border-[#517559] outline-none transition-colors text-[#2d3a2e]"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#517559] hover:bg-[#3d5e43] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Join Room'}
                        </button>
                    </form>
                )}

                {!needsPassword && isLoading && (
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                        <Loader2 size={32} className="animate-spin text-[#517559]" />
                        <p className="text-[#6b7c6e] font-medium">Joining classroom...</p>
                    </div>
                )}
                
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full mt-4 bg-transparent hover:bg-black/5 text-[#6b7c6e] font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer border-none"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default JoinClassroomPage;
