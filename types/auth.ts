export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  refreshUser: () => Promise<void>;
}
