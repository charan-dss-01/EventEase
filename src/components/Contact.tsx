'use client'
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { TypewriterEffect, TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { motion } from 'framer-motion';

export default function Contact() {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const words = [
        {
          text: "Get",
          className: "text-white",
        },
        {
          text: "in",
          className: "text-white",
        },
        {
          text: "Touch.",
          className: "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600",
        },
      ];
    useEffect(() => {
        setMounted(true);
    }, []);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const form = event.currentTarget;
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    access_key: "6b9f20d0-e0d4-4176-b857-435f09b69437",
                    name: (form.elements.namedItem('name') as HTMLInputElement).value,
                    email: (form.elements.namedItem('email') as HTMLInputElement).value,
                    subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
                    message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
                })
            });
            
            const result = await response.json();
    
            if (result.success) {
                setSuccess(true);
                form.reset();
                setTimeout(() => {
                    setSuccess(false);
                }, 5000);
            } else {
                setError('Failed to send message. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen relative w-full overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
            
            <div className="relative z-30 w-full max-w-6xl mx-auto px-4 py-20">
                <div className='flex justify-center items-center'>
                    <TypewriterEffectSmooth words={words} className="text-4xl md:text-5xl font-extrabold text-white text-center mb-12" />
                </div>
                
                <div className="flex flex-col md:flex-row gap-10 justify-center items-start">
                    {/* Contact Info Card */}
                    <div className="w-full md:w-1/3 bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-zinc-800">
                        <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <i className="fa-solid fa-location-dot text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-2xl"></i>
                                <span className="text-gray-300 text-lg">Hyderabad</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <i className="fa-solid fa-envelope text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-2xl"></i>
                                <span className="text-gray-300 text-lg">cdonthu816@gmail.com</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <i className="fa-solid fa-phone text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-2xl"></i>
                                <span className="text-gray-300 text-lg">9849490777</span>
                            </div>
                            
                            <div className="pt-6 border-t border-zinc-800">
                                <p className="text-gray-400 mb-4">Follow me on:</p>
                                <div className="flex gap-6">
                                    <a href="https://www.instagram.com/dss.charan_143/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-colors">
                                        <i className="fa-brands fa-instagram text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"></i>
                                    </a>
                                    <a href="https://www.linkedin.com/in/charandonthu" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-colors">
                                        <i className="fa-brands fa-linkedin text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"></i>
                                    </a>
                                    <a href="https://github.com/charan-dss-01/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-colors">
                                        <i className="fa-brands fa-github text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="w-full md:w-2/3 bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-zinc-800">
                        <form onSubmit={onSubmit} className="space-y-6" suppressHydrationWarning>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Your Name"
                                        name="name"
                                        className="w-full bg-zinc-800 border border-zinc-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                        suppressHydrationWarning
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        required
                                        placeholder="Your Email"
                                        name="email"
                                        className="w-full bg-zinc-800 border border-zinc-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                        suppressHydrationWarning
                                    />
                                </div>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    required
                                    name="subject"
                                    placeholder="Subject"
                                    className="w-full bg-zinc-800 border border-zinc-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    suppressHydrationWarning
                                />
                            </div>
                            <div>
                                <textarea
                                    rows={6}
                                    required
                                    placeholder="Your Message"
                                    name="message"
                                    className="w-full bg-zinc-800 border border-zinc-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                                    suppressHydrationWarning
                                ></textarea>
                            </div>
                            {error && (
                                <div className="text-red-500 text-sm">{error}</div>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-400 to-pink-600 hover:from-purple-500 hover:to-pink-700 text-white font-bold py-4 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                suppressHydrationWarning
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Success Message Modal */}
            {success && (
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setSuccess(false)}
                >
                    <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl border border-zinc-800 max-w-2xl w-full mx-4 overflow-hidden relative" onClick={e => e.stopPropagation()}>
                        <div className="relative z-10">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fa-solid fa-check text-white text-2xl"></i>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                <p className="text-gray-400 mb-6">Thank you for reaching out. I'll get back to you soon.</p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="bg-gradient-to-r from-purple-400 to-pink-600 hover:from-purple-500 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-all duration-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
