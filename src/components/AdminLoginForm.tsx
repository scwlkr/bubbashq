import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface AdminLoginFormProps {
    onSubmit: (pin: string) => void;
    error: string;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onSubmit, error }) => {
    const [pin, setPin] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(pin);
    };

    return (
        <div className="flex flex-col items-center animate-fade-in w-full max-w-sm">
            <div className="bg-white text-black p-4 rounded-full mb-8 shadow-lg">
                <Lock className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-3 tracking-tight text-white">Admin Access</h2>
            <p className="text-zinc-400 text-sm mb-8 text-center">System control and overview.</p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                <div>
                    <input
                        type="password"
                        placeholder="Enter PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="w-full bg-black border-2 border-zinc-800 rounded-xl px-5 py-4 text-center tracking-[0.5em] text-xl text-white placeholder:tracking-normal focus:outline-none focus:border-white transition-colors"
                        autoFocus
                    />
                </div>
                {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-colors text-lg"
                >
                    Unlock Dashboard
                </button>
            </form>
        </div>
    );
};

export default AdminLoginForm;
