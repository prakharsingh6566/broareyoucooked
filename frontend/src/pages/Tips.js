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
                title="ATS WILL GHOST YOU"
                tips={[
                  {
                    do: true,
                    text: "Copy the exact keywords from the job post. Like literally copy-paste them into your resume"
                  },
                  {
                    do: true,
                    text: "Use both 'AI' and 'Artificial Intelligence' because ATS is that dumb"
                  },
                  {
                    do: true,
                    text: "Stick to basic headers: 'Experience', 'Education', 'Skills' - robots can't read your creative section names"
                  },
                  {
                    do: false,
                    text: "Use graphics, images, or fancy formatting. ATS literally can't see them"
                  },
                  {
                    do: false,
                    text: "Put important stuff in headers/footers. That info gets deleted fr"
                  }
                ]}
              />

              <TipSection
                icon={<TrendingUp className="w-6 h-6" />}
                title="YOUR BULLETS ARE MID"
                tips={[
                  {
                    do: true,
                    text: "Use this: Action Verb + What you did + Tool/Method + NUMBERS. Always numbers."
                  },
                  {
                    do: true,
                    text: "If you can't add a percentage or metric, it's not worth putting on your resume"
                  },
                  {
                    do: true,
                    text: "Start with strong verbs: 'Led', 'Built', 'Shipped', 'Increased' - not 'Helped' or 'Assisted'"
                  },
                  {
                    do: false,
                    text: "Say 'Responsible for...' - that tells them nothing about what you actually DID"
                  },
                  {
                    do: false,
                    text: "List tasks without showing impact. Nobody cares that you attended meetings"
                  }
                ]}
              />

              <TipSection
                icon={<Zap className="w-6 h-6" />}
                title="KEYWORD GAME"
                tips={[
                  {
                    do: true,
                    text: "Match the tech stack exactly as written in the JD. They say 'React.js'? Don't put 'React'"
                  },
                  {
                    do: true,
                    text: "Make a skills section that's basically the job requirements but in your words"
                  },
                  {
                    do: true,
                    text: "Include soft skills only if you can back them with examples (not just saying 'good communicator')"
                  },
                  {
                    do: false,
                    text: "Say 'hardworking team player' - literally everyone says this and it means nothing"
                  },
                  {
                    do: false,
                    text: "List technologies you used 5 years ago. If you can't do it now, delete it"
                  }
                ]}
              />

              <TipSection
                icon={<FileText className="w-6 h-6" />}
                title="FORMATTING"
                tips={[
                  {
                    do: true,
                    text: "Single column layout. ATS reads left to right and gets confused by columns"
                  },
                  {
                    do: true,
                    text: "Use 11pt font minimum. Smaller = unreadable on mobile = instant delete"
                  },
                  {
                    do: true,
                    text: "Keep it to 1 page unless you have 10+ years experience. Page 2 doesn't exist to recruiters"
                  },
                  {
                    do: false,
                    text: "Use tables, text boxes, or fancy columns. ATS can't parse them"
                  },
                  {
                    do: false,
                    text: "Mix fonts or go crazy with colors. This isn't a design portfolio"
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
