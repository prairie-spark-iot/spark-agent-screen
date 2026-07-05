import React from 'react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0B0E14] text-[#e0e2ec] font-sans">
      <div className="text-center p-8 bg-[#0E1118] border border-[#222630] rounded-xl shadow-xl max-w-md">
        <h1 className="text-5xl font-extrabold text-[#ffb4ab] mb-4">404</h1>
        <p className="text-sm text-[#b9cacb] mb-6">Page Not Found in Spark Control Room Gateway</p>
        <a href="/" className="px-4 py-2 bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/40 rounded-lg text-xs font-bold hover:bg-[#ffb4ab]/30 transition-all inline-block">
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}
