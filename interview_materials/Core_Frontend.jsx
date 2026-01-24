import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * FEATURE: MediAgent AI Dashboard Logic
 * This is a condensed version of the frontend for interview demonstrations.
 */

const CoreFrontend = () => {
    // 1. State Management
    // Why State? To store and update UI data dynamically without reloading the page.
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        symptoms: ''
    });

    const API_URL = "http://localhost:8000/api/patients";

    // 2. Lifecycle Method (useEffect)
    // Why useEffect? To sync our component with external systems (the Backend API) on load.
    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await axios.get(API_URL);
            setPatients(res.data);
        } catch (err) {
            console.error("API Error:", err);
        }
    };

    // 3. Form Handling & POST Request
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = {
                ...formData,
                symptoms: formData.symptoms.split(',') // Converting string to list
            };
            // Sending data to FastAPI
            await axios.post(API_URL, payload);
            alert("Patient Registered & AI Analysis Complete!");
            fetchPatients(); // Refreshing the list
        } catch (err) {
            alert("Registration failed. Check Backend.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh' }}>
            <h1>MediAgent AI - Physician Portal</h1>

            {/* 4. Registration Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '40px', padding: '20px', border: '1px solid #1e293b', borderRadius: '12px' }}>
                <h3>Add New Patient</h3>
                <input placeholder="Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                <input type="number" placeholder="Age" onChange={(e) => setFormData({ ...formData, age: e.target.value })} required />
                <textarea placeholder="Symptoms (comma separated)" onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })} required />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "AI Analyzing..." : "Register Patient"}
                </button>
            </form>

            {/* 5. Display List */}
            <div>
                <h3>Recent Diagnoses</h3>
                <ul>
                    {patients.map((p, idx) => (
                        <li key={idx} style={{ marginBottom: '10px', listStyle: 'none', background: '#1e293b', padding: '15px', borderRadius: '8px' }}>
                            <strong>{p.name}</strong> ({p.age}y) -
                            <span style={{ color: p.ai_analysis?.risk_level === 'High' ? '#ef4444' : '#10b981' }}>
                                Risk: {p.ai_analysis?.risk_level}
                            </span>
                            <p style={{ fontSize: '12px', color: '#94a3b8' }}>AI Thought: {p.ai_analysis?.agent_thought}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CoreFrontend;
