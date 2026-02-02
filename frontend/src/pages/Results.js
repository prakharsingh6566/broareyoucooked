import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const shareRef = useRef(null);
  const [analysis, setAnalysis] = useState(null);
  const [displayedScore, setDisplayedScore] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!location.state?.analysis) {
      navigate('/analyze');
      return;
    }
    
    setAnalysis(location.state.analysis);
    
    // Animate score counter
    setTimeout(() => {
      let start = 0;
      const end = location.state.analysis.score;
      const duration = 1500;
      const increment = end / (duration / 16);
      
      const counter = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayedScore(end);
          clearInterval(counter);
          setTimeout(() => setShowContent(true), 300);
        } else {
          setDisplayedScore(Math.floor(start));
        }
      }, 16);
    }, 500);
  }, [location.state, navigate]);

  const getScoreColor = () => {
    if (!analysis) return '#FF3B30';
    if (analysis.score <= 30) return '#30D158';
    if (analysis.score <= 60) return '#FF9F0A';
    if (analysis.score <= 80) return '#FF3B30';
    return '#8B0000';
  };

  const getScoreGradient = () => {
    if (!analysis) return 'from-[#FF3B30]/20 to-[#FF3B30]/5';
    if (analysis.score <= 30) return 'from-[#30D158]/20 to-[#30D158]/5';
    if (analysis.score <= 60) return 'from-[#FF9F0A]/20 to-[#FF9F0A]/5';
    if (analysis.score <= 80) return 'from-[#FF3B30]/20 to-[#FF3B30]/5';
    return 'from-[#8B0000]/20 to-[#8B0000]/5';
  };

  const handleShare = async () => {
    if (!shareRef.current) return;
    
    try {
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: '#050505',
        scale: 2,
      });
      
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `resume-score-${analysis.score}.png`;
        link.href = url;
        link.click();
      });
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  if (!analysis) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F7] relative overflow-hidden">
      {/* Noise texture */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulance type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
           }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="px-4 sm:px-6 md:px-12 lg:px-24 py-6 md:py-8 border-b border-[#262626]">
          <button
            data-testid="back-to-home-button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#86868B] hover:text-[#F5F5F7] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            TRY AGAIN
          </button>
        </header>

        <div className="px-4 sm:px-6 md:px-12 lg:px-24 py-8 sm:py-12 md:py-16">
          {/* Score Hero Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12 sm:mb-16"
          >
            <div 
              ref={shareRef}
              className={`relative max-w-2xl mx-auto text-center p-8 sm:p-12 rounded-sm border border-[#262626] bg-gradient-to-b ${getScoreGradient()} overflow-hidden`}
            >
              {/* Background image */}
              <div className="absolute inset-0 opacity-20">
                <img 
                  src={analysis.score > 60 
                    ? "https://images.unsplash.com/photo-1736095301452-00189a1e1b88?crop=entropy&cs=srgb&fm=jpg&q=85"
                    : "https://images.unsplash.com/photo-1759268966417-ddff35efd0af?crop=entropy&cs=srgb&fm=jpg&q=85"
                  }
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mb-4 sm:mb-6"
                >
                  <div 
                    className="font-['Azeret_Mono'] text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter"
                    style={{ color: getScoreColor() }}
                    data-testid="score-display"
                  >
                    {displayedScore}
                  </div>
                  <div className="font-mono text-xs uppercase tracking-widest text-[#86868B] mt-2">
                    HOW COOKED YOU ARE
                  </div>
                </motion.div>

                <AnimatePresence>
                  {showContent && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="font-['Manrope'] text-base sm:text-xl md:text-2xl text-[#F5F5F7] px-2"
                      data-testid="reaction-text"
                    >
                      {analysis.reaction}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {showContent && (
              <>
                {/* Keywords Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12"
                >
                  <KeywordBox 
                    title="KEYWORDS FOUND"
                    keywords={analysis.keywords_found}
                    icon={<CheckCircle2 className="w-5 h-5" />}
                    color="text-[#30D158]"
                  />
                  <KeywordBox 
                    title="KEYWORDS MISSING"
                    keywords={analysis.keywords_missing}
                    icon={<AlertTriangle className="w-5 h-5" />}
                    color="text-[#FF3B30]"
                  />
                </motion.div>

                {/* Feedback Section */}
                {analysis.feedback && analysis.feedback.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mb-8 sm:mb-12"
                  >
                    <h2 className="font-['Azeret_Mono'] text-2xl sm:text-3xl font-bold tracking-tight mb-4 sm:mb-6 uppercase">
                      HERE'S THE DAMAGE
                    </h2>
                    
                    <div className="grid grid-cols-1 gap-6">
                      {analysis.feedback.map((item, index) => (
                        <FeedbackCard key={index} item={item} delay={0.4 + index * 0.1} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Suggestions Section */}
                {analysis.suggestions && analysis.suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mb-12"
                  >
                    <h2 className="font-['Azeret_Mono'] text-3xl font-bold tracking-tight mb-6 uppercase">
                      FIX YOUR RESUME
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {analysis.suggestions.map((suggestion, index) => (
                        <SuggestionCard 
                          key={index} 
                          suggestion={suggestion} 
                          delay={0.6 + index * 0.1} 
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Share Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="text-center"
                >
                  <button
                    data-testid="share-button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 font-mono uppercase tracking-wider text-sm font-bold px-8 py-4 border border-[#262626] hover:border-[#FF3B30] bg-[#0F0F0F] text-[#F5F5F7] rounded-sm transition-all duration-200"
                  >
                    <Share2 className="w-4 h-4" />
                    SHARE MY L
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function KeywordBox({ title, keywords, icon, color }) {
  return (
    <div className="bg-[#0F0F0F] border border-[#262626] rounded-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className={color}>{icon}</span>
        <h3 className="font-mono text-xs uppercase tracking-widest text-[#86868B]">
          {title}
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {keywords && keywords.length > 0 ? (
          keywords.map((keyword, index) => (
            <span 
              key={index}
              className={`font-mono text-xs px-3 py-1 rounded-sm bg-[#1A1A1A] border border-[#262626] ${color}`}
            >
              {keyword}
            </span>
          ))
        ) : (
          <span className="font-mono text-xs text-[#86868B]">Nothing here fr 💀</span>
        )}
      </div>
    </div>
  );
}

function FeedbackCard({ item, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-[#0F0F0F] border border-[#262626] hover:border-[#FF3B30]/50 rounded-sm p-6 transition-colors duration-300"
      data-testid="feedback-card"
    >
      {/* Category */}
      <div className="inline-block font-mono text-xs uppercase tracking-widest text-[#FF3B30] bg-[#FF3B30]/10 px-3 py-1 rounded-sm mb-4">
        {item.category}
      </div>

      {/* Problem */}
      <h3 className="font-['Azeret_Mono'] text-xl font-bold mb-2 text-[#F5F5F7]">
        {item.problem}
      </h3>

      {/* Why */}
      <p className="font-['Manrope'] text-sm text-[#86868B] italic mb-4">
        {item.why}
      </p>

      {/* Fix */}
      <div className="mb-4">
        <h4 className="font-mono text-xs uppercase tracking-widest text-[#30D158] mb-2">
          FIX
        </h4>
        <p className="font-['Manrope'] text-sm text-[#F5F5F7]">
          {item.fix}
        </p>
      </div>

      {/* Examples */}
      {item.before_example && item.after_example && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/30 rounded-sm p-3">
            <div className="font-mono text-xs uppercase tracking-widest text-[#FF3B30] mb-2">
              ❌ BEFORE
            </div>
            <p className="font-['Manrope'] text-xs text-[#F5F5F7]">
              {item.before_example}
            </p>
          </div>
          <div className="bg-[#30D158]/10 border border-[#30D158]/30 rounded-sm p-3">
            <div className="font-mono text-xs uppercase tracking-widest text-[#30D158] mb-2">
              ✅ AFTER
            </div>
            <p className="font-['Manrope'] text-xs text-[#F5F5F7]">
              {item.after_example}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function SuggestionCard({ suggestion, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-[#0F0F0F] border border-[#262626] rounded-sm p-6 hover:border-[#30D158]/50 transition-colors duration-300 group"
      data-testid="suggestion-card"
    >
      <div className="flex items-start gap-3">
        <TrendingUp className="w-5 h-5 text-[#30D158] flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" />
        <p className="font-['Manrope'] text-sm text-[#F5F5F7] leading-relaxed">
          {suggestion}
        </p>
      </div>
    </motion.div>
  );
}
