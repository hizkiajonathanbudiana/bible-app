"use client";

import { useState } from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendEmailVerification
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false); // Toggle mode
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    const router = useRouter();

    // Handle Google Login
    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            router.push("/");
        } catch (err) {
            setError(err.message);
        }
    };

    // Handle Email Login
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); setMsg("");
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                setError("Please verify your email first. Check your inbox.");
                // Opsional: Logout user kalau belum verify biar gak bisa masuk
                // await signOut(auth); 
                return;
            }

            router.push("/");
        } catch (err) {
            setError("Login failed. Check email/password.");
        }
    };

    // Handle Register + Send Verification
    const handleRegister = async (e) => {
        e.preventDefault();
        setError(""); setMsg("");
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Kirim Link Verifikasi
            await sendEmailVerification(user);

            setMsg(`Account created! A verification link has been sent to ${email}. Please check your inbox (and spam) before logging in.`);
            setIsRegister(false); // Balik ke mode login
            setEmail("");
            setPassword("");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Header Image / Title */}
                <div className="bg-blue-600 p-8 text-center">
                    <h1 className="text-3xl font-bold text-white tracking-wide">Bible Reader</h1>
                    <p className="text-blue-100 mt-2">Learn Mandarin through Scripture</p>
                </div>

                <div className="p-8">
                    {/* Tabs */}
                    <div className="flex border-b mb-6">
                        <button
                            className={`w-1/2 pb-3 font-bold text-lg transition ${!isRegister ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-400'}`}
                            onClick={() => { setIsRegister(false); setError(""); setMsg(""); }}
                        >
                            Login
                        </button>
                        <button
                            className={`w-1/2 pb-3 font-bold text-lg transition ${isRegister ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-400'}`}
                            onClick={() => { setIsRegister(true); setError(""); setMsg(""); }}
                        >
                            Register
                        </button>
                    </div>

                    {/* Messages */}
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm font-medium">{error}</div>}
                    {msg && <div className="bg-green-50 text-green-700 p-3 rounded mb-4 text-sm font-medium">{msg}</div>}

                    {/* Google Button */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg transition mb-4 shadow-sm"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                        Continue with Google
                    </button>

                    <div className="relative flex py-2 items-center mb-4">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">Or with email</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Form */}
                    <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition transform active:scale-95"
                        >
                            {isRegister ? "Create Account" : "Sign In"}
                        </button>
                    </form>

                    {/* Footer Text */}
                    <p className="text-center text-xs text-gray-400 mt-6">
                        By continuing, you agree to our Terms and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
}