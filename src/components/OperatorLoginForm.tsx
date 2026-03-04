import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

interface OperatorLoginFormProps {
    onSubmit: (id: number) => void;
    error: string;
}

const OperatorLoginForm: React.FC<OperatorLoginFormProps> = ({ onSubmit, error }) => {
    const [locationIdInput, setLocationIdInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(parseInt(locationIdInput, 10));
    };

    return (
        <div className="flex flex-col items-center animate-fade-in w-full max-w-sm">
            <div className="bg-black text-white p-4 rounded-full mb-8 border-2 border-zinc-800 shadow-lg">
                <MapPin className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-3 tracking-tight text-black">Operator Login</h2>
            <p className="text-zinc-500 text-sm mb-8 text-center">Enter your assigned numeric Location ID.</p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                <div>
                    <input
                        type="number"
                        placeholder="Location ID (1-16)"
                        value={locationIdInput}
                        onChange={(e) => setLocationIdInput(e.target.value)}
                        className="w-full bg-white border-2 border-zinc-300 rounded-xl px-5 py-4 text-center text-xl text-black focus:outline-none focus:border-black transition-colors appearance-none"
                        autoFocus
                        min="1"
                        max="16"
                    />
                </div>
                {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-zinc-800 transition-colors text-lg"
                >
                    Connect
                </button>
            </form>
        </div>
    );
};

export default OperatorLoginForm;
