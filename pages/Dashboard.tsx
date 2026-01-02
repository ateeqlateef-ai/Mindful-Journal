
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { JournalEntry, User } from '../types';
import { SupabaseService } from '../services/supabase';
import { Button } from '../components/Button';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await SupabaseService.getEntries();
        setEntries(data);
      } catch (error) {
        console.error("Failed to fetch entries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, [user.id]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this entry?')) {
      try {
        await SupabaseService.deleteEntry(id);
        setEntries(entries.filter(e => e.id !== id));
      } catch (error) {
        alert("Failed to delete entry.");
      }
    }
  };

  const filteredEntries = entries.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) || 
    e.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
              <i className="fa-solid fa-feather-pointed text-white text-sm"></i>
            </div>
            <span className="font-bold text-lg text-slate-900">Lumina</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-slate-500 font-medium">Hello, {user.name}</span>
            <Button variant="ghost" size="sm" onClick={onLogout}>Logout</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Your Journal</h1>
            <p className="text-slate-500">
              {isLoading ? 'Loading entries...' : `${entries.length} memories captured`}
            </p>
          </div>
          <Button onClick={() => navigate('/editor/new')}>
            <i className="fa-solid fa-plus mr-2"></i> New Entry
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text"
            placeholder="Search entries..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Entries Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200 h-48 animate-pulse"></div>
            ))}
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-book-open text-slate-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-800">No entries found</h3>
            <p className="text-slate-500 mb-6">Start documenting your thoughts and journey today.</p>
            <Button onClick={() => navigate('/editor/new')}>Write your first entry</Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map(entry => (
              <Link 
                key={entry.id} 
                to={`/editor/${entry.id}`}
                className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {entry.mood && (
                    <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full font-medium">
                      {entry.mood}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{entry.title}</h3>
                <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1">{entry.content}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <span className="text-xs text-slate-400 italic">
                    {entry.aiReflection ? 'Reflected by Lumina AI' : 'Draft'}
                  </span>
                  <button 
                    onClick={(e) => handleDelete(entry.id, e)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
