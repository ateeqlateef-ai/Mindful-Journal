
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  date: string;
  mood?: string;
  aiReflection?: string;
  lastModified: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
