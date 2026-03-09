import React, { useState } from 'react'
import { Send, Phone, User, Mail, MessageSquare, CheckCircle, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    })
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        // Construct mailto link
        const subject = encodeURIComponent(`New Contact Request from ${formData.name}`)
        const body = encodeURIComponent(
            `Name: ${formData.name}\n` +
            `Phone: ${formData.phone}\n` +
            `Email: ${formData.email || 'Not provided'}\n\n` +
            `Message: ${formData.message}`
        )

        // Updated email as requested
        const mailtoLink = `mailto:2022dir020@mietjammu.in?subject=${subject}&body=${body}`

        // Open user's email client
        window.location.href = mailtoLink
        setIsSubmitted(true)

        // Reset after success
        setTimeout(() => setIsSubmitted(false), 5000)
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-morphism rounded-3xl p-12 text-center"
            >
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-emerald-500" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Prepared!</h3>
                <p className="text-slate-400">Your email client should have opened. If not, please check your default mail app.</p>
                <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 text-sky-400 font-bold hover:underline"
                >
                    Send another message
                </button>
            </motion.div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-morphism rounded-3xl p-8 border border-white/5">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-sky-500/20 rounded-2xl flex items-center justify-center">
                        <MessageSquare className="text-sky-400" size={28} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Contact Support</h3>
                        <p className="text-slate-400">Fill the details to reach out to our team.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <User size={14} /> Full Name*
                            </label>
                            <input
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-all text-white placeholder:text-slate-600"
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Phone size={14} /> Phone Number*
                            </label>
                            <input
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-all text-white placeholder:text-slate-600"
                                placeholder="+91 0000000000"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Mail size={14} /> Email Address (Optional)
                        </label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-sky-500 transition-all text-white placeholder:text-slate-600"
                            placeholder="email@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <MessageSquare size={14} /> Your Message*
                        </label>
                        <textarea
                            name="message"
                            required
                            value={formData.message}
                            onChange={handleChange}
                            rows="4"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-sky-500 transition-all text-white placeholder:text-slate-600 resize-none"
                            placeholder="How can we help you?"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-sky-500/20 flex items-center justify-center gap-3 group"
                    >
                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        Send Message
                    </button>
                </form>
            </div>

            <div className="space-y-6">
                <div className="glass-morphism rounded-3xl p-6 border border-white/5 h-fit">
                    <h4 className="text-lg font-bold mb-6">Contact Information</h4>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
                                <Phone size={20} className="text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Mobile Number</p>
                                <a href="tel:9682548514" className="text-lg font-medium text-white hover:text-indigo-400 transition-colors">
                                    +91 96825 48514
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center shrink-0">
                                <Mail size={20} className="text-sky-400" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Support Email</p>
                                <a href="mailto:2022dir020@mietjammu.in" className="text-lg font-medium text-white hover:text-sky-400 transition-colors break-all">
                                    2022dir020@mietjammu.in
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                                <MapPin size={20} className="text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Location</p>
                                <p className="text-lg font-medium text-white">
                                    Jammu & Kashmir, India
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-morphism rounded-3xl p-6 border border-white/5 bg-gradient-to-br from-sky-500/5 to-transparent">
                    <h4 className="text-lg font-bold mb-3">24/7 Support</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Our medical support team is available around the clock to assist you with any technical or clinical platform queries.
                    </p>
                </div>
            </div>
        </div>
    )
}

