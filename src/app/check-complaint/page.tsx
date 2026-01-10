import ComplaintLookup from "@/components/ComplaintLookup";
import { FaShieldAlt } from "react-icons/fa";

export default function CheckComplaintPage() {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 relative overflow-hidden font-sans selection:bg-blue-500/30 flex flex-col items-center justify-center p-6">

            {/* Ambient Background Glows */}
            <div className="fixed top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl w-full relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 border border-slate-700 mb-6 shadow-2xl">
                        <FaShieldAlt className="text-4xl text-slate-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        Complaint Status Portal
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Securely track the status of your internal affairs complaint and communicate with department officials.
                    </p>
                </div>

                <ComplaintLookup />

                <div className="mt-12 text-center">
                    <a href="/" className="text-slate-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                        ← Return to Portal
                    </a>
                </div>
            </div>
        </div>
    );
}
