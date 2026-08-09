import React, { useState, useEffect } from 'react';
import { CoverPage } from './components/CoverPage';
import { PromptList } from './components/PromptList';
import { AIPromptGeneratorModal } from './components/AIPromptGeneratorModal';
import { ExportModal } from './components/ExportModal';
import { LoginPage } from './components/LoginPage';

export default function App() {
  // Check if authenticated from cookie or local state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const hasCookie = document.cookie.includes('piq-access=');
      const hasStorage = localStorage.getItem('promptiq_authenticated') === 'true';
      return hasCookie || hasStorage;
    } catch {
      return false;
    }
  });

  const [currentView, setCurrentView] = useState<'cover' | 'explore'>('cover');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Check auth with server endpoint on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
            localStorage.setItem('promptiq_authenticated', 'true');
          }
        }
      } catch {
        // Fallback to local state
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    localStorage.removeItem('promptiq_authenticated');
    document.cookie = 'piq-access=; path=/; max-age=0;';
    setIsAuthenticated(false);
  };

  // Persistent Favorites
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('promptiq_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('promptiq_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  }, [favorites]);

  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectCategoryFromCover = (catId: number) => {
    setSelectedCategoryId(catId);
    setCurrentView('explore');
  };

  // If not authenticated, render login page
  if (!isAuthenticated) {
    return <LoginPage onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative">
      {/* Subtle top logout control */}
      <div className="absolute top-4 right-4 z-40">
        <button
          onClick={handleLogout}
          title="Выйти из аккаунта (сменить пароль)"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/60 hover:border-red-500/30 text-xs font-medium transition-all cursor-pointer backdrop-blur-sm shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Выйти</span>
        </button>
      </div>

      {currentView === 'cover' ? (
        <CoverPage
          onStartExplore={() => {
            setSelectedCategoryId(null);
            setCurrentView('explore');
          }}
          onOpenGenerator={() => setIsGeneratorOpen(true)}
          onOpenExport={() => setIsExportOpen(true)}
          onSelectCategory={handleSelectCategoryFromCover}
        />
      ) : (
        <PromptList
          initialCategoryId={selectedCategoryId}
          onBackToHome={() => setCurrentView('cover')}
          onOpenGenerator={() => setIsGeneratorOpen(true)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* AI Custom Prompt Generator Modal */}
      <AIPromptGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
      />

      {/* Export Pack Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
