import React, { useState, useEffect } from "react";
import { Mail, KeyRound, ArrowRight, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const VerifyEmail: React.FC = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [timer, setTimer] = useState(0);

    const navigate = useNavigate();
    const [canLogin, setCanLogin] = useState(false);


    // countdown timer
    useEffect(() => {
        if (timer <= 0) return;
        const t = setTimeout(() => setTimer(timer - 1), 1000);
        return () => clearTimeout(t);
    }, [timer]);

    const sendOtp = async () => {
        if (!email.trim()) {
            setError("Please enter your email first.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setMessage("");

            const res = await axios.post(
                `${API_BASE_URL}/api/auth/send-email-otp`,
                { email: email.trim() }
            );

            // already verified
            if (res.data?.message?.toLowerCase().includes("already verified")) {
                setMessage("Your email is already verified. You can login directly.");
                setCanLogin(true);
                setTimer(0); // no resend timer
                return;
            }

            setMessage("OTP sent to your email");
            setTimer(60);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (!email.trim() || !otp.trim()) {
            setError("Please enter both email and OTP before verifying.");
            setMessage("");
            return;
        }
        try {
            setLoading(true);
            setError("");
            setMessage("");

            await axios.post(`${API_BASE_URL}/api/auth/verify-email-otp`, { email, otp });

            setMessage("Email verified successfully. You can now login.");
            setCanLogin(true);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 bg-[#5186cd] relative">
            {/* Home Icon Button */}
            <Link
                to="/"
                className="absolute top-6 right-6 p-2 rounded-lg bg-[#fef5e4] text-[#1a56ad] backdrop-blur-md hover:bg-[#205eb0]/30 hover:text-[#fef5e4] transition flex items-center justify-center"
                aria-label="Go to Home"
            >
                <Home className="h-6 w-6 transition-colors duration-300" />
            </Link>

            {/* Decorative orbs */}
            <div className="fixed inset-0 pointer-events-none">
                <div
                    className="absolute top-20 left-10 w-32 h-32 rounded-full"
                    style={{ background: "#426fab", opacity: 0.44, animation: "floaty 6s ease-in-out infinite" }}
                />
                <div
                    className="absolute top-44 right-16 w-24 h-24 rounded-full"
                    style={{ background: "#426fab", opacity: 0.4, animation: "floaty 6s ease-in-out infinite", animationDelay: "1.8s" }}
                />
                <div
                    className="absolute bottom-24 left-1/4 w-40 h-40 rounded-full"
                    style={{ background: "#426fab", opacity: 0.43, animation: "floaty 6s ease-in-out infinite", animationDelay: "3.2s" }}
                />
                <div
                    className="absolute bottom-44 right-44 w-24 h-24 rounded-full"
                    style={{ background: "#426fab", opacity: 0.42, animation: "floaty 6s ease-in-out infinite", animationDelay: "1.8s" }}
                />
            </div>

            <div className="max-w-md w-full mx-4 relative z-10">
                {/* Heading */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-white mb-2">
                        Verify Your Email
                    </h1>
                    <p className="text-white text-lg font-extrabold">
                        Enter the OTP sent to your email
                    </p>
                </div>

                {/* Card */}
                <div className="glass-effect rounded-2xl p-8 shadow-2xl bg-white/80 backdrop-blur">
                    {error && (
                        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                            ⚠️ {error}
                        </div>
                    )}

                    {message && (
                        <div className="mb-6 rounded-xl border border-[#34d399] bg-gradient-to-r from-[#ecfdf5] to-[#d1fae5] px-5 py-4 shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#10b981] text-white font-bold">
                                    ✓
                                </div>
                                <p className="text-sm font-semibold leading-snug text-[#065f46]">
                                    {message}
                                </p>
                            </div>
                        </div>
                    )}


                    <div className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-base font-semibold text-[#2D274B] mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9787F3] h-5 w-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* Send OTP */}
                        <button
                            onClick={sendOtp}
                            disabled={loading || timer > 0}
                            className="w-full flex items-center justify-center text-base py-3 rounded-xl font-semibold bg-[#5186cd] text-[#fef5e4] hover:bg-[#095ac4] transition"
                        >
                            {timer > 0 ? `Resend in ${timer}s` : "Send OTP"}
                        </button>

                        {/* OTP */}
                        <div>
                            <label className="block text-base font-semibold text-[#2D274B] mb-2">
                                OTP
                            </label>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9787F3] h-5 w-5" />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300"
                                    placeholder="Enter OTP"
                                />
                            </div>
                        </div>

                        {/* Verify Button */}
                        <button
                            onClick={() => {
                                if (canLogin) {
                                    navigate("/login");
                                } else {
                                    verifyOtp();
                                }
                            }}
                            disabled={loading || (!canLogin && !otp.trim())}
                            className={`w-full flex items-center justify-center text-base py-3 rounded-xl font-semibold transition
                                ${canLogin
                                    ? "bg-[#426fab] text-white hover:bg-[#2f568f]"
                                    : "bg-[#5186cd] text-[#fef5e4] hover:bg-[#095ac4]"
                                }`}
                        >
                            {loading ? (
                                <div className="loading-dots" aria-hidden>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            ) : canLogin ? (
                                <>
                                    Go to Login
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            ) : (
                                <>
                                    Verify Email
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
