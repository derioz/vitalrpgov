import { getChangelog } from '@/lib/changelog';
import ReactMarkdown from 'react-markdown';
import { FaCode, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default async function ChangelogPage() {
    const changelogs = await getChangelog();

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header with Damon's Attribution */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>

                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full border-4 border-slate-700/50 shadow-xl overflow-hidden relative group">
                        <img
                            src="/vitalrpgov/images/damon_icon.png"
                            alt="Damon"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight mb-1">System Updates</h1>
                        <p className="text-slate-400 font-medium flex items-center gap-2">
                            Maintained & Developed by <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 font-bold">Damon</span>
                        </p>
                    </div>
                </div>

                <Link href="/admin" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2 border border-slate-700 relative z-10">
                    <FaArrowLeft /> Back to Dashboard
                </Link>
            </div>

            {/* Changelog Feed */}
            <div className="space-y-8">
                {changelogs.map((log) => (
                    <div key={log.id} className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-white/10 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-6 border-b border-white/5 pb-6">
                            <span className="px-3 py-1 bg-pink-500/10 text-pink-400 font-mono font-bold rounded-lg border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
                                {log.version}
                            </span>
                            <h2 className="text-2xl font-bold text-white">{log.title}</h2>
                            <span className="text-sm font-mono text-slate-500 md:ml-auto uppercase tracking-widest">{log.date}</span>
                        </div>

                        <div className="text-slate-300 prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-headings:text-white prose-a:text-pink-400 prose-code:text-indigo-300 prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-li:marker:text-slate-600">
                            <ReactMarkdown>{log.content}</ReactMarkdown>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
