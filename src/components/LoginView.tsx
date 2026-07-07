import React, { useState } from 'react';
import { useTranslation } from '../i18n/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LoginViewProps {
  logoSrc: string;
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ logoSrc, onLoginSuccess }) => {
  const { language, setLanguage, t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    setTimeout(() => {
      if (username.trim() === 'admin' && password === 'admin123456') {
        setLoading(false);
        onLoginSuccess();
      } else {
        setLoading(false);
        setError(true);
      }
    }, 450);
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('admin123456');
    setError(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#e0e2ec] flex flex-col justify-between relative overflow-hidden selection:bg-[#00cfbf] selection:text-[#0B0E14]">
      {/* Background cyber grid & glow decorations */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141822_1px,transparent_1px),linear-gradient(to_bottom,#141822_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-[#00cfbf]/20 via-[#00cfbf]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-t from-[#00cfbf]/15 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 flex items-center justify-between p-6 sm:px-12 border-b border-[#1f2533]/60 bg-[#0B0E14]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00cfbf]/20 to-transparent border border-[#00cfbf]/50 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(0,207,191,0.25)]">
            <img
              src={logoSrc}
              alt="Spark IoT Logo"
              className="w-full h-full object-contain rounded-lg"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-sans text-sm sm:text-base font-extrabold tracking-wider bg-gradient-to-r from-white via-[#00cfbf] to-[#7ffdf3] bg-clip-text text-transparent uppercase">
            {t('appName')}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141822] border border-[#2d3240] text-xs font-mono text-[#00cfbf]">
            <span className="w-2 h-2 rounded-full bg-[#00cfbf] animate-pulse" />
            <span>AI GATEWAY ONLINE</span>
          </div>
          <button
            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
            className="px-3 py-1.5 h-8 rounded-lg border border-[#3a494b] flex items-center justify-center text-xs font-mono font-bold text-[#e0e2ec] hover:text-white hover:bg-[#00cfbf]/15 hover:border-[#00cfbf]/50 transition-colors cursor-pointer uppercase gap-1.5 shadow-sm bg-[#12151C]"
          >
            <span className="material-symbols-outlined text-[15px] text-[#00cfbf]">language</span>
            {t('langBadge')}
          </button>
        </div>
      </header>

      {/* Main Login Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md bg-[#12151C]/95 border border-[#2d3240] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(0,207,191,0.1)] p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          {/* Top accent glow line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00cfbf] to-transparent" />

          {/* Header section */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#00cfbf]/10 border border-[#00cfbf]/40 flex items-center justify-center text-[#00cfbf] shadow-[0_0_20px_rgba(0,207,191,0.2)]">
              <span className="material-symbols-outlined text-3xl">shield_person</span>
            </div>
            <h2 className="font-sans text-xl sm:text-2xl font-extrabold text-white tracking-wide">
              {t('loginTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[#849495] mt-2 leading-relaxed">
              {t('loginSubtitle')}
            </p>
          </div>

          {/* Quick Demo Fill Alert */}
          <div className="mb-6 p-3.5 rounded-2xl bg-[#181d28] border border-[#00cfbf]/30 flex items-center justify-between gap-3 text-xs shadow-inner">
            <div className="flex items-center gap-2.5 text-[#e0e2ec] min-w-0">
              <span className="material-symbols-outlined text-[#00cfbf] text-lg flex-shrink-0">key</span>
              <div className="truncate">
                <span className="text-[#849495] block text-[11px]">{t('loginDemoHint')}</span>
                <span className="font-mono font-bold text-[#00cfbf]">admin</span> / <span className="font-mono font-bold text-[#00cfbf]">admin123456</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="px-3 py-1.5 rounded-lg bg-[#00cfbf]/20 hover:bg-[#00cfbf] text-[#00cfbf] hover:text-[#0B0E14] font-mono font-bold text-xs transition-all border border-[#00cfbf]/40 cursor-pointer flex-shrink-0 flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              {language === 'zh' ? '快捷填入' : 'Quick Fill'}
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
              <span className="material-symbols-outlined text-lg flex-shrink-0 mt-0.5">error</span>
              <span>{t('loginErrorMsg')}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-[#b9cacb] mb-2 uppercase tracking-wider">
                {t('loginUsernameLabel')}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-[#849495]">person</span>
                <Input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  className="pl-11 h-12 bg-[#0B0E14] border-[#2d3240] focus:border-[#00cfbf] text-sm text-white rounded-xl shadow-inner font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#b9cacb] mb-2 uppercase tracking-wider">
                {t('loginPasswordLabel')}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-[#849495]">lock</span>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-11 h-12 bg-[#0B0E14] border-[#2d3240] focus:border-[#00cfbf] text-sm text-white rounded-xl shadow-inner font-mono"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#00cfbf] hover:bg-[#00cfbf]/90 text-[#0B0E14] font-extrabold text-sm sm:text-base tracking-wider uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(0,207,191,0.3)] hover:shadow-[0_0_25px_rgba(0,207,191,0.5)] cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">login</span>
                  <span>{t('loginSubmitBtn')}</span>
                </>
              )}
            </Button>
          </form>

          {/* Footer security badge inside card */}
          <div className="mt-8 pt-5 border-t border-[#1f2533] flex items-center justify-center gap-2 text-[11px] font-mono text-[#667475]">
            <span className="material-symbols-outlined text-[14px] text-[#ffba43]">report</span>
            <span>DEMO MODE — NO REAL ENCRYPTION</span>
          </div>
        </div>
      </main>

      {/* Bottom status bar — static footer, no fake telemetry claims */}
      <footer className="relative z-10 py-4 px-6 text-center border-t border-[#1f2533]/60 bg-[#0B0E14]/80 text-xs font-mono text-[#667475] sm:px-12">
        <span>© 2026 Spark Industrial AI Monitoring Platform</span>
      </footer>
    </div>
  );
};
