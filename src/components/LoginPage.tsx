import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const validPasswords = ['promptiq2025', 'piq-marketing-2025'];

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        localStorage.setItem('promptiq_authenticated', 'true');
        document.cookie = `piq-access=${password}; path=/; max-age=${60 * 60 * 24 * 30}`;
        onSuccess();
        return;
      } else if (res.status === 401) {
        setError('Неверный пароль');
        return;
      }
    } catch {
      // Backend not reached (e.g. static export) - proceed to static check
    }

    // Static / Offline fallback
    if (validPasswords.includes(password.trim())) {
      localStorage.setItem('promptiq_authenticated', 'true');
      document.cookie = `piq-access=${password}; path=/; max-age=${60 * 60 * 24 * 30}`;
      onSuccess();
    } else {
      setError('Неверный пароль');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f1f3d] flex flex-col items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
      {/* Top Logo */}
      <div className="text-center mb-6">
        <div className="text-[36px] font-bold tracking-tight inline-flex items-center justify-center">
          <span className="text-white">Prompt</span>
          <span className="text-[#2563eb]">IQ</span>
        </div>
      </div>

      {/* Centered card with white background, rounded corners, shadow */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-100/10">
        <div className="text-center mb-6">
          <div className="text-[36px] font-bold tracking-tight inline-flex items-center justify-center mb-2">
            <span className="text-slate-900">Prompt</span>
            <span className="text-[#2563eb]">IQ</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            50 AI-промптов для маркетинга и контента
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password-input"
              className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
            >
              Пароль доступа
            </label>
            <div className="relative">
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Введите пароль доступа"
                className="w-full pl-4 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all text-sm font-medium"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full py-3.5 px-6 bg-[#2563eb] hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer"
          >
            <span>{isLoading ? 'Проверка...' : 'Войти →'}</span>
          </button>
        </form>
      </div>

      {/* Footer text */}
      <footer className="mt-8 text-center text-xs text-slate-400 font-medium">
        © 2025 PromptIQ · promptiq.com
      </footer>
    </div>
  );
}
