"use client";

import Link from 'next/link';
import { FaDiscord, FaTwitter, FaGithub, FaFlagUsa } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-16">
            <div className="container mx-auto px-6">

                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <FaFlagUsa className="text-blue-600 text-2xl" />
                            <h2 className="text-xl font-bold text-white tracking-tight">Government of San Andreas</h2>
                        </div>
                        <p className="max-w-md leading-relaxed mb-6">
                            Dedicated to serving the citizens of San Andreas with transparency, integrity, and efficiency.
                            Our mission is to uphold the law, protect the public, and foster a thriving community for all.
                        </p>
                        <div className="flex gap-4">
                            {[FaTwitter, FaDiscord, FaGithub].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Quick Links</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/" className="hover:text-blue-400 transition-colors">Home Portal</Link></li>
                            <li><Link href="/lspd" className="hover:text-blue-400 transition-colors">Police Department</Link></li>
                            <li><Link href="/lsems" className="hover:text-blue-400 transition-colors">Medical Services</Link></li>
                            <li><Link href="/doj" className="hover:text-blue-400 transition-colors">Department of Justice</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6 tracking-wide text-sm uppercase">Resources</h3>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Public Records</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Career Opportunities</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Support</a></li>
                            <li><Link href="/admin" className="hover:text-blue-400 transition-colors">Employee Portal</Link></li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                    <p>&copy; {new Date().getFullYear()} Government of San Andreas. All rights reserved.</p>

                    {/* Creator Credit */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full hover:border-indigo-500 hover:bg-slate-800 transition-all cursor-crosshair group shadow-lg shadow-black/20">
                        <img src="/images/damon_icon.png" alt="Damon" className="w-5 h-5 rounded-full grayscale group-hover:grayscale-0 transition-all" />
                        <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-400 tracking-wide uppercase">Created by Damon</span>
                    </div>

                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Accessibility</a>
                    </div>
                </div>

            </div>
        </footer>
    );
}
