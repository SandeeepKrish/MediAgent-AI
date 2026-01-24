import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PatientForm from './components/PatientForm'
import AIResult from './components/AIResult'
import PatientList from './components/PatientList'
import ContactForm from './components/ContactForm'
import { Activity, LayoutDashboard, Database, BrainCircuit, UserPlus, History, MessageSquare, Search } from 'lucide-react'
import { motion, AnimatePresence, useSpring, useTransform, animate } from 'framer-motion'
import { useDebounce, useThrottle } from './hooks/useUtils'

const API_BASE_URL = 'http://localhost:8000/api'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [recentPatients, setRecentPatients] = useState([])
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [stats, setStats] = useState({ total: 0, male: 0, female: 0, critical: 0 })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGender, setSelectedGender] = useState('')

  useEffect(() => {
    // Fire both immediately for fast loading
    fetchStats()
    fetchPatients(currentPage)
  }, [currentPage])

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/patients/stats`)
      setStats(res.data)
    } catch (err) {
      console.error("Failed to fetch stats", err)
    }
  }


  const fetchPatients = async (page = 1, search = '', gender = '') => {
    try {
      const res = await axios.get(`${API_BASE_URL}/patients/?page=${page}&limit=10&search=${search}&gender=${gender}`)
      setRecentPatients(res.data.patients)
      setTotalPages(res.data.total_pages)
      // Only update total stats from backend, keep gender filter local for the list
      if (!gender && !search) {
        setStats(prev => ({ ...prev, total: res.data.total }))
      }
    } catch (err) {
      console.error("Failed to fetch patients", err)
    }
  }

  // Use Debounce for searching: updates the list as the user types
  const debouncedSearch = useDebounce((query) => {
    setCurrentPage(1) // Reset to first page on search
    fetchPatients(1, query, selectedGender)
  }, 500)

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    debouncedSearch(e.target.value)
  }

  const handleGenderFilter = (gender) => {
    const newGender = selectedGender === gender ? '' : gender
    setSelectedGender(newGender)
    setCurrentPage(1)
    fetchPatients(1, searchQuery, newGender)
  }

  // Use Throttle for page changes to prevent rapid clicking
  const throttledPageChange = useThrottle((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      fetchPatients(newPage, searchQuery, selectedGender)
    }
  }, 800)

  const handlePatientSubmit = async (patientData) => {
    setIsAnalyzing(true)
    setAnalysisResult(null)
    setSelectedPatient(patientData) // Set local data immediately for UI context
    setActiveTab('analysis')

    try {
      const res = await axios.post(`${API_BASE_URL}/patients/`, patientData)
      setAnalysisResult(res.data.ai_recommendation)
      // fetchPatients will update the 'records' and 'dashboard' with data from MongoDB
      fetchPatients()
    } catch (err) {
      console.error("Analysis failed", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const viewPatientDetails = async (id) => {
    setIsAnalyzing(true)
    setActiveTab('analysis')
    try {
      const res = await axios.get(`${API_BASE_URL}/patients/${id}`)
      setSelectedPatient(res.data.patient)
      setAnalysisResult(res.data.recommendation)
    } catch (err) {
      console.error("Failed to fetch patient details", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-sky-500/30">
      <div className="hero-pulse top-0 left-0" />
      <div className="hero-pulse bottom-0 right-0 bg-indigo-500/10" />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 glass-morphism border-r border-white/5 z-50 hidden lg:flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center">
            <img src="/favicon.svg" alt="MediAgent AI Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl font-bold gradient-text">MediAgent AI</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <SidebarItem
            icon={<UserPlus size={20} />}
            label="New Patient"
            active={activeTab === 'new-patient'}
            onClick={() => setActiveTab('new-patient')}
          />
          <SidebarItem
            icon={<BrainCircuit size={20} />}
            label="AI Analysis"
            active={activeTab === 'analysis'}
            onClick={() => setActiveTab('analysis')}
          />
          <SidebarItem
            icon={<History size={20} />}
            label="Records"
            active={activeTab === 'records'}
            onClick={() => setActiveTab('records')}
          />
          <SidebarItem
            icon={<MessageSquare size={20} />}
            label="Contact Us"
            active={activeTab === 'contact'}
            onClick={() => setActiveTab('contact')}
          />
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-2xl">
            <p className="text-xs text-sky-400 font-medium mb-1">Database Connected</p>
            <p className="text-[10px] text-slate-400">MongoDB Atlas: {stats.total} Records</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-8 min-h-screen">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">
              {activeTab === 'dashboard' && 'Physician Dashboard'}
              {activeTab === 'new-patient' && 'Register New Patient'}
              {activeTab === 'analysis' && 'Agentic AI Analysis'}
              {activeTab === 'records' && 'Patient History Records'}
              {activeTab === 'contact' && 'Contact Support'}
            </h2>
            <p className="text-slate-400 mt-1">
              Active Session: Dr. Sandeep | System Online
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search records..."
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:border-sky-500/50 transition-all w-64"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="px-4 py-2 glass-morphism rounded-full border border-white/5 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Agent Active</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <StatCard
                    title="Total"
                    value={stats.total}
                    icon={<Database className="text-sky-400" />}
                    isActive={selectedGender === ''}
                    onClick={() => handleGenderFilter('')}
                  />
                  <StatCard
                    title="Male"
                    value={stats.male}
                    icon={<UserPlus className="text-indigo-400" />}
                    isActive={selectedGender === 'Male'}
                    onClick={() => handleGenderFilter('Male')}
                  />
                  <StatCard
                    title="Female"
                    value={stats.female}
                    icon={<History className="text-rose-400" />}
                    isActive={selectedGender === 'Female'}
                    onClick={() => handleGenderFilter('Female')}
                  />
                  <StatCard title="Critical (BP)" value={stats.critical} icon={<Activity className="text-amber-400" />} color="amber" />
                </div>

                <section className="glass-morphism rounded-3xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      {selectedGender ? `${selectedGender} Patients` : 'Recent Admissions'}
                      {selectedGender && <span className="text-xs px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded-full">Filtered</span>}
                    </h3>
                    <button onClick={() => setActiveTab('records')} className="text-sky-400 text-sm hover:underline">View All Records</button>
                  </div>
                  <PatientList
                    patients={recentPatients.slice(0, 10)}
                    onViewDetails={viewPatientDetails}
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={throttledPageChange}
                  />
                </section>
              </div>

              <div className="space-y-8">
                <div className="glass-morphism rounded-3xl p-6 bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <BrainCircuit size={20} className="text-indigo-400" />
                    Agentic Analysis
                  </h3>
                  <p className="text-sm text-slate-400 mb-6">AI analysis is automatically triggered for every patient admission to assist diagnosis.</p>
                  <button
                    onClick={() => setActiveTab('new-patient')}
                    className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                  >
                    <UserPlus size={20} />
                    New Admission
                  </button>
                </div>

                <div className="glass-morphism rounded-3xl p-6">
                  <h3 className="text-lg font-bold mb-4">Patient Demographics</h3>
                  <div className="space-y-4">
                    <ProgressBar
                      label="Male"
                      percentage={(stats.male / stats.total * 100) || 0}
                      color="bg-indigo-500"
                      onClick={() => handleGenderFilter('Male')}
                      isFiltered={selectedGender === 'Male'}
                    />
                    <ProgressBar
                      label="Female"
                      percentage={(stats.female / stats.total * 100) || 0}
                      color="bg-rose-500"
                      onClick={() => handleGenderFilter('Female')}
                      isFiltered={selectedGender === 'Female'}
                    />
                    <ProgressBar label="Critical BP" percentage={(stats.critical / stats.total * 100) || 0} color="bg-amber-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'new-patient' && (
            <motion.div
              key="new-patient"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto"
            >
              <PatientForm onSubmit={handlePatientSubmit} isAnalyzing={isAnalyzing} />
            </motion.div>
          )}

          {activeTab === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AIResult result={analysisResult} isLoading={isAnalyzing} patient={selectedPatient} />
            </motion.div>
          )}

          {activeTab === 'records' && (
            <motion.div
              key="records"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-morphism rounded-3xl p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-white">Clinical Records History</h3>
                <div className="text-slate-400 text-sm">Showing page {currentPage} of {totalPages}</div>
              </div>
              <PatientList
                patients={recentPatients}
                onViewDetails={viewPatientDetails}
                page={currentPage}
                totalPages={totalPages}
                onPageChange={throttledPageChange}
              />
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <ContactForm />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-white/5 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-sky-500 rounded flex items-center justify-center">
                <Activity size={12} className="text-white" />
              </div>
              <span className="text-sm font-bold gradient-text">MediAgent AI v1.0</span>
            </div>

            <div className="text-center md:text-left">
              <p className="text-xs text-slate-500 mb-1 uppercase tracking-widest font-bold">Contact & Support</p>
              <a href="mailto:2022d1r020@mietjammu.in" className="text-sm text-sky-400 hover:text-sky-300 transition-colors font-medium">
                2022d1r020@mietjammu.in
              </a>
            </div>

            <div className="text-center md:text-right">
              <p className="text-[10px] text-slate-500 font-medium">
                &copy; {new Date().getFullYear()} MediAgent Health Systems. All rights reserved.
              </p>
              <p className="text-[10px] text-slate-600 mt-1 italic">
                Designed for clinical excellence and AI-driven healthcare.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

function ProgressBar({ label, percentage, color, onClick, isFiltered }) {
  return (
    <div
      className={`space-y-1.5 cursor-pointer transition-all p-2 rounded-xl ${isFiltered ? 'bg-white/5 ring-1 ring-white/10' : 'hover:bg-white/[0.02]'}`}
      onClick={onClick}
    >
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-slate-400 uppercase">{label}</span>
        <span className="text-white">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  )
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${active
        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
        : 'text-slate-400 hover:bg-white/5'
        }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  )
}

function StatCard({ title, value, icon, color = "sky", onClick, isActive }) {
  const colorMap = {
    sky: "border-sky-500/20 bg-sky-500/5",
    amber: "border-amber-500/20 bg-amber-500/5",
    rose: "border-rose-500/20 bg-rose-500/5",
    indigo: "border-indigo-500/20 bg-indigo-500/5"
  }

  return (
    <div
      onClick={onClick}
      className={`glass-morphism p-5 rounded-2xl flex flex-col gap-4 border cursor-pointer transition-all ${isActive ? 'ring-2 ring-sky-500/50 border-sky-500/50 scale-[1.02]' : 'hover:scale-105'} ${colorMap[color] || colorMap.sky}`}
    >
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{title}</p>
        <div className="text-2xl font-bold text-white mt-0.5">
          <CountUp value={value} />
        </div>
      </div>
    </div>
  )
}


function CountUp({ value }) {
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.floor(latest))
    });
    return () => controls.stop();
  }, [value]);

  return <span>{displayValue}</span>;
}


export default App
