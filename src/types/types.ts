export interface UserData {
  _id: string;
  username: string;
  name: string;
  email: string;
}

export interface PersistedUserInfo {
  _id: string;
  username: string;
  name: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  userInfo: UserData | null;
  loading: boolean;
  user: any;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchUserInfo: () => Promise<void>;
  checkAuth: () => Promise<void>;
}