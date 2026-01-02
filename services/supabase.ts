
import { createClient } from '@supabase/supabase-js';
import { JournalEntry } from '../types';

const SUPABASE_URL = 'https://piruvtgmtkgamaejvygb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpcnV2dGdtdGtnYW1hZWp2eWdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNTA5OTQsImV4cCI6MjA4MjkyNjk5NH0.yONBBPxzuUoFe9kzZAyFopYGU6DkBCFXU57yrjF8lMc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to map DB record to JournalEntry type
const mapEntry = (data: any): JournalEntry => ({
  id: data.id,
  userId: data.user_id,
  title: data.title,
  content: data.content,
  date: data.date,
  mood: data.mood,
  aiReflection: data.aiReflection,
  lastModified: data.last_modified,
});

export const SupabaseService = {
  async getEntries(): Promise<JournalEntry[]> {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapEntry);
  },

  async getEntryById(id: string): Promise<JournalEntry | null> {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return mapEntry(data);
  },

  async saveEntry(entry: Partial<JournalEntry>): Promise<JournalEntry> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Map frontend camelCase to DB snake_case for the upsert
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
