import React, { useState } from 'react';
import AdminLoginForm from './AdminLoginForm';
import OperatorLoginForm from './OperatorLoginForm';

interface DualRoleLandingProps {
    onAdminAuth: (pin: string) => void;
    onLocationAuth: (id: number) => void;
    adminError: string;
    locationError: string;
    clearErrors: () => void;
}

const DualRoleLanding: React.FC<DualRoleLandingProps> = ({
    onAdminAuth,
    onLocationAuth,
    adminError,
    locationError,
    clearErrors
}) => {
    const [choice, setChoice] = useState<'admin' | 'operator' | null>(null);
    const [active, setActive] = useState<'admin' | 'operator' | null>(null);

    const handleSelect = (selected: 'admin' | 'operator') => {
        if (choice === selected) return;
        clearErrors();
        setActive(null); // Instantly unmount current form
        setChoice(selected);
        // Delay mounting the active form until expansion >90% (approx 450ms)
        setTimeout(() => setActive(selected), 450);
    };

    return (
        <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden font-sans">

            {/* Admin Side (Black) */}
            <div
                className={`flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] cursor-pointer relative overflow-hidden bg-black text-white
                    ${choice === null ? 'h-[50%] md:h-full md:w-[50%]' :
                        choice === 'admin' ? 'h-[92%] md:h-full md:w-[95%]' :
                            'h-[8%] md:h-full md:w-[5%] opacity-50 hover:opacity-100 group'}`}
                onClick={() => handleSelect('admin')}
            >
                <div className={`transition-opacity duration-300 w-full flex justify-center h-full items-center ${choice !== null && choice !== 'admin' ? 'opacity-0' : 'opacity-100'}`}>
                    {active === 'admin' ? (
                        <div className="w-full flex justify-center animate-fade-in px-6">
                            <AdminLoginForm onSubmit={onAdminAuth} error={adminError} />
                        </div>
                    ) : (
                        <div className="text-center p-8 transition-transform duration-500 hover:scale-[1.02]">
                            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-2 md:mb-4 whitespace-nowrap">ADMIN</h2>
                            <p className="text-zinc-500 tracking-[0.3em] text-[10px] md:text-xs uppercase whitespace-nowrap">System Management</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Operator Side (White) */}
            <div
                className={`flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] cursor-pointer relative overflow-hidden bg-white text-black
                    ${choice === null ? 'h-[50%] md:h-full md:w-[50%]' :
                        choice === 'operator' ? 'h-[92%] md:h-full md:w-[95%]' :
                            'h-[8%] md:h-full md:w-[5%] opacity-50 hover:opacity-100 bg-zinc-200 group'}`}
                onClick={() => handleSelect('operator')}
            >
                <div className={`transition-opacity duration-300 w-full flex justify-center h-full items-center ${choice !== null && choice !== 'operator' ? 'opacity-0' : 'opacity-100'}`}>
                    {active === 'operator' ? (
                        <div className="w-full flex justify-center animate-fade-in px-6">
                            <OperatorLoginForm onSubmit={onLocationAuth} error={locationError} />
                        </div>
                    ) : (
                        <div className="text-center p-8 transition-transform duration-500 hover:scale-[1.02]">
                            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-2 md:mb-4 whitespace-nowrap">OPERATOR</h2>
                            <p className="text-zinc-500 tracking-[0.3em] text-[10px] md:text-xs uppercase whitespace-nowrap">Location Access</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default DualRoleLanding;
