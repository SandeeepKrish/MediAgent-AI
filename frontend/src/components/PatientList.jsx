import React from 'react'
import { User, ChevronRight, Calendar, Heart, Thermometer, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

function MagnifiedText({ children, className = "" }) {
    return (
        <motion.span
            whileHover={{
                scale: 1.2,
                color: "#38bdf8",
                zIndex: 50,
                position: "relative"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`inline-block cursor-zoom-in origin-left ${className}`}
        >
            {children}
        </motion.span>
    )
}

export default function PatientList({
    patients,
    onViewDetails,
    page = 1,
    totalPages = 1,
    onPageChange
}) {
    if (patients.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500">
                No patient records found in database.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                {patients.map((patient) => (
                    <div
                        key={patient._id}
                        className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-sky-500/30 hover:bg-white/[0.08] transition-all group cursor-pointer`}
                        onClick={() => onViewDetails(patient._id)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 font-bold group-hover:scale-110 transition-transform">
                                {patient.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-white group-hover:text-sky-400 transition-colors">
                                    <MagnifiedText>{patient.name}</MagnifiedText>
                                </h4>
                                <div className="flex items-center gap-3 text-2xl text-slate-400 mt-1">
                                    <MagnifiedText>{patient.age} years</MagnifiedText>
                                    <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                    <MagnifiedText className="capitalize">{patient.gender}</MagnifiedText>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 md:mt-0 flex items-center gap-6">
                            <div className="hidden sm:flex items-center gap-4 text-2xl font-medium text-slate-400">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5">
                                    <Activity size={12} className="text-sky-400" />
                                    <MagnifiedText>{patient.bp}</MagnifiedText>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5">
                                    <Thermometer size={12} className="text-rose-400" />
                                    <MagnifiedText>{patient.temperature}</MagnifiedText>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5">
                                    <Heart size={12} className="text-emerald-400" />
                                    <MagnifiedText>{patient.heart_rate}</MagnifiedText>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right hidden lg:block">
                                    <p className="text-xl uppercase text-slate-500 font-bold tracking-widest">Admitted</p>
                                    <p className="text-2xl text-slate-300 font-medium">{new Date(patient.created_at).toLocaleDateString()}</p>
                                </div>
                                <ChevronRight className="text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" size={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 p-4 glass-morphism rounded-2xl border border-white/5">
                    <button
                        onClick={(e) => { e.stopPropagation(); onPageChange(page - 1); }}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-3xl font-medium"
                    >
                        Previous
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-2xl text-slate-500 font-bold uppercase tracking-widest">Page</span>
                        <span className="px-3 py-1 rounded-lg bg-sky-500/10 text-sky-400 font-bold text-3xl border border-sky-500/20">
                            {page}
                        </span>
                        <span className="text-2xl text-slate-500 font-bold uppercase tracking-widest">of {totalPages}</span>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); onPageChange(page + 1); }}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-3xl font-medium"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

