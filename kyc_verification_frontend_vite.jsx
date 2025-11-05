// Project: kyc-verification-frontend (Vite)
// This single file lists the full scaffold for a Vite + React + Tailwind frontend
// Keep the exact UI from the code you provided; backend/storage replaced with localStorage mock

--- FILE STRUCTURE ---

kyc-verification-frontend/
├─ package.json
├─ vite.config.js
├─ index.html
├─ tailwind.config.js
├─ postcss.config.cjs
├─ README.md
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   └─ index.css

--- package.json ---
```json
{
  "name": "kyc-verification-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.260.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.5.4",
    "vite": "^5.0.0"
  }
}
```

--- vite.config.js ---
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

--- index.html ---
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>KYC Verification Frontend</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

--- tailwind.config.js ---
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

--- postcss.config.cjs ---
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

--- README.md ---
```md
# KYC Verification Frontend

Frontend-only Vite + React project that reproduces the UI you provided. All backend/storage references have been replaced with a browser `localStorage` mock so the app runs out-of-the-box.

## Setup
1. Install Node (LTS) and npm.
2. Clone or download this folder.

```bash
npm install
npm run dev
```

Open http://localhost:5173 (Vite default) in your browser.

## Notes for backend teammates
- The project stores verification records in browser `localStorage` using keys prefixed with `verification:`.
- To integrate a real backend, replace the `saveToStorage` and `loadFromStorage` helper functions in `src/App.jsx` with API calls (fetch/axios) to your backend endpoints.
- The app expects verification objects with this shape:
  ```json
  {
    "id": "VER...",
    "timestamp": "ISO string",
    "name": "...",
    "aadharNumber": "...",
    "address": "...",
    "documentType": "AADHAR|PAN|UTILITY",
    "fraudProbability": 12.34,
    "riskLevel": "Low|Medium|High",
    "status": "Verified|Flagged",
    "details": { "documentAuthenticity": "Valid|Suspicious", "addressVerification": "Verified|Mismatch", "anomalyScore": "0.00" }
  }
  ```

## Files of interest
- `src/App.jsx` — main UI logic & mock storage helpers
- `src/index.css` — Tailwind imports

## Deploy
Build with `npm run build` and deploy the `dist/` folder.
```
```

--- src/main.jsx ---
```jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

--- src/index.css ---
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* small safe body background to match the original design */
body { @apply bg-gray-100; }
```

--- src/App.jsx ---
```jsx
import React, { useState, useEffect } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, XCircle, Clock, Filter, Search, Home, Info } from 'lucide-react';

// Helper: localStorage wrapper so team can replace with backend calls later
const STORAGE_PREFIX = 'verification:';

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('localStorage set error', err);
  }
};

const loadFromStorage = () => {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX));
    const history = keys.map(k => {
      try { return JSON.parse(localStorage.getItem(k)); } catch { return null; }
    }).filter(Boolean);
    return history.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (err) {
    console.error('localStorage read error', err);
    return [];
  }
};

const KYCVerificationApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [verificationHistory, setVerificationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    aadharNumber: '',
    address: '',
    documentType: 'AADHAR'
  });

  useEffect(() => {
    setVerificationHistory(loadFromStorage());
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`File ${file.name} ready for upload. Connect to backend API for processing.`);
    }
  };

  const handleVerification = async () => {
    setIsLoading(true);

    setTimeout(() => {
      const mockResult = {
        id: `VER${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...formData,
        fraudProbability: Math.random() * 100,
        riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        status: Math.random() > 0.3 ? 'Verified' : 'Flagged',
        details: {
          documentAuthenticity: Math.random() > 0.2 ? 'Valid' : 'Suspicious',
          addressVerification: Math.random() > 0.2 ? 'Verified' : 'Mismatch',
          anomalyScore: (Math.random() * 10).toFixed(2)
        }
      };

      saveToStorage(`${STORAGE_PREFIX}${mockResult.id}`, mockResult);
      setVerificationHistory(loadFromStorage());
      setIsLoading(false);
      setCurrentPage('result');
    }, 1200);
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Low': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'High': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    return status === 'Verified' ? 
      <CheckCircle className="w-5 h-5 text-green-600" /> : 
      <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  const filteredHistory = verificationHistory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.aadharNumber.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || item.riskLevel === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const latestResult = verificationHistory[0];

  // Dashboard Page
  const DashboardPage = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Verifications</p>
              <p className="text-3xl font-bold text-gray-800">{verificationHistory.length}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Verified</p>
              <p className="text-3xl font-bold text-gray-800">{verificationHistory.filter(v => v.status === 'Verified').length}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Flagged</p>
              <p className="text-3xl font-bold text-gray-800">{verificationHistory.filter(v => v.status === 'Flagged').length}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">System Overview</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-gray-700">AI Models Active</span>
            <span className="text-green-600 font-semibold">✓ Online</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-gray-700">Compliance Status</span>
            <span className="text-green-600 font-semibold">✓ Compliant</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-gray-700">Average Processing Time</span>
            <span className="text-blue-600 font-semibold">1.8s</span>
          </div>
        </div>
      </div>

      {verificationHistory.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Verifications</h2>
          <div className="space-y-3">
            {verificationHistory.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.aadharNumber}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(item.riskLevel)}`}>
                  {item.riskLevel} Risk
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Upload/Verify Page
  const UploadPage = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Identity Verification</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload CSV File (Batch Processing)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csvUpload"
            />
            <label htmlFor="csvUpload" className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-700 font-medium">Upload a CSV file</span>
              <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
            </label>
          </div>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">OR</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">AADHAR Number</label>
            <input
              type="text"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="XXXX-XXXX-XXXX"
              maxLength="12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter complete address"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="AADHAR">AADHAR Card</option>
              <option value="PAN">PAN Card</option>
              <option value="UTILITY">Utility Bill</option>
            </select>
          </div>

          <button
            onClick={handleVerification}
            disabled={isLoading || !formData.name || !formData.aadharNumber}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'Verifying...' : 'Verify Identity'}
          </button>
        </div>
      </div>
    </div>
  );

  // Result Page
  const ResultPage = () => {
    if (!latestResult) return <div className="text-center text-gray-500">No verification results available</div>;

    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Verification Result</h2>
            {getStatusIcon(latestResult.status)}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Verification ID</p>
              <p className="text-lg font-semibold text-gray-800">{latestResult.id}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Timestamp</p>
              <p className="text-lg font-semibold text-gray-800">{new Date(latestResult.timestamp).toLocaleString()}</p>
            </div>
          </div>

          <div className="mb-6 p-6 border-2 rounded-lg" style={{
            borderColor: latestResult.riskLevel === 'Low' ? '#10b981' : 
                        latestResult.riskLevel === 'Medium' ? '#f59e0b' : '#ef4444'
          }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-800">Fraud Probability</span>
              <span className={`text-3xl font-bold ${latestResult.fraudProbability < 30 ? 'text-green-600' : latestResult.fraudProbability < 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                {latestResult.fraudProbability.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-800">Risk Level</span>
              <span className={`px-4 py-2 rounded-full text-lg font-bold ${getRiskColor(latestResult.riskLevel)}`}>
                {latestResult.riskLevel}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Verification Details</h3>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Name</span>
                <span className="font-semibold text-gray-800">{latestResult.name}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">AADHAR Number</span>
                <span className="font-semibold text-gray-800">{latestResult.aadharNumber}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Document Authenticity</span>
                <span className={`font-semibold ${latestResult.details.documentAuthenticity === 'Valid' ? 'text-green-600' : 'text-red-600'}`}>
                  {latestResult.details.documentAuthenticity}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Address Verification</span>
                <span className={`font-semibold ${latestResult.details.addressVerification === 'Verified' ? 'text-green-600' : 'text-red-600'}`}>
                  {latestResult.details.addressVerification}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Anomaly Score</span>
                <span className="font-semibold text-gray-800">{latestResult.details.anomalyScore}</span>
              </div>
            </div>
          </div>

          <button onClick={() => setCurrentPage('upload')} className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">New Verification</button>
        </div>
      </div>
    );
  };

  // History Page
  const HistoryPage = () => (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or AADHAR number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">AADHAR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No verification records found</td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">{item.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.aadharNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(item.timestamp).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(item.riskLevel)}`}>{item.riskLevel}</span></td>
                    <td className="px-6 py-4"><div className="flex items-center gap-2">{getStatusIcon(item.status)}<span className="text-sm font-medium text-gray-800">{item.status}</span></div></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // About Page
  const AboutPage = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">AI-Powered Identity Verification System</h2>
        
        <div className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Project Overview</h3>
            <p className="text-gray-700 leading-relaxed">This advanced AI-driven identity verification system is tailored for BFSI (Banking, Financial Services, and Insurance) KYC and AML (Anti-Money Laundering) compliance. Leveraging cutting-edge technologies such as Graph Neural Networks (GNNs), Natural Language Processing (NLP), and Computer Vision, the solution validates customer identities and verifies the legitimacy of documents like AADHAR cards.</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg"><h4 className="font-semibold text-blue-900 mb-2">Enhanced Identity Verification</h4><p className="text-sm text-gray-700">AI and deep learning automate and improve identity checks for KYC/AML compliance.</p></div>
              <div className="p-4 bg-green-50 rounded-lg"><h4 className="font-semibold text-green-900 mb-2">Fraudulent Address Detection</h4><p className="text-sm text-gray-700">Robust mechanisms verify the authenticity of AADHAR addresses.</p></div>
              <div className="p-4 bg-purple-50 rounded-lg"><h4 className="font-semibold text-purple-900 mb-2">Improved Compliance</h4><p className="text-sm text-gray-700">Automatic checks aligned with regulatory frameworks prevent fraud.</p></div>
              <div className="p-4 bg-yellow-50 rounded-lg"><h4 className="font-semibold text-yellow-900 mb-2">Cost Reduction</h4><p className="text-sm text-gray-700">Minimization of manual effort through intelligent automation.</p></div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Technology Stack</h3>
            <div className="flex flex-wrap gap-2">{['Azure OpenAI', 'Graph Neural Networks', 'NLP', 'Computer Vision', 'React', 'Python'].map(tech => (<span key={tech} className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">{tech}</span>))}</div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Implementation Modules</h3>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4 py-2"><h4 className="font-semibold text-gray-800">Module 1: Data Collection & Preprocessing</h4><p className="text-sm text-gray-600">Collect and prepare identity documents for model development.</p></div>
              <div className="border-l-4 border-green-500 pl-4 py-2"><h4 className="font-semibold text-gray-800">Module 2: Model Development</h4><p className="text-sm text-gray-600">Build AI models to verify identities and detect fraudulent addresses.</p></div>
              <div className="border-l-4 border-purple-500 pl-4 py-2"><h4 className="font-semibold text-gray-800">Module 3: AML & KYC Integration</h4><p className="text-sm text-gray-600">Enable real-time validation workflows integrated with compliance systems.</p></div>
              <div className="border-l-4 border-yellow-500 pl-4 py-2"><h4 className="font-semibold text-gray-800">Module 4: Deployment & Verification</h4><p className="text-sm text-gray-600">Deploy end-to-end system and validate performance with real data.</p></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-white" /></div>
              <div><h1 className="text-2xl font-bold text-gray-800">KYC Verification System</h1><p className="text-sm text-gray-500">AI-Powered Identity & Fraud Detection</p></div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[{ id: 'dashboard', label: 'Dashboard', icon: Home },{ id: 'upload', label: 'Verify Identity', icon: Upload },{ id: 'result', label: 'Results', icon: FileText },{ id: 'history', label: 'History', icon: Clock },{ id: 'about', label: 'About', icon: Info }].map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setCurrentPage(id)} className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition ${currentPage === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'upload' && <UploadPage />}
        {currentPage === 'result' && <ResultPage />}
        {currentPage === 'history' && <HistoryPage />}
        {currentPage === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"><p className="text-center text-gray-500 text-sm">© 2025 KYC Verification System | BFSI Compliance & AML Detection</p></div>
      </footer>
    </div>
  );
};

export default KYCVerificationApp;
```

--- END OF SCAFFOLD ---

// Instructions: Open the canvas text document to view/copy each file. To run locally:
// 1. Save these files into the structure above.
// 2. Run `npm install` then `npm run dev`.
// 3. Open the printed README for integration notes for backend teammates.
