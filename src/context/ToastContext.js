"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: "", type: "", visible: false });

    // Fungsi memanggil notifikasi
    const showToast = (message, type = "success") => {
        setToast({ message, type, visible: true });
        // Auto hide setelah 3 detik
        setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* UI TOAST (Floating di bawah) */}
            <div
                className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-300 ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            >
                <div className={`px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-medium text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-gray-900'}`}>
                    {toast.type === 'success' ? (
                        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    )}
                    {toast.message}
                </div>
            </div>
        </ToastContext.Provider>
    );
};