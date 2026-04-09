/**
 * TypeScript interfaces cho Authentication
 */

export interface AuthData {
  authenticated: boolean;
  timestamp: number; // Date.getTime() - milliseconds
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  refreshSession: () => void;
  getRemainingTime: () => number; // Phút còn lại
}
