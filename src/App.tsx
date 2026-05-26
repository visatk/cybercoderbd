import { useState } from 'react';
import { 
  Download, Search, AlertCircle, PlayCircle, FileText, 
  ChevronRight, CheckCircle2, Zap, Shield, Globe2, 
  HelpCircle, ArrowRight
} from 'lucide-react';

interface Subtitle {
  language: string;
  languageCode: string;
  url: string;
  format: string;
}

interface ExtractResponse {
  platform: string;
  title: string;
  subtitles: Subtitle[];
  error?: string;
}

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExtractResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      // API call to our backend (Cloudflare Worker)
      const res = await fetch(`/api/extract?url=${encodeURIComponent(url)}`);
      const result = await res.json();

      if (!res.ok) throw new Error(result.error || 'Failed to extract subtitles');
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (subtitleUrl: string) => {
    window.open(subtitleUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-black text-indigo-600 tracking-tight">
            <Download className="w-7 h-7" strokeWidth={2.5} />
            <span>SubFetch</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it Works</a>
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">API</a>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center">
        
        {/* Hero Section */}
        <section className="w-full max-w-5xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wide mb-8 border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <Zap className="w-4 h-4 fill-indigo-500" /> V2.0 Now Supports Vimeo
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-center tracking-tight mb-6 leading-tight text-slate-900">
            Download Subtitles <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
              Instantly & Free
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 text-center max-w-2xl mb-12 font-medium">
            The fastest way to extract closed captions from YouTube and Vimeo. Download high-quality SRT, VTT, and TXT files with just one click.
          </p>

          {/* Search/Input Form */}
          <div className="w-full max-w-3xl relative animate-in fade-in slide-in-from-bottom-6">
            <form onSubmit={handleExtract} className="relative shadow-2xl shadow-indigo-100/50 rounded-2xl bg-white p-2 sm:p-3 flex flex-col sm:flex-row gap-3 border border-slate-200">
              <div className="relative flex-grow flex items-center">
                <Search className="absolute left-4 w-6 h-6 text-slate-400" />
                <input
                  type="url"
                  placeholder="Paste video URL here (e.g., https://youtube.com/watch?v=...)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="w-full pl-14 pr-4 py-4 rounded-xl border-none bg-transparent text-lg focus:ring-0 outline-none placeholder:text-slate-400 font-medium text-slate-700"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[180px] shadow-md shadow-indigo-200 active:scale-[0.98]"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Extract <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>

            {/* Supported Platforms Micro-copy */}
            <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-500">
              <span className="flex items-center gap-1.5"><PlayCircle className="w-4 h-4 text-rose-500" /> YouTube</span>
              <span className="flex items-center gap-1.5"><PlayCircle className="w-4 h-4 text-sky-500" /> Vimeo</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 w-full max-w-3xl border border-red-100 shadow-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {/* Results Area */}
          {data && (
            <div className="mt-12 w-full max-w-3xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/40 animate-in fade-in slide-in-from-bottom-8">
              
              {/* Result Header */}
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded mb-2 inline-block">
                    {data.platform}
                  </span>
                  <h3 className="font-extrabold text-xl text-slate-900 line-clamp-2 leading-tight">{data.title}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1.5">Successfully extracted {data.subtitles.length} subtitle tracks</p>
                </div>
              </div>
              
              {/* Subtitle Tracks List */}
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto custom-scrollbar">
                {data.subtitles.map((sub, idx) => (
                  <div key={idx} className="p-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group">
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black uppercase border border-indigo-100 shadow-sm group-hover:scale-105 transition-transform">
                        {sub.languageCode.split('-')[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-lg">{sub.language}</p>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Format: {sub.format}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDownload(sub.url)}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-sm rounded-xl transition-colors w-full sm:w-auto shadow-sm active:scale-95"
                    >
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SEO & Value Sections */}
        {!data && !loading && (
          <section className="w-full bg-white border-t border-slate-200 pt-20 pb-24 mt-10">
            <div className="container mx-auto px-6 max-w-6xl">
              
              {/* How it works */}
              <div id="how-it-works" className="mb-24">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-4">How to Download Subtitles</h2>
                  <p className="text-lg text-slate-500 font-medium">Get your captions in three simple steps.</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { step: '1', title: 'Copy the URL', desc: 'Find the video on YouTube or Vimeo and copy its link from your browser address bar.' },
                    { step: '2', title: 'Paste & Extract', desc: 'Paste the copied URL into the search box above and hit the Extract button.' },
                    { step: '3', title: 'Download File', desc: 'Choose your preferred language and format (SRT, VTT, or TXT) and download instantly.' }
                  ].map((item, i) => (
                    <div key={i} className="relative p-8 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-black mb-6 shadow-lg shadow-indigo-200">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                      <p className="text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div id="features" className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-6 leading-tight">
                    Why choose SubFetch for your captioning needs?
                  </h2>
                  <p className="text-lg text-slate-600 font-medium mb-8 leading-relaxed">
                    We built this tool to be fast, reliable, and completely free. Whether you are a student, creator, or researcher, getting accurate text from videos has never been easier.
                  </p>
                  
                  <div className="space-y-5">
                    {[
                      { icon: <Shield className="w-6 h-6 text-indigo-500" />, text: '100% Secure & Privacy Friendly (No Data Logged)' },
                      { icon: <Globe2 className="w-6 h-6 text-indigo-500" />, text: 'Supports Auto-Translated & Multi-language Captions' },
                      { icon: <CheckCircle2 className="w-6 h-6 text-indigo-500" />, text: 'No Software Installation or Registration Required' }
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="p-2 bg-indigo-50 rounded-lg">{feature.icon}</div>
                        <span className="font-bold text-slate-700">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Visual Placeholder / Abstract Graphic */}
                <div className="relative h-[400px] rounded-3xl bg-gradient-to-br from-indigo-50 to-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-8">
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                  <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 w-full max-w-sm rotate-[-2deg] border border-slate-100">
                     <div className="h-4 w-24 bg-slate-200 rounded mb-4"></div>
                     <div className="space-y-3">
                       <div className="h-3 w-full bg-slate-100 rounded"></div>
                       <div className="h-3 w-5/6 bg-slate-100 rounded"></div>
                       <div className="h-3 w-4/6 bg-slate-100 rounded"></div>
                     </div>
                     <div className="mt-6 flex justify-end">
                       <div className="h-8 w-24 bg-indigo-100 rounded-lg"></div>
                     </div>
                  </div>
                </div>
              </div>

            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xl font-black text-white mb-6">
            <Download className="w-6 h-6" />
            <span>SubFetch</span>
          </div>
          <p className="font-medium mb-6">Built with Lean MVP principles. Providing free subtitle extraction tools for everyone.</p>
          <div className="flex justify-center gap-6 text-sm font-semibold">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="mt-8 text-xs text-slate-600">&copy; {new Date().getFullYear()} SubFetch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
