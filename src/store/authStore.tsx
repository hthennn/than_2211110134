import { create } from "zustand";
import { AuthState } from "@/types/types";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

// Cookie management helpers
class CookieManager {
  static set(
    name: string,
    value: string,
    options: {
      expires?: number;
      secure?: boolean;
      sameSite?: "Strict" | "Lax" | "None";
    } = {}
  ) {
    let cookieString = `${name}=${encodeURIComponent(value)}`;

    if (options.expires) {
      const date = new Date();
      date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);dddd
      cookieString += `; expires=${date.toUTCString()}`;
    }

    cookieString += "; path=/";

    if (options.secure && process.env.NODE_ENV === "production")
      cookieString += "; Secure";

    if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`;

    document.cookie = cookieString;
  }

  static delete(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; ${
      process.env.NODE_ENV === "production" ? "Secure;" : ""
    } SameSite=Lax;`;
  }

  static check(name: string): boolean {
    return document.cookie.includes(`${name}=true`);
  }
}

// Zustand store with correct typing and performance optimizations
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  userInfo: null,
  login: async (username, password) => {
    try {
      const res = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        CookieManager.set("isAuthenticated", "true", {
          expires: 7,
          secure: true,
          sameSite: "Lax",
        });

        await get().checkAuth();
        return true;
      } else {
        console.error("Đăng nhập không thành công:", data.message);
        return false;
      }
    } catch (err) {
      set({
        isAuthenticated: false,
        userInfo: null,
        loading: false,
      });

      CookieManager.delete("isAuthenticated");
      localStorage.removeItem("auth-storage");
      console.error("Login error:", err);
      return false;
    }
  },

  fetchUserInfo: async () => {
    try {
      const res = await fetch(`${baseURL}/auth/me`, {
        method: "GET",
        headers: {},
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        set({ user: data.data });
      } else {
        console.warn("Failed to fetch user info");
        set({ user: null });
      }
    } catch (err) {
      console.error("fetchUserInfo error:", err);
      set({ user: null });
    }
  },

  checkAuth: async () => {
    try {
      const res = await fetch(`${baseURL}/auth/me`, {
        method: "GET",
        headers: {},
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        CookieManager.set("isAuthenticated", "true", {
          expires: 7,
          secure: true,
          sameSite: "Lax",
        });

        set({
          isAuthenticated: true,
          userInfo: data.data,
          loading: false,
        });

        set({ user: data.data });
        return data.data;
      } else {
        set({ user: null });
        return null;
      }
    } catch (err) {
      console.error("checkAuth error:", err);
      set({ user: null });
      return null;
    }
  },

  logout: async () => {
    try {
      set({ loading: true });

      // Try server logout
      try {
        const res = await fetch(`${baseURL}/auth/logout`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          console.warn("Server logout failed, continuing with local logout");
        }
      } catch (error) {
        console.log("Server logout error:", error);
      }

      // Always perform local logout
      CookieManager.delete("isAuthenticated");
      localStorage.removeItem("auth-storage");

      set({
        isAuthenticated: false,
        userInfo: null,
      });

      console.log("Logged out successfully!");
      window.location.href = "/login";
    } catch (error) {
      console.error("Unexpected logout error:", error);

      // Force logout anyway
      CookieManager.delete("isAuthenticated");
      localStorage.removeItem("auth-storage");

      set({
        isAuthenticated: false,
        userInfo: null,
      });

      window.location.href = "/login";
    } finally {
      set({ loading: false });
    }
  },
}));
