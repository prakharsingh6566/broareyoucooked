import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, FileText, TrendingUp } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/history`);
      setHistory(response.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'safe': return 'text-[#30D158]';
      case 'warning': return 'text-[#FF9F0A]';
      case 'cooked': return 'text-[#FF3B30]';
      case 'burnt': return 'text-[#8B0000]';
      default: return 'text-[#86868B]';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F7] relative overflow-hidden">
      {/* Noise texture */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
           }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 md:px-12 lg:px-24 py-8 border-b border-[#262626]">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 font-mono text-sm text-[#86868B] hover:text-[#F5F5F7] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK
          </button>
        </header>

        <div className="px-6 md:px-12 lg:px-24 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-['Azeret_Mono'] text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">
              YOUR PAST L'S
            </h1>
            <p className="font-['Manrope'] text-lg text-[#86868B] mb-12">
              All the times we roasted your resume
            </p>

            {loading ? (
              <div className="text-center py-12">
                <div className="font-mono text-sm text-[#86868B]">Loading your damage report...</div>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-[#86868B] mx-auto mb-4" />
                <p className="font-mono text-sm text-[#86868B]">Nothing yet. Upload a resume to get roasted fr</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {history.map((item, index) => (
                  <HistoryCard key={item.id} item={item} index={index} navigate={navigate} getLevelColor={getLevelColor} formatDate={formatDate} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function HistoryCard({ item, index, navigate, getLevelColor, formatDate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={() => navigate(`/results`, { state: { analysisId: item.id } })}
      className="bg-[#0F0F0F] border border-[#262626] rounded-sm p-6 hover:border-[#FF3B30]/50 transition-colors duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-[#86868B]" />
            <h3 className="font-['Azeret_Mono'] text-lg font-bold text-[#F5F5F7]">
              {item.filename}
            </h3>
          </div>
          
          <p className="font-['Manrope'] text-sm text-[#86868B] mb-3 line-clamp-2">
            {item.job_description_snippet}
          </p>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              <span className="text-[#86868B]">{formatDate(item.timestamp)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className={`font-['Azeret_Mono'] text-4xl font-black ${getLevelColor(item.level)}`}>
            {item.score}
          </div>
          <div className="font-mono text-xs uppercase tracking-wider text-[#86868B]">
            {item.level}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
