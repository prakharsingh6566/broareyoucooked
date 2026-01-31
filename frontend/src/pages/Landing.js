import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Flame, ScanLine, Target, TrendingUp } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F7] relative overflow-hidden">
      {/* Noise texture overlay */}
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
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-6 md:px-12 lg:px-24 py-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 text-[#FF3B30]" />
              <h1 className="font-mono text-xl font-bold tracking-tight">BROAREYOUCOOKED</h1>
            </div>
            <nav className="flex items-center gap-6">
              <button
                onClick={() => navigate('/tips')}
                className="font-mono text-sm text-[#86868B] hover:text-[#F5F5F7] transition-colors uppercase tracking-wider"
              >
                TIPS
              </button>
              <button
                onClick={() => navigate('/history')}
                className="font-mono text-sm text-[#86868B] hover:text-[#F5F5F7] transition-colors uppercase tracking-wider"
              >
                HISTORY
              </button>
            </nav>
          </div>
        </motion.header>

        {/* Hero Section */}
        <div className="px-6 md:px-12 lg:px-24 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Left: Text */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:col-span-7"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="font-mono text-xs uppercase tracking-widest text-[#86868B] mb-6"
              >
                RESUME DIAGNOSTIC SYSTEM
              </motion.div>
              
              <h1 className="font-['Azeret_Mono'] text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-6">
                <span className="text-[#F5F5F7]">ARE YOU</span>
                <br />
                <span className="text-[#FF3B30]">COOKED?</span>
              </h1>
              
              <p className="font-['Manrope'] text-lg md:text-xl text-[#86868B] leading-relaxed mb-8 max-w-2xl">
                Clinical ATS analysis. Brutal honesty. Zero fluff.
                <br />
                See how your resume actually scores before HR does.
              </p>

              <motion.button
                data-testid="get-started-btn"
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,59,48,0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/analyze')}
                className="font-mono uppercase tracking-wider text-sm font-bold px-8 py-4 bg-[#FF3B30] text-white hover:bg-[#FF453A] rounded-sm transition-all duration-200"
              >
                RUN DIAGNOSTIC
              </motion.button>
            </motion.div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="md:col-span-5"
            >
              <div className="relative aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF3B30]/20 to-[#30D158]/20 blur-3xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1741705054392-c0212d99dc97?crop=entropy&cs=srgb&fm=jpg&q=85"
                  alt="Thermal diagnostic"
                  className="relative rounded-sm w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 border border-white/10 rounded-sm"></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="px-6 md:px-12 lg:px-24 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<ScanLine className="w-6 h-6" />}
              title="ATS SCAN"
              description="See exactly what applicant tracking systems see in your resume"
              delay={0.6}
            />
            <FeatureCard 
              icon={<Target className="w-6 h-6" />}
              title="KEYWORD MATCH"
              description="Identify missing keywords that matter to recruiters"
              delay={0.7}
            />
            <FeatureCard 
              icon={<TrendingUp className="w-6 h-6" />}
              title="IMPACT SCORING"
              description="Measure the strength of your achievements and results"
              delay={0.8}
            />
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="px-6 md:px-12 lg:px-24 py-12 border-t border-[#262626]"
        >
          <p className="font-mono text-xs text-[#86868B] text-center">
            Built for the rejected. Powered by AI.
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-[#0F0F0F] border border-[#262626] p-6 rounded-sm hover:border-white/20 transition-colors duration-300 group"
    >
      <div className="text-[#FF3B30] mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-mono text-sm uppercase tracking-widest mb-2 text-[#F5F5F7]">
        {title}
      </h3>
      <p className="font-['Manrope'] text-sm text-[#86868B] leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
