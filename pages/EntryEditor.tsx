
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, JournalEntry } from '../types';
import { SupabaseService } from '../services/supabase';
import { Button } from '../components/Button';
import { getAIReflection } from '../services/gemini';

interface EntryEditorProps {
  user: User;
}

export const EntryEditor: React.FC<EntryEditorProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [aiReflection, setAiReflection] = useState<string | undefined>();
  const [mood, setMood] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const loadEntry = async () => {
      if (id && id !== 'new') {
        const entry = await SupabaseService.getEntryById(id);
        if (entry) {
          setTitle(entry.title);
          setContent(entry.content);
          setAiReflection(entry.aiReflection);
          setMood(entry.mood);
        } else {
          navigate('/dashboard');
        }
      }
    };
    loadEntry();
  }, [id, user.id, navigate]);

  const handleSave = async (reflectionData?: { reflection: string, mood: string }) => {
    if (!title.trim() || !content.trim()) return;

    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      const entryData: Partial<JournalEntry> = {
        title,
        content,
        date: id === 'new' ? now : undefined, // Keep original date if editing
        aiReflection: reflectionData ? reflectionData.reflection : aiReflection,
        mood: reflectionData ? reflectionData.mood : mood
      };

      if (id && id !== 'new') {
        entryData.id = id;
      }

      await SupabaseService.saveEntry(entryData);
      navigate('/dashboard');
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAIAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    const result = await getAIReflection(content);
    setAiReflection(result.reflection);
    setMood(result.mood);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 px-4 h-16 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <i className="fa-solid fa-arrow-left mr-2"></i> Back
          </Button>
          <div className="h-6 w-px bg-slate-200"></div>
          <span className="text-sm font-semibold text-slate-500">
            {id === 'new' ? 'New Journal Entry' : 'Editing Entry'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleAIAnalyze} isLoading={isAnalyzing} disabled={!content.trim()}>
            <i className="fa-solid fa-sparkles mr-2 text-indigo-500"></i> Get Reflection
          </Button>
          <Button onClick={() => handleSave()} isLoading={isSaving} disabled={!title.trim() || !content.trim()}>
            Save Entry
          </Button>
        </div>
      </header>

      {/* Editor Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 flex flex-col md:flex-row gap-12">
        <div className="flex-1 flex flex-col gap-6">
          <input 
            type="text"
            placeholder="Entry Title..."
            className="text-4xl font-bold text-slate-900 border-none outline-none placeholder:text-slate-300 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            {mood && (
              <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium text-xs">
                Mood: {mood}
              </span>
            )}
          </div>
          <textarea 
            placeholder="Start writing your thoughts here..."
            className="flex-1 text-xl leading-relaxed text-slate-700 font-serif border-none outline-none resize-none placeholder:text-slate-200 min-h-[400px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        {/* Sidebar Insights */}
        {(aiReflection || isAnalyzing) && (
          <aside className="w-full md:w-72 flex flex-col gap-6">
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
              <h3 className="flex items-center gap-2 font-bold text-indigo-900 mb-4">
                <i className="fa-solid fa-sparkles"></i> Lumina Reflection
              </h3>
              {isAnalyzing ? (
                <div className="space-y-3">
                  <div className="h-3 bg-indigo-200/50 rounded animate-pulse"></div>
                  <div className="h-3 bg-indigo-200/50 rounded animate-pulse w-4/5"></div>
                  <div className="h-3 bg-indigo-200/50 rounded animate-pulse w-2/3"></div>
                </div>
              ) : (
                <>
                  <p className="text-indigo-800 leading-relaxed mb-4 italic">"{aiReflection}"</p>
                  <div className="pt-4 border-t border-indigo-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Estimated Mood</span>
                    <span className="font-bold text-indigo-700">{mood}</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-amber-900 mb-2">Writing Tip</h3>
              <p className="text-sm text-amber-800">Journaling regularly helps lower stress and clarify your vision. Try writing for at least 5 minutes every morning.</p>
            </div>
          </aside>
        )}
      </main>
    </div>
  );
};
