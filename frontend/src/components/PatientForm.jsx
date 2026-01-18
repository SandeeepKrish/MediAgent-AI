import React, { useState } from 'react'
import { Send, User, Calendar, Thermometer, Heart, Activity, ClipboardList } from 'lucide-react'

export default function PatientForm({ onSubmit, isAnalyzing }) {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Male',
        symptoms: '',
        history: '',
        bp: '120/80',
        temperature: '98.6°F',
        heart_rate: '72 bpm'
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        const processedData = {
            ...formData,
            age: parseInt(formData.age),
            symptoms: formData.symptoms.split(',').map(s => s.trim()),
            history: formData.history.split(',').map(s => s.trim())
        }
        onSubmit(processedData)
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="glass-morphism rounded-3xl p-8 border border-white/5">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
                    <ClipboardList className="text-indigo-400" size={28} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold">Patient Admission</h3>
                    <p className="text-slate-400">Fill in the clinical details to trigger AI analysis.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Full Name" icon={<User size={18} />}>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-all"
                            placeholder="e.g. Rahul Kumar"
                            required
                        />
                    </InputGroup>

                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Age" icon={<Calendar size={18} />}>
                            <input
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-all"
                                placeholder="28"
                                required
                            />
                        </InputGroup>
                        <InputGroup label="Gender">
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-all appearance-none"
                            >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </InputGroup>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputGroup label="Blood Pressure" icon={<Activity size={18} />}>
                        <input
                            name="bp"
                            value={formData.bp}
                            onChange={handleChange}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-all"
                            placeholder="120/80"
                        />
                    </InputGroup>
                    <InputGroup label="Temp" icon={<Thermometer size={18} />}>
                        <input
                            name="temperature"
                            value={formData.temperature}
                            onChange={handleChange}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-all"
                            placeholder="98.6°F"
                        />
                    </InputGroup>
                    <InputGroup label="Heart Rate" icon={<Heart size={18} />}>
                        <input
                            name="heart_rate"
                            value={formData.heart_rate}
                            onChange={handleChange}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-all"
                            placeholder="72 bpm"
                        />
                    </InputGroup>
                </div>

                <InputGroup label="Symptoms (comma separated)">
                    <textarea
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleChange}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-4 min-h-[100px] outline-none focus:border-sky-500 transition-all resize-none"
                        placeholder="fever, cough, runny nose..."
                        required
                    />
                </InputGroup>

                <InputGroup label="Medical History (optional)">
                    <textarea
                        name="history"
                        value={formData.history}
                        onChange={handleChange}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-4 min-h-[100px] outline-none focus:border-sky-500 transition-all resize-none"
                        placeholder="allergy, diabetes, asthma..."
                    />
                </InputGroup>

                <button
                    disabled={isAnalyzing}
                    type="submit"
                    className="w-full py-5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-sky-500/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {isAnalyzing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Agent Thinking...
                        </>
                    ) : (
                        <>
                            <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            Analyze with Agentic AI
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}

function InputGroup({ label, icon, children }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                {icon}
                {label}
            </label>
            {children}
        </div>
    )
}
