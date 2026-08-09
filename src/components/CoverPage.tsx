import React from 'react';
import { PromptIQLogo } from './PromptIQLogo';
import { CATEGORIES } from '../data/promptsData';
import { 
  FileText, 
  Send, 
  Users, 
  Compass, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Wand2, 
  Download,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

interface CoverPageProps {
  onStartExplore: () => void;
  onOpenGenerator: () => void;
  onOpenExport: () => void;
  onSelectCategory: (categoryId: number) => void;
}

export const CoverPage: React.FC<CoverPageProps> = ({
  onStartExplore,
  onOpenGenerator,
  onOpenExport,
  onSelectCategory,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText className="w-5 h-5 text-blue-400" />;
      case 'Send': return <Send className="w-5 h-5 text-indigo-400" />;
      case 'Users': return <Users className="w-5 h-5 text-sky-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-teal-400" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      default: return <FileText className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Banner / Hero Container */}
      <header className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 overflow-hidden">
        {/* Glowing background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Logo Section */}
          <div className="mb-8 flex justify-center">
            <PromptIQLogo showSubtitle={true} />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            Пак из <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">50 профессиональных AI-промптов</span>
            <span className="block text-2xl sm:text-3xl lg:text-4xl text-slate-300 font-semibold mt-3">
              Тема: Маркетинг и контент
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 mb-10 leading-relaxed font-normal">
            Полное практическое руководство для маркетологов, копирайтеров, контент-мейкеров, SMM-специалистов и предпринимателей. Каждая готовая команда составлена по проверенной формуле инженерных промптов: <span className="text-blue-300 font-semibold">Роль + Задача + Контекст + Формат + Ограничения</span>.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <button
              onClick={onStartExplore}
              className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-2 group cursor-pointer"
            >
              <span>Открыть 50 промптов</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenExport}
              className="px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-medium text-sm transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Скачать весь пак (MD)</span>
            </button>
          </div>

          {/* Key Metrics / Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-2xl font-bold text-blue-400 mb-1">50 промптов</div>
              <div className="text-xs text-slate-400">Нумерованный полный каталог</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-2xl font-bold text-indigo-400 mb-1">5 категорий</div>
              <div className="text-xs text-slate-400">По 10 промптов в каждой</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-2xl font-bold text-sky-400 mb-1">5-шаговая формула</div>
              <div className="text-xs text-slate-400">Роль + Задача + Контекст + ...</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-2xl font-bold text-emerald-400 mb-1">100% готовность</div>
              <div className="text-xs text-slate-400">Для ChatGPT, Claude, DeepSeek</div>
            </div>
          </div>
        </div>
      </header>

      {/* Formula Explanation Section */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Золотой стандарт инженерных промптов</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Формула профессионального промпта</h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            Все 50 промптов в данном паке созданы по этой строгой методологии для получения наиболее точных, развернутых и профессиональных ответов нейросетей.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/30 relative group hover:border-blue-500/60 transition-all">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">1. Роль</div>
            <div className="text-sm font-semibold text-white mb-1">Задайте экспертность</div>
            <p className="text-xs text-slate-400 leading-relaxed">Кем должен выступать ИИ (CMO, Direct Response Copywriter, Head of SEO).</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/30 relative group hover:border-indigo-500/60 transition-all">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">2. Задача</div>
            <div className="text-sm font-semibold text-white mb-1">Четкая цель</div>
            <p className="text-xs text-slate-400 leading-relaxed">Что именно нужно сделать (провести CustDev, написать продающий пост).</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-sky-500/30 relative group hover:border-sky-500/60 transition-all">
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">3. Контекст</div>
            <div className="text-sm font-semibold text-white mb-1">Входные данные</div>
            <p className="text-xs text-slate-400 leading-relaxed">Описание вашего продукта, ЦА, болей и переменные в скобках [].</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-teal-500/30 relative group hover:border-teal-500/60 transition-all">
            <div className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-1">4. Формат</div>
            <div className="text-sm font-semibold text-white mb-1">Вид ответа</div>
            <p className="text-xs text-slate-400 leading-relaxed">Таблица, маркированный список, скрипт диалога, 3 варианта.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 relative group hover:border-emerald-500/60 transition-all">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">5. Ограничения</div>
            <div className="text-sm font-semibold text-white mb-1">Правила и лимиты</div>
            <p className="text-xs text-slate-400 leading-relaxed">Без штампов, максимум 200 слов, глаголы действия, без оправданий.</p>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">5 Категорий каталога</h2>
            <p className="text-slate-400 text-sm mt-1">Каждая категория содержит по 10 специализированных промптов (Всего 50)</p>
          </div>
          <button
            onClick={onStartExplore}
            className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            <span>Смотреть все 50 промптов</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 group-hover:bg-blue-600/20 transition-colors">
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <span className="text-xs font-bold text-slate-500 group-hover:text-blue-400 transition-colors">
                    10 промптов
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  Категория {cat.id}: {cat.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-blue-400">
                <span>Промпты #{((cat.id - 1) * 10) + 1} – #{cat.id * 10}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="mt-auto py-8 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-semibold">PromptIQ</span>
            <span>•</span>
            <span>Пак из 50 AI-промптов для маркетинга и контента</span>
          </div>
          <div className="flex items-center space-x-1 text-slate-400">
            <span>Создано с помощью</span>
            <span className="font-bold text-blue-400">PromptIQ</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
