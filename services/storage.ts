
import { User, JournalEntry } from '../types.ts';

const USERS_KEY = 'lumina_users';
const ENTRIES_KEY = 'lumina_entries';
const SESSION_KEY = 'lumina_session';

export const StorageService = {
  // Users
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUser: (user: User & { password?: string }) => {
    const users = StorageService.getUsers();
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  },

  // Session
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  setSession: (user: User | null) => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  },

  // Journal Entries
  getEntries: (userId: string): JournalEntry[] => {
    const data = localStorage.getItem(ENTRIES_KEY);
    const allEntries: JournalEntry[] = data ? JSON.parse(data) : [];
    return allEntries.filter(entry => entry.userId === userId).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  saveEntry: (entry: JournalEntry) => {
    const data = localStorage.getItem(ENTRIES_KEY);
    let allEntries: JournalEntry[] = data ? JSON.parse(data) : [];
    
    const index = allEntries.findIndex(e => e.id === entry.id);
    if (index >= 0) {
      allEntries[index] = entry;
    } else {
      allEntries.push(entry);
    }
    
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(allEntries));
  },

  deleteEntry: (entryId: string) => {
    const data = localStorage.getItem(ENTRIES_KEY);
    let allEntries: JournalEntry[] = data ? JSON.parse(data) : [];
    allEntries = allEntries.filter(e => e.id !== entryId);
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(allEntries));
  },

  getEntryById: (entryId: string): JournalEntry | undefined => {
    const data = localStorage.getItem(ENTRIES_KEY);
    const allEntries: JournalEntry[] = data ? JSON.parse(data) : [];
    return allEntries.find(e => e.id === entryId);
  }
};
