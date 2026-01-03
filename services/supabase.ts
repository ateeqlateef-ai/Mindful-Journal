import { createClient } from '@supabase/supabase-js';
import { JournalEntry } from '../types.ts';

const SUPABASE_URL = 'https://piruvtgmtkgamaejvygb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpcnV2dGdtdGtnYW1hZWp2eWdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNTA5OTQsImV4cCI6MjA4MjkyNjk5NH0.yONBBPxzuUoFe9kzZAyFopYGU6DkBCFXU57yrjF8lMc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to map DB record to JournalEntry type
const mapEntry = (data: any): JournalEntry => ({
  id: data.id,
  userId: data.user_id,
  title: data.title || '',
  content: data.content || '',
  date: data.date || new Date().toISOString(),
  mood: data.mood,
  aiReflection: data.aiReflection,
  lastModified: data.last_modified || new Date().toISOString(),
});

export const SupabaseService = {
  async getEntries(): Promise<JournalEntry[]> {
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.warn("Supabase fetch error (check if 'entries' table exists):", error.message);
        return [];
      }
      return (data || []).map(mapEntry);
    } catch (err) {
      console.error("Failed to fetch entries:", err);
      return [];
    }
  },

  async getEntryById(id: string): Promise<JournalEntry | null> {
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) return null;
      return mapEntry(data);
    } catch (err) {
      console.error(`Failed to fetch entry ${id}:`, err);
      return null;
    }
  },

  async saveEntry(entry: Partial<JournalEntry>): Promise<JournalEntry> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const dbData: any = {
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      aiReflection: entry.aiReflection,
      user_id: user.id,
      last_modified: new Date().toISOString(),
    };

    if (entry.id) dbData.id = entry.id;
    if (entry.date) dbData.date = entry.date;

    const { data, error } = await supabase
      .from('entries')
      .upsert(dbData)
      .select()
      .single();

    if (error) throw error;
    return mapEntry(data);
  },

  async deleteEntry(id: string): Promise<void> {
    const { error } = await supabase
      .from('entries')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};