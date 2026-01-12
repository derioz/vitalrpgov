"use client";

import Link from 'next/link';
import { FaBalanceScale, FaShieldAlt, FaAmbulance, FaFireExtinguisher, FaBug } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Minimalist Faction Card
 * Uses peer-hover logic and glassmorphism.
 */
const MinimalCard = ({ href, color, icon: Icon, title, subtitle, number }: any) => {
  // Dynamic styles for hover states
  const themeStyles: any = {
    blue: "hover:border-blue-500/50 hover:shadow-[0_0_100px_rgba(59,130,246,0.2)] hover:bg-blue-950/30",
    red: "hover:border-red-500/50 hover:shadow-[0_0_100px_rgba(239,68,68,0.2)] hover:bg-red-950/30",
    amber: "hover:border-amber-500/50 hover:shadow-[0_0_100px_rgba(245,158,11,0.2)] hover:bg-amber-950/30",
    orange: "hover:border-orange-500/50 hover:shadow-[0_0_100px_rgba(249,115,22,0.2)] hover:bg-orange-950/30",
  };

  const iconColors: any = {
    blue: "text-blue-500",
    red: "text-red-500",
    amber: "text-amber-500",
    orange: "text-orange-500",
  };

  return (
    <Link
      href={href}
      className={`
                group relative flex-1 flex flex-col justify-between p-8 md:p-10 border-r border-white/5 last:border-r-0
                transition-all duration-700 ease-out
                ${themeStyles[color]}
                hover:flex-[1.5] bg-black/50 backdrop-blur-sm
            `}
    >
      {/* Hover Gradient Spot */}
      <div className={`
                absolute top-0 right-0 w-[300px] h-[300px] bg-${color}-500/20 blur-[120px] rounded-full 
                opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -translate-y-1/2 translate-x-1/2
            `} />

      {/* Top Section: Number & Icon */}
      <div className="relative z-10 flex justify-between items-start">
        <span className="font-mono text-sm text-slate-600 tracking-widest group-hover:text-white transition-colors duration-500">
          {number}
        </span>
        <Icon className={`text-2xl ${iconColors[color]} opacity-50 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500`} />
      </div>

      {/* Center: Hero Text */}
      <div className="relative z-10 my-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-200 to-slate-600 group-hover:from-white group-hover:to-slate-300 transition-all duration-500 tracking-tighter mb-4">
          {title}
        </h2>
        <div className="h-[1px] w-12 bg-slate-700 group-hover:w-full group-hover:bg-white/20 transition-all duration-700" />
      </div>

      {/* Bottom: Description & Action */}
      <div className="relative z-10">
        <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-8 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
          {subtitle}
        </p>

        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
          <span className="w-8 h-[1px] bg-slate-300 dark:bg-slate-700 group-hover:bg-slate-900 dark:group-hover:bg-white transition-colors" />
          Enter Portal
        </div>
      </div>
    </Link>
  );
};

export default function Home() {
  const { user } = useAuth();

  const grantSuperAdmin = async () => {
    if (!user) return alert("Login first!");
    if (!confirm("DEV: Promote yourself to Superadmin?")) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        roles: arrayUnion("superadmin", "admin", "lspd") // Granting full suite for testing
      });
      alert("Granted! Refresh page.");
    } catch (e) {
      console.error(e);
      alert("Failed. Check console.");
    }
  };

  return (
    // Fits exactly under the 95px header.
    <div className="h-[calc(100vh-95px)] bg-slate-50 dark:bg-black flex flex-col relative overflow-hidden">

      {/* Cinematic Background Grain/Overlay (Static) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] invert dark:invert-0"></div>

      {/* Page Header */}
      <div className="relative z-20 pt-10 pb-6 text-center border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-slate-900 dark:text-white tracking-widest uppercase">
          San Andreas <span className="text-slate-400 dark:text-slate-500">Legal Portal</span>
        </h1>
        <p className="text-slate-500 text-sm font-mono mt-2 tracking-widest uppercase text-opacity-70">
          Official Unified Government Access Point
        </p>

        {/* DEV ONLY BUTTON */}
        <button
          onClick={grantSuperAdmin}
          className="absolute top-4 right-4 text-[10px] bg-red-900/20 text-red-500 px-2 py-1 rounded hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1"
        >
          <FaBug /> DEV: Claim Superadmin
        </button>
      </div>

      {/* Faction Panels container */}
      <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-white/5 relative z-10">
        <MinimalCard
          number="01"
          href="/doj"
          title="JUSTICE"
          subtitle="The judiciary body, bar association, and legislative records."
          icon={FaBalanceScale}
          color="amber"
        />

        <MinimalCard
          number="02"
          href="/lspd"
          title="POLICE"
          subtitle="Law enforcement, tactical operations, and public safety."
          icon={FaShieldAlt}
          color="blue"
        />

        <MinimalCard
          number="03"
          href="/lsems"
          title="MEDICAL"
          subtitle="Emergency response, hospitalization, and critical care."
          icon={FaAmbulance}
          color="red"
        />

        <MinimalCard
          number="04"
          href="/safd"
          title="FIRE"
          subtitle="Fire suppression, rescue operations, and safety inspections."
          icon={FaFireExtinguisher}
          color="orange"
        />
      </div>

    </div>
  );
}
