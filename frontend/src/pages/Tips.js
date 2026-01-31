import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Zap, Target, FileText, TrendingUp } from 'lucide-react';

export default function Tips() {
  const navigate = useNavigate();

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
            className="max-w-4xl mx-auto"
          >
            <h1 className="font-['Azeret_Mono'] text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">
              STOP GETTING REJECTED
            </h1>
            <p className="font-['Manrope'] text-lg text-[#86868B] mb-12">
              Real talk on how to not get instantly ghosted by ATS
            </p>

            <div className="space-y-8">
              <TipSection
                icon={<Target className="w-6 h-6" />}
                title="ATS OPTIMIZATION"
                tips={[
                  {
                    do: true,
                    text: "Use exact keywords from the job description"
                  },
                  {
                    do: true,
                    text: "Include both acronyms and full terms (e.g., 'AI' and 'Artificial Intelligence')"
                  },
                  {
                    do: true,
                    text: "Use standard section headings: 'Experience', 'Education', 'Skills'"
                  },
                  {
                    do: false,
                    text: "Use images, graphics, or complex formatting"
                  },
                  {
                    do: false,
                    text: "Put important info in headers/footers"
                  }
                ]}
              />

              <TipSection
                icon={<TrendingUp className="w-6 h-6" />}
                title="IMPACT STATEMENTS"
                tips={[
                  {
                    do: true,
                    text: "Use the formula: Action Verb + Task + Tool/Method + Result"
                  },
                  {
                    do: true,
                    text: "Include numbers and percentages whenever possible"
                  },
                  {
                    do: true,
                    text: "Start each bullet with a strong action verb"
                  },
                  {
                    do: false,
                    text: "Use passive voice or vague responsibilities"
                  },
                  {
                    do: false,
                    text: "List duties without showing impact"
                  }
                ]}
              />

              <TipSection
                icon={<Zap className="w-6 h-6" />}
                title="KEYWORDS & SKILLS"
                tips={[
                  {
                    do: true,
                    text: "Mirror the exact technologies mentioned in the JD"
                  },
                  {
                    do: true,
                    text: "Group skills by category for easy scanning"
                  },
                  {
                    do: true,
                    text: "Include both technical and soft skills"
                  },
                  {
                    do: false,
                    text: "Use generic terms like 'hardworking' or 'team player'"
                  },
                  {
                    do: false,
                    text: "List outdated or irrelevant technologies"
                  }
                ]}
              />

              <TipSection
                icon={<FileText className="w-6 h-6" />}
                title="FORMATTING"
                tips={[
                  {
                    do: true,
                    text: "Use a clean, single-column layout"
                  },
                  {
                    do: true,
                    text: "Keep font size between 10-12pt for body text"
                  },
                  {
                    do: true,
                    text: "Use consistent bullet points and spacing"
                  },
                  {
                    do: false,
                    text: "Use tables, text boxes, or columns"
                  },
                  {
                    do: false,
                    text: "Mix multiple fonts or colors"
                  }
                ]}
              />

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-[#FF3B30]/10 border border-[#FF3B30]/30 rounded-sm p-6"
              >
                <h3 className="font-['Azeret_Mono'] text-xl font-bold mb-4 text-[#FF3B30] uppercase">
                  Critical Stats
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatBox number="6 sec" label="Average time recruiters spend on a resume" />
                  <StatBox number="75%" label="Of resumes are rejected by ATS before human review" />
                  <StatBox number="40%" label="Of applicants lie about their skills" />
                </div>
              </motion.div>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center pt-8"
              >
                <button
                  onClick={() => navigate('/analyze')}
                  className="font-mono uppercase tracking-wider text-sm font-bold px-8 py-4 bg-[#FF3B30] text-white hover:bg-[#FF453A] rounded-sm transition-all duration-200"
                >
                  TEST YOUR RESUME NOW
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function TipSection({ icon, title, tips }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-[#0F0F0F] border border-[#262626] rounded-sm p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[#FF3B30]">{icon}</span>
        <h2 className="font-['Azeret_Mono'] text-2xl font-bold uppercase tracking-tight">
          {title}
        </h2>
      </div>

      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-3">
            {tip.do ? (
              <CheckCircle2 className="w-5 h-5 text-[#30D158] flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-[#FF3B30] flex-shrink-0 mt-0.5" />
            )}
            <p className="font-['Manrope'] text-sm text-[#F5F5F7] leading-relaxed">
              {tip.text}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function StatBox({ number, label }) {
  return (
    <div className="text-center">
      <div className="font-['Azeret_Mono'] text-3xl font-black text-[#F5F5F7] mb-1">
        {number}
      </div>
      <div className="font-['Manrope'] text-xs text-[#86868B]">
        {label}
      </div>
    </div>
  );
}
