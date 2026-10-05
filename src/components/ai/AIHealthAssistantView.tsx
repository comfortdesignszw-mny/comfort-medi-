import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { HEALTH_ARTICLES, HealthArticle } from '../../data/healthLibraryData';
import { processOfflineHealthQuery } from '../../data/offlineAIEngine';
import { 
  Bot, 
  Send, 
  BookOpen, 
  ShieldAlert, 
  Search, 
  PhoneCall, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  X,
  ExternalLink,
  Languages
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isEmergencyAlert?: boolean;
  suggestedActions?: string[];
}

export const AIHealthAssistantView: React.FC = () => {
  const language = useAppStore(s => s.language);
  const userProfile = useAppStore(s => s.userProfile);
  const medications = useAppStore(s => s.medications);
  const chronicConditions = useAppStore(s => s.chronicConditions);
  const allergies = useAppStore(s => s.allergies);

  const [activeTab, setActiveTab] = useState<'assistant' | 'library'>('assistant');
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<HealthArticle | null>(null);
  const [librarySearch, setLibrarySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Initial messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: language === 'sn'
        ? `Mhoro! Ndiri Comfort Medi+ AI Assistant. Ndiri pano kukubatsirai neruzivo rweutano, mashandisirwo emishonga, kudzivirira hosha, uye rubatsiro rwechimbi-chimbi muZimbabwe.\n\n*Yambiro: Handisi chiremba uye handikwanisi kupa mutongo wechirwere (diagnosis). Taura nechiremba pachipatara chiri pedyo.*`
        : language === 'nd'
        ? `Salibonani! Ngingumsizi we-AI we-Comfort Medi+. Ngilapha ukukuncedisa ngolwazi lwezempilakahle, ukunatha imithi, lokwelashwa okuphuthumayo eZimbabwe.\n\n*Isixwayiso: Kangisuye udokotela njalo kanginiki isinqumo sesifo. Bonana lodokotela esibhedlela esiseduze.*`
        : `Hello! I am your Comfort Medi+ Health Information Assistant. I can help explain medical concepts, medication schedules, nutrition guidelines, and first aid designed for Zimbabwean health settings.\n\n*Medical Safety Notice: I provide educational guidance only and do not replace a licensed medical doctor or prescribe treatments. In an emergency, please visit casualty immediately.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const quickPrompts = [
    { label: 'High Blood Pressure', query: 'What does high blood pressure mean and what foods help?' },
    { label: 'Sugar-Salt Solution (SSS)', query: 'How do I prepare Sugar-Salt Solution for diarrhea or cholera dehydration?' },
    { label: 'Missed Medication Dose', query: 'What should I do if I forget to take a dose of my medication?' },
    { label: 'Diabetes Diet in Zimbabwe', query: 'What traditional Zimbabwean foods are best for managing diabetes?' },
    { label: 'Asthma Inhaler Technique', query: 'How do I properly use a reliever inhaler during wheezing?' },
  ];

  const handleSend = async (queryToSend?: string) => {
    const query = queryToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    // Prepare patient context string for Gemini
    const patientContext = `Patient: ${userProfile.fullName}, Conditions: ${chronicConditions.map(c => c.conditionName).join(', ')}, Allergies: ${allergies.map(a => a.allergen).join(', ')}, Current Medications: ${medications.map(m => `${m.name} ${m.strength}`).join(', ')}`;

    try {
      let replyText = '';
      let isEmergency = false;
      let actions: string[] | undefined;

      // Try server Gemini API if browser is online
      if (navigator.onLine) {
        try {
          const res = await fetch('/api/ai/health-assistant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: query,
              language,
              context: patientContext,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            replyText = data.reply;
          }
        } catch {
          // fallback to offline knowledge engine
        }
      }

      // If offline or if server call failed, use the robust offline medical knowledge engine
      if (!replyText) {
        const offlineResult = processOfflineHealthQuery(query, language);
        replyText = offlineResult.reply;
        isEmergency = offlineResult.isEmergencyAlert;
        actions = offlineResult.suggestedActions;
      }

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergencyAlert: isEmergency,
        suggestedActions: actions,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const offlineResult = processOfflineHealthQuery(query, language);
      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: offlineResult.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergencyAlert: offlineResult.isEmergencyAlert,
        suggestedActions: offlineResult.suggestedActions,
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter health library articles
  const categories = ['All', 'Chronic Diseases', 'First Aid', 'Medication Safety', 'Children’s Health', 'Infectious Diseases'];
  const filteredArticles = HEALTH_ARTICLES.filter(a => {
    const matchesCat = selectedCategory === 'All' || a.category === selectedCategory;
    const q = librarySearch.toLowerCase();
    const matchesSearch = 
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.localKeywords.some(k => k.toLowerCase().includes(q));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-150">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>AI Health Information Assistant</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
              Offline Capable
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Clinical guidance • First aid • Medication instructions • Offline library
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-slate-200/60 p-1 rounded-2xl text-xs">
        <button
          onClick={() => setActiveTab('assistant')}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'assistant' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Interactive Health AI</span>
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'library' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Offline Health Library ({HEALTH_ARTICLES.length})</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE AI ASSISTANT */}
      {activeTab === 'assistant' && (
        <div className="space-y-4">
          
          {/* Prominent Medical Disclaimer Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 flex items-start gap-2.5 text-xs shadow-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-snug">
              <strong className="font-bold">Clinical Safety Notice:</strong> Comfort Medi+ AI provides educational health information only. It will never diagnose illnesses, prescribe medication, or replace a licensed clinical medical professional.
            </div>
          </div>

          {/* Quick Questions Carousel */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Suggested Questions
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.query)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-medium whitespace-nowrap shadow-sm active:scale-95 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Container */}
          <div className="rounded-3xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4 min-h-[380px] max-h-[520px] overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                  msg.sender === 'user' 
                    ? 'bg-teal-600 text-white rounded-tr-none' 
                    : msg.isEmergencyAlert 
                    ? 'bg-rose-50 border-2 border-rose-300 text-rose-950 rounded-tl-none shadow-md' 
                    : 'bg-slate-50 border border-slate-200/70 text-slate-800 rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-line prose-xs">
                    {msg.text}
                  </div>

                  {msg.isEmergencyAlert && (
                    <div className="pt-2 border-t border-rose-200 flex flex-wrap gap-2">
                      <a
                        href="tel:999"
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Dial 999 Emergency</span>
                      </a>
                    </div>
                  )}

                  <span className={`block text-[10px] text-right mt-1 ${
                    msg.sender === 'user' ? 'text-teal-200' : 'text-slate-400'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-center text-xs text-slate-400 italic">
                <div className="w-8 h-8 rounded-xl bg-teal-600/10 text-teal-600 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>Comfort Medi+ AI is consulting health guidelines...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about medications, blood pressure, symptoms, first aid..."
              className="flex-1 p-3.5 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-4 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>

        </div>
      )}

      {/* TAB 2: OFFLINE HEALTH LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          
          {/* Search & Categories */}
          <div className="space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                placeholder="Search medical topics, cholera, hypertension, diabetes..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                    selectedCategory === cat 
                      ? 'bg-teal-600 text-white shadow-sm' 
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Article Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="cursor-pointer rounded-3xl bg-white p-5 border border-slate-200/80 shadow-sm hover:border-teal-500/40 hover:shadow-md transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800">
                      {article.category}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      {article.readTimeMin} min read
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-3">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-teal-700">Read Offline Article</span>
                  <ExternalLink className="w-3.5 h-3.5 text-teal-600" />
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12 text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
              No health articles found matching your search.
            </div>
          )}
        </div>
      )}

      {/* ARTICLE DETAIL MODAL */}
      {selectedArticle && (
        <div 
          onClick={() => setSelectedArticle(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider">
                  {selectedArticle.category} • {selectedArticle.readTimeMin} min read
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                  {selectedArticle.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 text-xs text-slate-700 leading-relaxed whitespace-pre-line space-y-3">
              {selectedArticle.content}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
