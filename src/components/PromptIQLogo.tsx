import React from 'react';
import { Sparkles } from 'lucide-react';

interface PromptIQLogoProps {
  className?: string;
  showSubtitle?: boolean;
}

export const PromptIQLogo: React.FC<PromptIQLogoProps> = ({
  className = '',
  showSubtitle = true,
}) => {
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      {/* Visual Logo matching the attached image */}
      <div className="relative flex items-center justify-center bg-[#0b132b] px-8 py-5 rounded-2xl shadow-xl border border-slate-800/80 group transition-all duration-300 hover:border-blue-500/30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-blue-500/10 rounded-2xl opacity-50 blur-sm group-hover:opacity-100 transition-opacity"></div>
        <div className="relative flex items-center space-x-1">
          <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
            Prompt
          </span>
          <span className="text-4xl md:text-5xl font-black tracking-tight text-blue-500 font-sans drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]">
            IQ
          </span>
        </div>
      </div>

      {showSubtitle && (
        <div className="mt-3 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-medium tracking-wide shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>Сделано с помощью <strong>PromptIQ</strong></span>
        </div>
      )}
    </div>
  );
};
