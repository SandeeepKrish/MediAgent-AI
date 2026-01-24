import React from 'react'
import { BrainCircuit, CheckCircle2, AlertCircle, Stethoscope, Pill, ShieldCheck, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AIResult({ result, isLoading, patient }) {
    if (isLoading) {
        return (
            <div className="glass-morphism rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[500px]">
                <div className="relative">
                    <Loader2 className="text-sky-400 animate-spin" size={64} />
                    <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-500" size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold gradient-text">Agentic AI is processing...</h3>
                    <p className="text-slate-400 max-w-md mx-auto mt-2">
                        The agent is searching the medical knowledge base and correlating symptoms with known conditions.
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" />
                </div>
            </div>
        )
    }

    if (!result) {
        return (
            <div className="glass-morphism rounded-3xl p-12 text-center text-slate-400 border border-dashed border-white/10">
                <BrainCircuit className="mx-auto mb-4 opacity-20" size={48} />
                <p>Enter patient details to see the AI agent analysis.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {patient && (
                <div className="glass-morphism p-6 rounded-2xl flex items-center justify-between border-l-4 border-l-sky-500">
                    <div>
                        <h4 className="text-3xl font-semibold text-slate-400 uppercase">Analysis for</h4>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-2xl font-bold">{patient.name}</span>
                            <span className="px-2 py-0.5 bg-white/5 rounded-md text-3xl border border-white/10">{patient.age}y</span>
                            <span className="px-2 py-0.5 bg-white/5 rounded-md text-3xl border border-white/10">{patient.gender}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl text-slate-400">Timestamp</p>
                        <p className="text-3xl font-medium">{new Date().toLocaleString()}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Diagnosis */}
                <div className="lg:col-span-2 space-y-8">
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-morphism p-8 rounded-3xl border border-sky-500/20 bg-sky-500/5"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-sky-500/20 rounded-2xl flex items-center justify-center">
                                <BrainCircuit className="text-sky-400" size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Likely Condition</h3>
                                <p className="text-slate-400 text-3xl">AI Agent Primary Inference</p>
                            </div>
                        </div>

                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                            <h2 className="text-3xl font-extrabold text-white mb-3">{result.possible_condition}</h2>
                            <p className="text-slate-300 leading-relaxed text-lg italic">
                                "{result.ai_analysis_summary}"
                            </p>
                        </div>
                    </motion.section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-morphism p-6 rounded-3xl"
                        >
                            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Stethoscope className="text-indigo-400" size={20} />
                                Suggested Tests
                            </h4>
                            <ul className="space-y-3">
                                {result.suggested_tests.map((test, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300 group">
                                        <CheckCircle2 size={16} className="text-indigo-400 shrink-0" />
                                        <span className="group-hover:text-white transition-colors">{test}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-morphism p-6 rounded-3xl"
                        >
                            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <ShieldCheck className="text-emerald-400" size={20} />
                                Precautions
                            </h4>
                            <ul className="space-y-3">
                                {result.precautionary_measures.map((p, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300 group">
                                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                        <span className="group-hover:text-white transition-colors">{p}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.section>
                    </div>
                </div>

                {/* Prescription Sidebar */}
                <motion.section
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-morphism p-6 rounded-3xl border border-rose-500/20 bg-rose-500/5 h-fit"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center">
                            <Pill className="text-rose-400" size={22} />
                        </div>
                        <h4 className="text-lg font-bold">Recommended Dosage</h4>
                    </div>
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-200 font-medium">
                        {result.dosage_recommendation}
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-amber-400 shrink-0 mt-0.5" size={18} />
                            <p className="text-2xl text-slate-400 italic">
                                Disclaimer: The AI generated suggestions are based on historical data. Final decision must be made by a licensed medical professional.
                            </p>
                        </div>
                        <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                            Print Report
                        </button>
                    </div>
                </motion.section>
            </div>
        </div>
    )
}
