import React, { useState } from 'react';
import { Bot, Sparkles, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import useAIStore from '../../store/ai.store';

const ClassroomIdeaSpark = ({ classroomId }) => {
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { isTokensExhausted, setVirtualTokens, setNextResetAt } = useAIStore();

  const handleGenerateIdeas = async () => {
    if (!topic.trim()) {
      toast.warning('Please enter a topic to spark ideas for.');
      return;
    }
    
    setIsGenerating(true);
    setIdeas('');
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      const res = await fetch(`${baseUrl}/ai/idea-spark`, {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ topic, classroomId })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 429) {
           setVirtualTokens(0);
           if (data.nextResetAt) setNextResetAt(data.nextResetAt);
           toast.error(data.message || 'Daily AI token limit reached.');
           return;
        }
        throw new Error(data.error || 'Failed to generate ideas');
      }
      
      setIdeas(data.content);
      if (data.remainingTokens !== undefined) {
        window.dispatchEvent(new CustomEvent('aiTokensUpdate', { detail: data.remainingTokens }));
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center py-8 px-4 bg-[#FAFCFA] dark:bg-[#121612] overflow-y-auto">
      <div className="max-w-3xl w-full flex flex-col gap-6">
        <div className="bg-gradient-to-br from-[#5D7C59] to-[#4A6447] rounded-3xl p-8 text-center relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 border border-white/30 shadow-sm">
              <Sparkles size={32} className="text-[#FFC700]" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Classroom Idea Spark</h2>
            <p className="text-white/80 font-medium max-w-md mx-auto text-sm">
              Stuck on what to teach next? Enter a topic and L I K H Â AI will brainstorm creative lesson plans, project ideas, and discussion prompts.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A211A] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 flex flex-col gap-3">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Topic or Subject Area</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. The Solar System, Python Basics, History of Art..."
              className="flex-1 bg-[#FAFCFA] dark:bg-[#232B23] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#5D7C59] outline-none min-w-0"
            />
            <button 
              onClick={handleGenerateIdeas}
              disabled={isGenerating || !topic.trim() || isTokensExhausted()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#5D7C59] text-white font-bold flex items-center justify-center gap-2 shadow-md hover:bg-[#4A6447] transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer shrink-0"
            >
              {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <><Sparkles size={16} /> Spark Ideas</>}
            </button>
          </div>
        </div>

        {ideas && (
          <div className="bg-white dark:bg-[#1A211A] rounded-2xl p-8 shadow-sm border border-[#5D7C59]/20" style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Bot className="text-[#5D7C59]" size={20} /> AI Suggestions
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none font-sans whitespace-pre-wrap">
              {ideas}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomIdeaSpark;
