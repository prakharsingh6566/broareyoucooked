import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, AlertCircle, ScanLine, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Analysis() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(0);

  const loadingMessages = [
    'READING YOUR RESUME 👀',
    'FINDING THE PROBLEMS 🔍',
    'CHECKING HOW COOKED YOU ARE 🔥',
    'CALCULATING THE DAMAGE 💀',
    'PREPARING THE BAD NEWS 😬'
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(selectedFile.type)) {
      setError('Bro... PDF or DOC only. Come on.');
      return;
    }
    
    setFile(selectedFile);
    setError('');
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Upload something first fr 😭');
      return;
    }
    
    if (!jobDescription.trim()) {
      setError('Need the job description too... obviously');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    setLoadingMessage(0);

    // Rotate loading messages
    const messageInterval = setInterval(() => {
      setLoadingMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('job_description', jobDescription);

      const response = await axios.post(`${BACKEND_URL}/api/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      clearInterval(messageInterval);
      
      // Navigate to results with the analysis data
      navigate('/results', { state: { analysis: response.data } });
      
    } catch (err) {
      clearInterval(messageInterval);
      console.error('Analysis error:', err);
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F7] relative overflow-hidden">
      {/* Noise texture */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
           }}
      />

      {/* Grid overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
           style={{
             backgroundImage: 'linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 md:px-12 lg:px-24 py-8 border-b border-[#262626]">
          <button
            data-testid="back-button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 font-mono text-sm text-[#86868B] hover:text-[#F5F5F7] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK
          </button>
        </header>

        {isAnalyzing ? (
          <AnalyzingScreen message={loadingMessages[loadingMessage]} />
        ) : (
          <div className="px-6 md:px-12 lg:px-24 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              {/* Title */}
              <div className="mb-12">
                <h1 className="font-['Azeret_Mono'] text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">
                  UPLOAD RESUME
                </h1>
                <p className="font-['Manrope'] text-lg text-[#86868B]">
                  Upload your resume and paste the job description to begin analysis
                </p>
              </div>

              {/* Upload Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-8"
              >
                <label className="font-mono text-xs uppercase tracking-widest text-[#86868B] mb-3 block">
                  RESUME FILE
                </label>
                <div
                  data-testid="file-upload-area"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative border-2 border-dashed rounded-sm p-12 cursor-pointer
                    transition-all duration-300
                    ${dragActive 
                      ? 'border-[#FF3B30] bg-[#FF3B30]/5' 
                      : 'border-[#262626] hover:border-[#FF3B30]/50 bg-[#0F0F0F]'
                    }
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileInput}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    data-testid="file-input"
                  />
                  
                  <div className="flex flex-col items-center gap-4">
                    {file ? (
                      <>
                        <FileText className="w-12 h-12 text-[#30D158]" />
                        <div className="text-center">
                          <p className="font-mono text-sm text-[#F5F5F7] mb-1">{file.name}</p>
                          <p className="font-mono text-xs text-[#86868B]">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-[#86868B]" />
                        <div className="text-center">
                          <p className="font-mono text-sm text-[#F5F5F7] mb-1">
                            Drop your resume here
                          </p>
                          <p className="font-mono text-xs text-[#86868B]">
                            PDF, DOC, or DOCX / Max 10MB
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Job Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <label className="font-mono text-xs uppercase tracking-widest text-[#86868B] mb-3 block">
                  JOB DESCRIPTION
                </label>
                <textarea
                  data-testid="job-description-input"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description here..."
                  className="w-full h-64 bg-[#0F0F0F] border border-[#262626] rounded-sm p-4 font-mono text-sm text-[#F5F5F7] placeholder:text-[#86868B] focus:border-[#FF3B30] focus:outline-none focus:ring-1 focus:ring-[#FF3B30] resize-none"
                />
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <div className="bg-[#FF3B30]/10 border border-[#FF3B30] rounded-sm p-4 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-[#FF3B30] flex-shrink-0" />
                      <p className="font-mono text-sm text-[#FF3B30]">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Analyze Button */}
              <motion.button
                data-testid="analyze-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,59,48,0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                disabled={!file || !jobDescription.trim()}
                className="w-full font-mono uppercase tracking-wider text-sm font-bold px-8 py-4 bg-[#FF3B30] text-white hover:bg-[#FF453A] rounded-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                RUN ANALYSIS
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

function AnalyzingScreen({ message }) {
  return (
    <div className="fixed inset-0 bg-[#050505] z-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ 
            opacity: [0.3, 1, 0.3],
            scale: [0.95, 1, 0.95]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <ScanLine className="w-16 h-16 text-[#FF3B30] mx-auto" />
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="font-['Azeret_Mono'] text-2xl font-bold tracking-tight text-[#F5F5F7]"
          >
            {message}
          </motion.p>
        </AnimatePresence>

        {/* Progress bar */}
        <motion.div 
          className="mt-8 w-64 h-1 bg-[#262626] rounded-full mx-auto overflow-hidden"
        >
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
            className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#FF3B30] to-transparent"
          />
        </motion.div>
      </div>
    </div>
  );
}
